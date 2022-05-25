class LoginPage {
    USERNAME_INPUT = '#identifierId'
    PASSWORD_INPUT = '[name="password"]'
    LOGIN_PAGE_URL = 'https://accounts.google.com/signin/v2/'

    // navigateLoginPage() {
    //     cy.origin(this.LOGIN_PAGE_URL, () => {
    //         cy.visit(this.LOGIN_PAGE_URL)
    //     })
    //     return this
    // }

    // typeUsername(username: string) {
    //     cy.get(this.USERNAME_INPUT).type(username).as('username')
    //     cy.get('@username').invoke('text').should('equal', username)
    //     return this
    // }

    // typePassword(password: string) {
    //     cy.get(this.PASSWORD_INPUT).type(password).as('password')
    //     cy.get('@password').invoke('text').should('equal', password)
    //     return this
    // }

    // login(username: string, password: string){
    //     cy.visit('')
    //     this.navigateLoginPage()
    //     this.typeUsername(username)
    //     cy.type('{enter}')
    //     this.typePassword(password)
    //     cy.type('{enter}')
    // }
}

export { LoginPage }