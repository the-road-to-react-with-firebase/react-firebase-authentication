import * as firebase from 'firebase';

const prodConfig = {
  apiKey: 'AIzaSyBtxDyenAXZ3phPeXcsZs6hoIXa7n33NtQ',
  authDomain: 'react-firebase-authentic-d64f8.firebaseapp.com',
  databaseURL: 'https://react-firebase-authentic-d64f8.firebaseio.com',
  projectId: 'react-firebase-authentic-d64f8',
  storageBucket: '',
  messagingSenderId: '705898054501'
};

const devConfig = {
  apiKey: 'AIzaSyBtxDyenAXZ3phPeXcsZs6hoIXa7n33NtQ',
  authDomain: 'react-firebase-authentic-d64f8.firebaseapp.com',
  databaseURL: 'https://react-firebase-authentic-d64f8.firebaseio.com',
  projectId: 'react-firebase-authentic-d64f8',
  storageBucket: '',
  messagingSenderId: '705898054501'
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
