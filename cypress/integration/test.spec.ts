import { Utils } from "../support/utils"

describe("Gmail tests", () => {

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
        it("User should have 4 emails in mailbox", () => {
            cy.getVariable('access_token').then(access_token => {
                cy.request({
                    method: 'GET',
                    url: gmailAPIUrl + '/messages',
                    headers: { Authorization: `Bearer ${access_token}` }
                }).then(({ body }) => {
                    expect(body.messages).to.have.lengthOf(4)
                })
            })
        })

        it("Validate the email's content", () => {
            cy.getVariable('access_token').then(access_token => {

                // Get list of emails
                cy.request({
                    method: 'GET',
                    url: gmailAPIUrl + '/messages',
                    headers: { Authorization: `Bearer ${access_token}` }
                }).then(({ body }) => {

                    // Get first email id
                    let emailId = body.messages[0].id
                    cy.request({
                        method: 'GET',
                        url: gmailAPIUrl + `/messages/${emailId}`,
                        headers: { Authorization: `Bearer ${access_token}` }
                    }).then(({ body }) => {

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

    context("Send emails then trash and delete", () => {
        it("Send an email to other mailbox", () => {
            cy.getVariable('access_token').then(access_token => {
                let emailBody = {
                    to: 'autotest134@mailinator.com',
                    from: 'automationtest134@gmail.com',
                    subject: 'This is for testing',
                    message: 'Dear, I would like to send this email.'
                }

                cy.request({
                    method: 'POST',
                    url: gmailAPIUrl + '/messages/send',
                    headers: { Authorization: `Bearer ${access_token}` },
                    body: {
                        raw: Utils.makeEmailBody(emailBody.to, emailBody.from, emailBody.subject, emailBody.message)
                    },
                }).then(({ body }) => {
                    cy.log(body)
                })
            })
        })

        it("Trash an email", () => {
            cy.getVariable('access_token').then(access_token => {
                // Get list of emails
                cy.request({
                    method: 'GET',
                    url: gmailAPIUrl + '/messages',
                    headers: { Authorization: `Bearer ${access_token}` }
                }).then(({ body }) => {

                    // Get id of newest sent email
                    let emailIdToTrash = body.messages[0].id

                    // Store id of email to delete
                    cy.setVariable("emailIdtoDelete", emailIdToTrash)

                    // Trash email
                    cy.request({
                        method: 'POST',
                        url: gmailAPIUrl + `/messages/${emailIdToTrash}/trash`,
                        headers: { Authorization: `Bearer ${access_token}` }
                    }).then(({ body }) => {
                        cy.log(body)
                    })
                })
            })
        })

        it("Delete an email", () => {
            cy.getVariable('access_token').then(access_token => {
                cy.getVariable('emailIdtoDelete').then(emailId => {
                    // Delete email
                    cy.request({
                        method: 'DELETE',
                        url: gmailAPIUrl + `/messages/${emailId}`,
                        headers: { Authorization: `Bearer ${access_token}` }
                    }).then(({ body }) => {
                        cy.log(body)
                    })
                })
            })
        })
    })
})