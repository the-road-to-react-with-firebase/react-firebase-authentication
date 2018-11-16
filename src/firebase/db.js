import { db } from './firebase';

// User API

export const user = id => db.ref(`users/${id}`);

export const users = () => db.ref('users');

// Message API

export const messages = () => db.ref('messages');

// Other APIs ...
