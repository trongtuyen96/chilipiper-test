// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

const runtime_vars_file = 'cypress/runtime-vars.json'

Cypress.Commands.add('dataCy', (value) => {
    return cy.get(`[data-cy=${value}]`)
})

Cypress.Commands.add('switchToIframe', (iframeSelector, ...elSelector) => {
    return cy
        .get(iframeSelector, { timeout: 10000 })
        .should($iframe => {
            // when passed multiple elSelector asserts each of them exists
            for (let i = 0; i < elSelector.length; i++) {
                expect($iframe.contents().find(elSelector[i] || 'body')).to.exist
            }
        })
        .then($iframe => {
            return cy.wrap($iframe.contents().find('body'))
        })
})

Cypress.Commands.add('setVariable', (key: string, value: any) => {
    cy.readFile(runtime_vars_file).then((obj) => {
        obj[key] = value
        // write the merged object
        cy.writeFile(runtime_vars_file, obj)
    })
})

Cypress.Commands.add('getVariable', (key: string) => {
    cy.readFile(runtime_vars_file).then((obj) => {
        return cy.wrap(obj[key])
    })
})

Cypress.Commands.add('loginByGoogleApi', () => {
    cy.log('Logging in to Google')
    // Cypress.Cookies.debug(true)
    // Cypress.Cookies.preserveOnce()
    // cy.intercept('/')

    cy.request({
        method: 'POST',
        url: Cypress.config('baseUrl') + '/oauth2/v4/token',
        body: {
            grant_type: 'refresh_token',
            client_id: Cypress.env('client_id'),
            client_secret: Cypress.env('client_secret'),
            refresh_token: Cypress.env('refresh_token')
        },
    }).then(({ body }) => {
        cy.log(body);
        const { access_token, id_token } = body

        // store access_token and id_token
        cy.setVariable('access_token', access_token)
        cy.setVariable('id_token', id_token)

        cy.request({
            method: 'GET',
            url: Cypress.config('baseUrl') + '/oauth2/v3/userinfo',
            headers: { Authorization: `Bearer ${access_token}` }
        }).then(({ body }) => {
            cy.log(body)

            const userItem = {
                token: id_token,
                user: {
                    googleId: body.sub,
                    email: body.email,
                    givenName: body.given_name,
                    familyName: body.family_name,
                    imageUrl: body.picture,
                }
            }

            window.localStorage.setItem('googleCypress', JSON.stringify(userItem))


            // cy.setCookie('oauthAccessToken', access_token)
            // cy.setCookie('accessToken', access_token)
            // cy.setCookie('oauthIdToken', id_token)
            // cy.setCookie('idToken', id_token)
            // cy.setCookie('federatedId', 'https://accounts.google.com/118101221163971821685')
            // cy.setCookie('access_token', access_token)
            // cy.setCookie('id_token', id_token)
            // cy.setCookie('lastLoginedProvider','google.com')

            // window.localStorage.setItem('oauthAccessToken', access_token)
            // window.localStorage.setItem('accessToken', access_token)
            // window.localStorage.setItem('oauthIdToken', id_token)
            // window.localStorage.setItem('idToken', id_token)
            // window.localStorage.setItem('federatedId', 'https://accounts.google.com/118101221163971821685')
            // window.localStorage.setItem('access_token', access_token)
            // window.localStorage.setItem('id_token', id_token)

            // cy.visit('/')
        })
    })
})