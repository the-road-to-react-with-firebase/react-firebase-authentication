# react-firebase-authentication

[![Build Status](https://travis-ci.org/the-road-to-react-with-firebase/react-firebase-authentication.svg?branch=master)](https://travis-ci.org/the-road-to-react-with-firebase/react-firebase-authentication) [![Slack](https://slack-the-road-to-learn-react.wieruch.com/badge.svg)](https://slack-the-road-to-learn-react.wieruch.com/) [![Greenkeeper badge](https://badges.greenkeeper.io/the-road-to-react-with-firebase/react-firebase-authentication.svg)](https://greenkeeper.io/)

* [Tutorial](https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial/)
* [Live Version of half of the Tutorial](https://react-firebase-authentication.wieruch.com/)

## Features

* uses:
  * only React (create-react-app)
  * firebase 5
  * react-router 4
  * no Redux/MobX
    * [Redux Version](https://github.com/taming-the-state-in-react/react-redux-firebase-authentication)
    * [MobX Version](https://github.com/taming-the-state-in-react/react-mobx-firebase-authentication)
* features:
  * Sign In
  * Sign Up
  * Sign Out
  * Password Forget
  * Password Change
  * Verification Email
  * Protected Routes with Authorization
  * Roles-based Authorization
  * Social Logins with Google, Facebook and Twitter
  * Linking of Social Logins on Account dashboard
  * Auth Persistence with Local Storage
  * Database with Users and Messages

## License

### Commercial license

If you want to use this starter project to develop commercial sites, themes, projects, and applications, the Commercial license is the appropriate license. With this option, your source code is kept proprietary. Purchase an commercial license for different team sizes:

* [1 Developer](https://gum.co/react-with-firebase-starter-pack-developer)
* [Team of up to 8 Developers](https://gum.co/react-with-firebase-starter-pack-team)
* [Unlimited Developers of an Organization](https://gum.co/react-with-firebase-starter-pack-organization)

It grants you also access to the other starter projects in this GitHub organization.

### Open source license

If you are creating an open source application under a license compatible with the [GNU GPL license v3](https://www.gnu.org/licenses/gpl-3.0.html), you may use this starter project under the terms of the GPLv3.

## Installation

* `git clone git@github.com:the-road-to-react-with-firebase/react-firebase-authentication.git`
* `cd react-firebase-authentication`
* `npm install`
* `npm start`
* visit http://localhost:3000/
* Use your own Firebase Credentials

### Use your own Firebase Credentials

* visit https://firebase.google.com and create a Firebase App
* copy and paste your Credentials from your Firebase App into *src/components/Firebase/firebase.js* file or in .env file
* [activate Sign-In Methods in your Firebase App](https://www.robinwieruch.de/react-firebase-social-login/)
  * Email/Password
  * Google
  * Facebook
  * Twitter
