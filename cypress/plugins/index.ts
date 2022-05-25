/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const {GoogleSocialLogin} = require('cypress-social-logins').plugins
// require('dotenv').config()

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
export default (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  // // config for dotenv
  // require('dotenv').config()

  // environment config
  // config.env.googleRefreshToken = process.env.GOOGLE_REFRESH_TOKEN
  // config.env.googleClientId = process.env.APP_GOOGLE_CLIENTID
  // config.env.googleClientSecret = process.env.APP_GOOGLE_CLIENT_SECRET

  // config.env.googleSocialLoginUsername = process.env.googleSocialLoginUsername
  // config.env.googleSocialLoginPassword = process.env.googleSocialLoginPassword
  // config.env.loginUrl = process.env.loginUrl
  // config.env.cookieName = process.env.cookieName

  on('task', {
    GoogleSocialLogin: GoogleSocialLogin
  })

  return config
}