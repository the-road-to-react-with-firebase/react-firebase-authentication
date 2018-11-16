import React from 'react';

import AuthUserContext from './AuthUserContext';
import { firebase, db } from '../../firebase';

const withAuthentication = Component =>
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        authUser: null,
      };
    }

    componentDidMount() {
      this.listener = firebase.auth.onAuthStateChanged(authUser => {
        if (authUser) {
          db.onceGetUser(authUser.uid).then(snapshot => {
            let dbUser = snapshot.val();

            if (!dbUser.roles) {
              dbUser.roles = [];
            }

            authUser = { ...authUser, ...dbUser };

            this.setState({ authUser });
          });
        } else {
          this.setState({ authUser: null });
        }
      });
    }

    componentWillUnmount() {
      this.listener();
    }

    render() {
      const { authUser } = this.state;

      return (
        <AuthUserContext.Provider value={authUser}>
          <Component {...this.props} />
        </AuthUserContext.Provider>
      );
    }
  };

export default withAuthentication;
