import { auth } from './firebase';

export const doPasswordReset = (email) =>
  auth.sendPasswordResetEmail(email);

export const doPasswordUpdate = (password) =>
  auth.currentUser.updatePassword(password);
