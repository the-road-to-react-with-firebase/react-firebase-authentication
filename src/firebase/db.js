import { db } from './firebase';

// User API

export const user = id => db.ref(`users/${id}`);

export const users = () => db.ref('users');

// Other db APIs ...
