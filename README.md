<h1 align="center">
<img src="https://github.com/trongtuyen96/chilipiper-test/blob/6ee3a5aaae569326bb2aad5a5c5e7967d8376130/logo.png" alt="Chili Piper" align="center" width="300" />
</h1>

<h2 align="center">
<a alt="CypressDashboardGmailTest" href="https://dashboard.cypress.io/projects/crgssz/runs">
    <img src="https://img.shields.io/endpoint?url=https://dashboard.cypress.io/badge/simple/crgssz/main&style=flat&logo=cypress">
</a>
<a alt="GitHub Actions - Main" href="https://github.com/trongtuyen96/chilipiper-test/actions/workflows/main.yml">
    <img src="https://github.com/trongtuyen96/chilipiper-test/actions/workflows/main.yml/badge.svg">
</a>
</h2>

CHILI PIPER TEST

## Table of Contents

- [Introduction](#introduction)
- [Test Cases By Functions](#test-cases-by-functions)
- [Additional Features](#additional-features)
- [How to run](#how-to-run)
- [Author](#author)
- [License](#license)

## Introduction
Here is my source code for Chili Piper take-home test - which took me around ~7 hours to code, build, design, debug issue and write this readme 😆

This framework is about to serve the requirements from Chili Piper test (main functionality of Gmail) and was buill with Cypress and Typescript.

## Test Cases By Functions

### 1. Login by Google Account
To perform any actions with Gmail, we have to have ourself authorised and authenticated by Google. That's why this is one of the most important test cases need to be covered. Instead of logging via UI (which is bad practice following Cypress documentation), I used Google SSO-enabled app with Oauth Playground to obtain client id, client secret and refresh token, then successfully logged into Google.

Check its implementation at [support/commands.ts](https://github.com/trongtuyen96/chilipiper-test/blob/main/cypress/support/commands.ts)

And the test of login, where I validated the user account is in [integration/login-view.spec.ts](https://github.com/trongtuyen96/chilipiper-test/blob/main/cypress/integration/login-view.spec.ts)

### 2. View emails
To begin with, interacting with Gmail requires me to use Gmail APIs with appropriate scopes [Gmail API scopes](https://developers.google.com/gmail/api/auth/scopes). Don't forget to set it, if not, you will be not authorised to perform sepcial actions such as send, delete emails.

Gmail would not be a mailbox unless having a function to see emails. To check emails I made requests to /messages endpoint with access token that we got from the logged-in account. 

The test is at [integration/login-view.spec.ts](https://github.com/trongtuyen96/chilipiper-test/blob/main/cypress/integration/login-view.spec.ts)

Validation:
- Status code
- Number of emails
- Snippet of newest email
- Sender
- Receiver
- Subject

### 3. Send emails
Sending email is not only a must-have feature but also most common functionality of Gmail. To send emails, I made POST request to /messages/send with base64-encoded content of sender, receiver, subject and message. 

The test is at [integration/send-trash-delete.spec.ts](https://github.com/trongtuyen96/chilipiper-test/blob/main/cypress/integration/send-trash-delete.spec.ts)

### 4. Trash and Delete emails
Why is it important? [Save our planet by deleting emails](https://thegoodplanet.org/2020/06/02/how-you-can-save-our-planet-by-deleting-emails/) 🌏

And:
- To trash emails, I made POST request to /messages/trash
- To delete emails, I made DELETE request to messages/{id}

The test is at [integration/send-trash-delete.spec.ts](https://github.com/trongtuyen96/chilipiper-test/blob/main/cypress/integration/send-trash-delete.spec.ts)

## Additional Features
Those below are some few fun things I add to this project:

### 1. CI/CD set up with parrallel run on Github Actions and Cypress Dashboard
A custom workflow file [main.yml](https://github.com/trongtuyen96/chilipiper-test/blob/main/.github/workflows/main.yml) was made to run tests on Github Actions parallelly - where it pull the newest code, run parallel, upload artefacts and test reports into Githut bAction. 

Moreover, Cypress Dashboard was set up as well, you can check it here https://dashboard.cypress.io/projects/crgssz/runs

Both of them enable us to utilize the power of CI/CD and parallelization of running test. It also provide beautiful, informative dashboard to view our runs.

[dotenv](https://github.com/motdotla/dotenv) library was used to store our secret variables (Client Id, Client Secret and Refresh Token) separeately from code. So they are not exposed online. 

### 2. Multiple reporters
Implement [cypress-multi-reporters](https://www.npmjs.com/package/cypress-multi-reporters) to get awesome xml reports.

### 3. Custom commands to set and get variables anytime during your test spec
I built setVariable and getVariable commands in [support/commands.ts](https://github.com/trongtuyen96/chilipiper-test/blob/main/cypress/support/commands.ts) where it can help you - simple but powerful:
- Set a variable
- Get a variable during test spec
- Use stored variables in different spec file

## How To Run

### Run locally 
You need to add .env file to root folder, where I stored all my secret client id, client secret and refresh token as they are required to run those API tests.

Run with Cypress app
```
npx cypress open
```

Run by command line
```
npm run test-gmail
```

### Run CI/CD
Whenever there is a push event into repo, it will trigger test to run. And result can be visually observed here: https://dashboard.cypress.io/projects/crgssz/runs

All secret variables are set up inside GitHub Actions.

## Author

<h4 align="center">
	Tuyen Nguyen - Senior QA Automation Engineer
</h4>
    <h5 align="center">
	<a href="trongtuyen96@gmail.com">trongtuyen96@gmail.com</a>
    </h5>
<p align="center">
	 <a alt="Github" href="https://github.com/trongtuyen96">
    <img src="https://user-images.githubusercontent.com/25218255/47360756-794c1f00-d6fa-11e8-86fa-7b1c2e4dda92.png" width="50">
  </a>
		 <a alt="LinkedIn" href="https://www.linkedin.com/in/tuyennguyen96/">
    <img src="https://user-images.githubusercontent.com/25218255/47360366-8583ac80-d6f9-11e8-8871-219802a9a162.png" width="50">
  </a>
		 <a alt="Facebook" href="https://www.facebook.com/tuyen.trong.3">
    <img src="https://user-images.githubusercontent.com/25218255/47360363-84eb1600-d6f9-11e8-8029-818481536200.png" width="50">
  </a>
</p>

## License
	
~~~~
Copyright 2022 Tuyen Nguyen

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
~~~~
