import * as firebase from 'firebase';

const prodConfig = {
  apiKey: process.env.FIREBASE_API_LIVE,
  authDomain: process.env.FIREBASE_AUTH_LIVE,
  databaseURL: process.env.FIREBASE_DB_LIVE,
  projectId: process.env.FIREBASE_PID_LIVE,
  storageBucket: '',
  messagingSenderId: process.env.FIREBASE_MSID_LIVE
};

const devConfig = {
  apiKey: process.env.FIREBASE_API_TEST,
  authDomain: process.env.FIREBASE_AUTH_TEST,
  databaseURL: process.env.FIREBASE_DB_TEST,
  projectId: process.env.FIREBASE_PID_TEST,
  storageBucket: '',
  messagingSenderId: process.env.FIREBASE_MSID_TEST
};

const config = process.env.NODE_ENV === 'production'
  ? prodConfig
  : devConfig;

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const db = firebase.database();
const auth = firebase.auth();

export default firebase;

export {
  db,
  auth,
};
