import { Utils } from "../support/utils"

describe("Gmail tests - Send Trash and Delete", () => {

    let gmailAPIUrl = Cypress.config('baseUrl') + '/gmail/v1/users/me'

    beforeEach(() => {
        cy.loginByGoogleApi()
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
                }).then(({ status, body }) => {
                    cy.log(body)

                    // Validate status
                    expect(status).to.equal(200)

                    // Validate label
                    expect(body.labelIds[0]).to.equal('SENT')
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
                    }).then(({ status, body }) => {
                        cy.log(body)

                        // Validate status
                        expect(status).to.equal(200)

                        // Validate label 
                        expect(body.labelIds[0]).to.equal('TRASH')
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
                    }).then(({ status, body }) => {
                        cy.log(body)

                        // Validate status
                        expect(status).to.equal(204)
                    })
                })
            })
        })
    })
})