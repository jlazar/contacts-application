import _ from 'lodash'

/**
 * When converting to snake case dots are treated as word breaks and removed
 * in place of an underscore. This preserves dots while snake casing the rest.
 *
 * @param   {string} string
 * @returns {string}
 */
const snakeCasePreservingDots = (string) => {
  return string.match('.')
    ? string.split('.').map(_.snakeCase).join('.')
    : _.snakeCase(string)
}

/**
 * Recursively convert a value from Immutable to object.
 *
 * @param {object|array} input - e.g. contact
 * @param {function} func - e.g. _.camelCase
 * @returns {object|array} Object or Array with renamed keys
 */
const toJS = (input) => {
  if (input && input.toJS) {
    return input.toJS()
  } else if (_.isArray(input)) {
    return input.map(toJS)
  } else if (_.isObject(input)) {
    return _.reduce(input, (memo, value, key) => {
      memo[key] = toJS(value)
      return memo
    }, {})
  } else {
    return input
  }
}

/**
 * Convenience function to recursively update object key names programatically.
 *
 * @param {object|array} input - e.g. contact
 * @param {function} func - e.g. _.camelCase
 * @returns {object|array} Object or Array with renamed keys
 */
const transformKeys = (input, func) => {
  if (!_.isFunction(func)) throw new Error('Must pass a transform function')

  const transform = (value) => transformKeys(value, func)

  if (_.isArray(input)) {
    return input.map(transform)
  } else if (_.isObject(input)) {
    return _.reduce(input, (result, value, key) => {
      result[func(key)] = transform(value)
      return result
    }, {})
  } else {
    return input
  }
}

export default {
  snakeCasePreservingDots,
  toJS,
  transformKeys
}
