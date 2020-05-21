# react-firebase-authentication

[![Build Status](https://travis-ci.org/the-road-to-react-with-firebase/react-firebase-authentication.svg?branch=master)](https://travis-ci.org/the-road-to-react-with-firebase/react-firebase-authentication) [![Slack](https://slack-the-road-to-learn-react.wieruch.com/badge.svg)](https://slack-the-road-to-learn-react.wieruch.com/) [![Greenkeeper badge](https://badges.greenkeeper.io/the-road-to-react-with-firebase/react-firebase-authentication.svg)](https://greenkeeper.io/)

* [Tutorial](https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial/)

## Variations

* [Redux Version](https://github.com/the-road-to-react-with-firebase/react-redux-firebase-authentication)
* [MobX Version](https://github.com/the-road-to-react-with-firebase/react-mobx-firebase-authentication)
* [Gatsby Version](https://github.com/the-road-to-react-with-firebase/react-gatsby-firebase-authentication)
* [Firestore Version](https://github.com/the-road-to-react-with-firebase/react-firestore-authentication)
* [Semantic UI Version](https://github.com/the-road-to-react-with-firebase/react-semantic-ui-firebase-authentication)

## Features

* uses:
  * only React (create-react-app)
  * firebase
  * react-router
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
* visit http://localhost:3000

Get an overview of Firebase, how to create a project, what kind of features Firebase offers, and how to navigate through the Firebase project dashboard in this [visual tutorial for Firebase](https://www.robinwieruch.de/firebase-tutorial/).

### Firebase Configuration

* copy/paste your configuration from your Firebase project's dashboard into one of these files
  * *src/components/Firebase/firebase.js* file
  * *.env* file
  * *.env.development* and *.env.production* files

The *.env* or *.env.development* and *.env.production* files could look like the following then:

```
REACT_APP_API_KEY=AIzaSyBtxZ3phPeXcsZsRTySIXa7n33NtQ
REACT_APP_AUTH_DOMAIN=react-firebase-s2233d64f8.firebaseapp.com
REACT_APP_DATABASE_URL=https://react-firebase-s2233d64f8.firebaseio.com
REACT_APP_PROJECT_ID=react-firebase-s2233d64f8
REACT_APP_STORAGE_BUCKET=react-firebase-s2233d64f8.appspot.com
REACT_APP_MESSAGING_SENDER_ID=701928454501
```

### Activate Sign-In Methods

![firebase-enable-google-social-login_640](https://user-images.githubusercontent.com/2479967/49687774-e0a31e80-fb42-11e8-9d8a-4b4c794134e6.jpg)

* Email/Password
* [Google](https://www.robinwieruch.de/react-firebase-social-login/)
* [Facebook](https://www.robinwieruch.de/firebase-facebook-login/)
* [Twitter](https://www.robinwieruch.de/firebase-twitter-login/)
* [Troubleshoot](https://www.robinwieruch.de/react-firebase-social-login/)

### Activate Verification E-Mail

* add a redirect URL for redirecting a user after an email verification into one of these files
  * *src/components/Firebase/firebase.js* file
  * *.env* file
  * *.env.development* and *.env.production* files

The *.env* or *.env.development* and *.env.production* files could look like the following then (excl. the Firebase configuration).

**Development:**

```
REACT_APP_CONFIRMATION_EMAIL_REDIRECT=http://localhost:3000
```

**Production:**

```
REACT_APP_CONFIRMATION_EMAIL_REDIRECT=https://mydomain.com
```

### Security Rules

```
{
  "rules": {
    ".read": false,
    ".write": false,
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid || root.child('users/'+auth.uid).child('roles').hasChildren(['ADMIN'])",
        ".write": "$uid === auth.uid || root.child('users/'+auth.uid).child('roles').hasChildren(['ADMIN'])"
      },
      ".read": "root.child('users/'+auth.uid).child('roles').hasChildren(['ADMIN'])",
      ".write": "root.child('users/'+auth.uid).child('roles').hasChildren(['ADMIN'])"
    },
    "messages": {
      ".indexOn": ["createdAt"],
      "$uid": {
        ".write": "data.exists() ? data.child('userId').val() === auth.uid : newData.child('userId').val() === auth.uid"
      },
      ".read": "auth != null",
      ".write": "auth != null",
    },
  }
}
```
