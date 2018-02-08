import * as firebase from 'firebase';

const prodConfig = {
  apiKey: "AIzaSyD-ZVQwhXGsrl1SL_xuESUz50jhcG03OCA",
  authDomain: "gatsbyjs-2c8c4.firebaseapp.com",
  databaseURL: "https://gatsbyjs-2c8c4.firebaseio.com",
  projectId: "gatsbyjs-2c8c4",
  storageBucket: "gatsbyjs-2c8c4.appspot.com",
  messagingSenderId: "591839666224"
};

const devConfig = {
  apiKey: "AIzaSyD-ZVQwhXGsrl1SL_xuESUz50jhcG03OCA",
  authDomain: "gatsbyjs-2c8c4.firebaseapp.com",
  databaseURL: "https://gatsbyjs-2c8c4.firebaseio.com",
  projectId: "gatsbyjs-2c8c4",
  storageBucket: "gatsbyjs-2c8c4.appspot.com",
  messagingSenderId: "591839666224"
};

const config = process.env.NODE_ENV === 'production'
  ? prodConfig
  : devConfig;

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const db = firebase.database();
const auth = firebase.auth();

export {
  db,
  auth,
};
