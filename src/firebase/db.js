import { db } from './firebase';

// User API

export const doCreateUser = (id, username, email, roles) =>
  db.ref(`users/${id}`).set({
    username,
    email,
    roles,
  });

export const onceGetUser = id => db.ref(`users/${id}`).once('value');

export const onceGetUsers = () => db.ref('users').once('value');

// Other db APIs ...
