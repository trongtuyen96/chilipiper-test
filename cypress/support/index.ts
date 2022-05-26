// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import 'dotenv'
import 'cypress-mochawesome-reporter/register';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// in cypress/support/index.ts

declare global {
    namespace Cypress {
        interface Chainable {
            /**
             * Custom command to select DOM element by data-cy attribute.
             * @param count=1
             * @example cy.dataCy('greeting')
             */
            dataCy(value: string): Chainable<JQuery<HTMLElement>>

            /**
             * Custom command for IFrame Selector
             * @param count=not-fixed
             * @example cy.switchToIframe('#iframe','span')
             */
            switchToIframe(iframeSelector: string, ...elSelector: string[]): Chainable<any>

            /**
            * Custom command for Google Authentication
            * @param count=0
            * @example cy.loginByGoogleApi()
            */
            loginByGoogleApi(): Chainable<any>

            /**
            * Custom command for setting a variable
            * @param count=2
            * @example cy.setVariable(key: string, value: any)
            */
            setVariable(key: string, value: any): Chainable<any>

             /**
            * Custom command for getting a variable
            * @param count=1
            * @example cy.getVariable(key: string)
            */
            getVariable(key: string): Chainable<Object>
        }
    }
}

