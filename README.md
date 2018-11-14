# react-firebase-authentication

[![Build Status](https://travis-ci.org/taming-the-state-in-react/react-firebase-authentication.svg?branch=master)](https://travis-ci.org/taming-the-state-in-react/react-firebase-authentication) [![Slack](https://slack-the-road-to-learn-react.wieruch.com/badge.svg)](https://slack-the-road-to-learn-react.wieruch.com/) [![Greenkeeper badge](https://badges.greenkeeper.io/taming-the-state-in-react/react-firebase-authentication.svg)](https://greenkeeper.io/)

* Found in [Taming the State in React](https://roadtoreact.com/course-details?courseId=TAMING_THE_STATE)
* [Live](https://react-firebase-authentication.wieruch.com/)
* [Tutorial](https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial/)

## Features

* uses:
  * only React (create-react-app)
  * firebase 5
  * react-router 4
  * no Redux/MobX
    * [Redux Version](https://github.com/taming-the-state-in-react/react-redux-firebase-authentication)
    * [MobX Version](https://github.com/taming-the-state-in-react/react-mobx-firebase-authentication)
  * [React's 16.3 context API](https://reactjs.org/blog/2018/03/29/react-v-16-3.html)
* features:
  * Sign In
  * Sign Up
  * Sign Out
  * Password Forget
  * Password Change
  * Protected Routes with Authorization
  * Database: Users

## Installation

* `git clone git@github.com:taming-the-state-in-react/react-firebase-authentication.git`
* `cd react-firebase-authentication`
* `npm install`
* `npm start`
* visit http://localhost:3000/
* Use your own Firebase Credentials

### Use your own Firebase Credentials

* visit https://firebase.google.com/ and create a Firebase App
* copy and paste your Credentials from your Firebase App into src/firebase/firebase.js
* activate Email/Password Sign-In Method in your Firebase App
