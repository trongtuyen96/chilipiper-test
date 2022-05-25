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
        it("User should have 6 emails in mailbox", () => {
            cy.getVariable('access_token').then(access_token => {
                cy.request({
                    method: 'GET',
                    url: gmailAPIUrl + '/messages',
                    headers: { Authorization: `Bearer ${access_token}` }
                }).then(({ body }) => {
                    expect(body.messages).to.have.lengthOf(7)
                    cy.wrap(body.messages).should("have.length", 7)
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
                    let emailId = body.messages[3].id
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

    context("Send emails", () => {
        it("Send an email to other mailbox", () => {
            // cy.getVariable('access_token').then(access_token => {
            //     cy.request({
            //         method: 'POST',
            //         url: gmailAPIUrl + '/messages/send',
            //         headers: { Authorization: `Bearer ${access_token}` },
            //         body: {
            //             labelIds: [
            //                 "IMPORTANT"
            //             ],
            //             snippet: "Dear Receiver, This is a sample email. Sincerely, Test Automation.",
            //             payload: {
            //                 headers: [
            //                     {
            //                         name: "Delivered-To",
            //                         value: "automationtest134@gmail.com"
            //                     },
            //                     {
            //                         name: "Return-Path",
            //                         value: "<automationtest134@gmail.com>"
            //                     },
            //                     {
            //                         name: "From",
            //                         value: "Test Automation <automationtest134@gmail.com>"
            //                     },
            //                     {
            //                         name: "Subject",
            //                         value: "This is for testing"
            //                     },
            //                     {
            //                         name: "To",
            //                         value: "autotest134@mailinator.com"
            //                     }
            //                 ]
            //             }
            //         },
            //     }).then(({ body }) => {

            //     })
            // })

            cy.getVariable('access_token').then(access_token => {
                let raw = {
                    to: 'autotest134@mailinator.com',
                    from: 'automationtest134@gmail.com',
                    subject: 'test title',
                    message: 'test'
                }
                let subject = Buffer.from(raw.subject).toString("base64")
                let str = [
                    'Content-Type: text/plain; charset=\"UTF-8\"\n',
                    'MINE-Version: 1.0\n',
                    'Content-Transfer-Encoding: 7bit\n',
                    `to: ${raw.to} \n`,
                    `from: ${raw.from} \n`,
                    `subject: =?UTF-8?B?${subject}?= \n\n`,
                    raw.message
                ].join("");
                str = Buffer.from(str).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');


                cy.request({
                    method: 'POST',
                    url: gmailAPIUrl + '/messages/send',
                    headers: { Authorization: `Bearer ${access_token}` },
                    body: {
                       raw: str
                    },
                }).then(({ body }) => {
                    cy.log(body)
                })
            })
        })
    })
})