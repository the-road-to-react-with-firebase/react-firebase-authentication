import { firebase, db } from '../../firebase';

export default (next, fallback = () => {}) =>
  firebase.auth.onAuthStateChanged(authUser => {
    if (authUser) {
      db.onceGetUser(authUser.uid).then(snapshot => {
        let dbUser = snapshot.val();

        if (!dbUser.roles) {
          dbUser.roles = [];
        }

        authUser = {
          id: authUser.uid,
          email: authUser.email,
          ...dbUser,
        };

        next(authUser);
      });
    } else {
      fallback();
    }
  });
