import React from 'react'
import ReactDOM from 'react-dom'
import injectTapEventPlugin from 'react-tap-event-plugin'
import { BrowserRouter as Router } from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker'
import App from './App/App'
import { ApiClient } from './lib/contactually-api'
import './index.css'

const apiClient = new ApiClient();
injectTapEventPlugin();

if (true) {
  // the API has been authenticated for use, we can render the react app
  ReactDOM.render(<Router><App /></Router>, document.getElementById('root'))
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
