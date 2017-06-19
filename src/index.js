import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import './index.css'

import { ApiClient } from './lib/contactually-api'
const apiClient = new ApiClient()

if (apiClient.isAuthenticated()) {
  // the API has been authenticated for use, we can render the react app
  ReactDOM.render(<App />, document.getElementById('root'))
} else {
  // the API has not been authenticated for use, we will authenticate
  const url = window.location.pathname + window.location.hash
  const AUTH_URL_PATTERN = new RegExp('auth/contactually/callback')

  if (AUTH_URL_PATTERN.test(url)) {
    const response = apiClient.saveTokenAndReturnStoredData()
    window.location = response.location.href
  } else {
    apiClient.requestOAuthToken()
  }
}

registerServiceWorker()
