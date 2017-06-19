import _ from 'lodash'
import axios from 'axios'
import debounce from 'debounce-promise'
import store from 'store'
import queryString from 'query-string'

import Util from './utils'

// -----------------------------------------
// Storage keys
// -----------------------------------------
const DEFAULT_STORAGE_NAMESPACE = 'contactually-api'
const STORED_STATE_KEY = 'storedState'
const ACCESS_TOKEN_KEY = 'accessToken'

// -----------------------------------------
// Defaults
// -----------------------------------------
const DEFAULT_BASE_URL = 'https://api.contactually.com'
const DEFAULT_VERSION = 'v2'
const DEFAULT_SCOPES = ['user:login']
const DEFAULT_AUTH_URL = 'https://auth.contactually.com/oauth2/authorize'

/**
 * Ensures Immutable types are converted to JS and
 * object keys are reverted to snake case
 *
 * @param {object|Immutable} data
 * @returns {object}
 */
function formatForApi (data) {
  const apiData = Util.toJS(data)
  return Util.transformKeys(apiData, Util.snakeCasePreservingDots)
}

/**
 * Convert keys to camelcase
 *
 * @param {object|Immutable} data
 * @returns {object}
 */
function formatFromApi (data) {
  return Util.transformKeys(data, _.camelCase)
}

/**
 * Clean the response:
 * - Unwrap the body (i.e. move data, meta, errors directly onto the response)
 * - Remove config (contains irrelevant/sensitive data)
 * - Remove stack if an error (response error message + code should be sufficient)
 *
 * @param   {object} response
 * @returns {object}
 */
function cleanResponse (response) {
  const { data } = response

  return {
    ..._.omit(response, 'data', 'config', 'stack'),
    ...data
  }
}

/**
 * Contactually API Javascript Client
 */
class ContactuallyApiClient {
  /**
   * Instantiate with API Config options
   * @param {string} [clientId]
   * @param {string} [redirectUri]
   * @param {object} options - API Config
   * @param {string} [options.baseUrl]
   * @param {string} [options.version]
   * @param {string} [options.debounce]
   * @param {string} [options.authToken]
   * @param {string} [options.scopes]
   * @param {string} [options.authUrl]
   * @param {string} [options.storageNamespace]
   * @param {string} [options.stateStoreFunction]
   */
  constructor (clientId, redirectUri, options = {}) {
    const baseUrl = options.baseUrl || DEFAULT_BASE_URL
    const version = options.version || DEFAULT_VERSION

    // Create an instance of axios with defaults
    this.axios = axios.create({
      baseURL: `${baseUrl}/${version}`,
      transformParams: options.transformParams || formatForApi,
      // Perform our transform first, then the default which handles setting
      // headers appropriately.
      transformRequest: [
        options.transformRequest || formatForApi,
        ...axios.defaults.transformRequest
      ],
      // Perform the default transform first which handles parsing JSON.
      transformResponse: [
        ...axios.defaults.transformResponse,
        options.transformResponse || formatFromApi
      ]
    })

    const authUrl = options.authUrl || DEFAULT_AUTH_URL
    const scopes = options.scopes || DEFAULT_SCOPES
    this._tokenRequestUrl = authUrl +
      `?client_id=${clientId}` +
      `&scope=${scopes.join('+')}` +
      `&redirect_uri=${redirectUri}` +
      '&response_type=token'

    this._storageNamespace =
      options.storageNamespace || DEFAULT_STORAGE_NAMESPACE

    this._stateStoreFunction =
      options.stateStoreFunction || this._defaultStateStore

    this._rethrowRequestError =
      options.rethrowRequestError || false

    if (options.authToken) { this._setAccessToken(options.authToken) }

    // PUBLIC FUNCTIONS

    this.isAuthenticated = this.isAuthenticated
    this.requestOAuthToken = this.requestOAuthToken
    this.saveTokenAndReturnStoredData = this.saveTokenAndReturnStoredData

    this.request = _.isNumber(options.debounce)
      ? debounce(_.bind(this._request, this), options.debounce)
      : this._request

    /**
     * Construct class methods for API request methods,
     * partially applying the request() method
     */
    const methods = ['get', 'post', 'put', 'patch', 'delete']

    methods.forEach((method) => {
      this[method] = _.partial(this.request, method)
    })
  }

