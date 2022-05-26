import { Utils } from "../support/utils"

describe("Gmail tests - Login and View", () => {

    let gmailAPIUrl = Cypress.config('baseUrl') + '/gmail/v1/users/me'

    beforeEach(() => {
        cy.loginByGoogleApi()
    })

    context('Login via Google account', () => {
        it('Validate user account info', () => {
            let logInUser = JSON.parse(window.localStorage.getItem('googleCypress'))
            expect(logInUser.user.email).to.equal('automationtest134@gmail.com')
            expect(logInUser.user.familyName).to.equal('Automation')
            expect(logInUser.user.givenName).to.equal('Test')
            expect(logInUser.user.googleId).to.equal('108264805098261415095')
        })
    })

    context("Received emails of user", () => {
        it("User should have more than 4 emails in mailbox", () => {
            cy.getVariable('access_token').then(access_token => {
                cy.request({
                    method: 'GET',
                    url: gmailAPIUrl + '/messages',
                    headers: { Authorization: `Bearer ${access_token}` }
                }).then(({ status, body }) => {
                    expect(status).to.equal(200)
                    expect(body.messages).to.have.length.greaterThan(4)
                })
            })
        })

        it("Validate the email's content", () => {
            cy.getVariable('access_token').then(access_token => {

                // Get list of emails from trongtuyen96@gmail.com
                cy.request({
                    method: 'GET',
                    url: gmailAPIUrl + '/messages?q=from:trongtuyen96@gmail.com',
                    headers: { Authorization: `Bearer ${access_token}` },
                }).then(({ body }) => {

                    // Get first email id
                    let emailId = body.messages[0].id
                    cy.request({
                        method: 'GET',
                        url: gmailAPIUrl + `/messages/${emailId}`,
                        headers: { Authorization: `Bearer ${access_token}` }
                    }).then(({ status, body }) => {

                        // Validate status
                        expect(status).to.equal(200)

                        // Validate snippet
                        expect(body.snippet).to.include('Dear Test, This is a sample email. Sincerely,')

                        // Validate payload
                        cy.wrap(body.payload.headers).then(payloads => {
                            for (let i = 0; i < payloads.length; i++) {
                                switch (payloads[i].name) {
                                    case 'From':
                                        expect(payloads[i].value).to.equal('Tuyen Nguyen <trongtuyen96@gmail.com>')
                                        break
                                    case 'Subject':
                                        expect(payloads[i].value).to.equal('This is for testing')
                                        break
                                    case 'To':
                                        expect(payloads[i].value).to.equal('automationtest134@gmail.com')
                                        break
                                }
                            }
                        })
                    })
                })
            })
        })
    })
})