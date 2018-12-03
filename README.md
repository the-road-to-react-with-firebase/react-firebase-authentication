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

## Installation

* `git clone git@github.com:the-road-to-react-with-firebase/react-firebase-authentication.git`
* `cd react-firebase-authentication`
* `npm install`
* `npm start`
* visit http://localhost:3000/
* Use your own Firebase Credentials

### Use your own Firebase Credentials

* visit https://firebase.google.com/ and create a Firebase App
* copy and paste your Credentials from your Firebase App into src/firebase/firebase.js
* activate Email/Password Sign-In Method in your Firebase App