  isAuthenticated () {
    return _.isString(this._getAccessToken())
  }

  requestOAuthToken () {
    this._storeData(STORED_STATE_KEY, this._stateStoreFunction())

    this._redirect(this._tokenRequestUrl)
  }

  saveTokenAndReturnStoredData () {
    const responseHash = queryString.parse(window.location.hash)

    this._setAccessToken(responseHash.access_token)

    const storedState = this._getStoredState()
    this._removeData(STORED_STATE_KEY)

    return storedState
  }

  // PRIVATE

  _namespacedStoreKey (key) {
    return `${this._storageNamespace}.${key}`
  }

  /*
   * Wrap store calls to auto-namespace
   */
  _storeData (key, value) {
    return store.set(this._namespacedStoreKey(key), value)
  }

  _getData (key) {
    return store.get(this._namespacedStoreKey(key))
  }

  _removeData (key) {
    return store.remove(this._namespacedStoreKey(key))
  }

  /*
   * Store the current location by default
   */
  _defaultStateStore () {
    return { location: window.location }
  }

  _setAccessToken (newToken) {
    this._storeData(ACCESS_TOKEN_KEY, newToken)
  }

  _getAccessToken () {
    return this._getData(ACCESS_TOKEN_KEY)
  }

  _getStoredState () {
    return this._getData(STORED_STATE_KEY)
  }

  /**
   * Make a HTTP request using options passed in the call. For request config
   * see: https://github.com/mzabriskie/axios#request-config
   *
   * @param {string} method - HTTP method
   * @param {string} url - API endpoint
   * @param {object} [options] - Request options
   * @param {function} [options.onSuccess] - Callback for resolved promise
   * @param {function} [options.onError] - Callback for error handling
   *
   * @returns {Promise}
   */
  _request (method, url, options = {}) {
    if (!this.isAuthenticated()) return this.requestOAuthToken()

    const {
      onError,
      onSuccess,
      data,
      meta,
      rethrowRequestError = this._rethrowRequestError,
      ...requestOptions
    } = options

    /**
     * The 'data' attribute on these options represents the request body, but
     * the Contactually API expects the request data to be wrapped inside the
     * 'data' key of the body. We handle the wrapping here to prevent
     * consumers of this library from needing to do it.
     */
    requestOptions.data = { data, meta }

    return this._makeRequest(method, url, requestOptions)
      .then((response) => {
        // Unwrap 'data' and 'meta' and merge into response
        const modifiedResponse = cleanResponse(response)

        if (onSuccess) onSuccess(modifiedResponse)

        return modifiedResponse
      })
      .catch((error) => {
        // If there was no response that means this wasn't a request error so
        // we shouldn't try to handle it here.
        if (!error.response) throw error

        if (error.response.status === 401) {
          return this.requestOAuthToken()
        }

        // Unwrap 'errors' and merge into response
        error.response = cleanResponse(error.response)

        if (onError) {
          onError(error.response)

          // If onError was passed, return the response to prevent rethrowing
          // unless we're configured to always rethrow.
          if (!rethrowRequestError) return error.response
        }

        throw error
      })
  }

  _makeRequest (method, url, options) {
    const { transformParams = this.axios.defaults.transformParams } = options

    // transformParams is not technically an axios option so we need to
    // perform the transformation manually.
    const params = transformParams(options.params)

    return this.axios({
      ...options,

      method,
      url,
      params,
      headers: {
        'Authorization': `Bearer ${this._getAccessToken()}`,
        ...options.headers
      }
    })
  }

  _redirect (newPath) { window.location = newPath }
}

export default ContactuallyApiClient
