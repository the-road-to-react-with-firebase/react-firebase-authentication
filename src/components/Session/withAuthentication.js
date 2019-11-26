import React, {useState, useEffect} from 'react';

import AuthUserContext from './context';
import { withFirebase } from '../Firebase';

const withAuthentication = Component => {
  const WithAuthentication = (props) => {
    const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem('authUser')));

    useEffect(() => {
      const unsubscribe = props.firebase.onAuthUserListener(
        authUser => {
          localStorage.setItem('authUser', JSON.stringify(authUser));
          setAuthUser(authUser);
        },
        () => {
          localStorage.removeItem('authUser');
          setAuthUser(null);
        },
      );
      return () => unsubscribe();
    })

    return (
      <AuthUserContext.Provider value={authUser}>
        <Component {...props} />
      </AuthUserContext.Provider>
    );
  }

  return withFirebase(WithAuthentication);
};

export default withAuthentication;
