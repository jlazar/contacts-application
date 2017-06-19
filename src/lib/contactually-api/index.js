import ContactuallyApiClient from './client'

const clientId = 'dda533097750d4648711a5679d0eb85af9218793ea8715d0d933d4f6'
const authUrl = 'https://staging.contactually.com/oauth2/authorize'
const baseUrl = 'https://api-staging.contactually.com'

export class ApiClient extends ContactuallyApiClient {
  constructor (options = {}) {
    const redirectUri = `${window.location.origin}/auth/contactually/callback`
    // Always build with the config options
    super(clientId, redirectUri, {
      authUrl,
      scopes: ['contactually:internal'],
      baseUrl,
      ...options
    })
  }
}
