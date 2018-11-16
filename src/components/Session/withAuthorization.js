import React from 'react';
import { withRouter } from 'react-router-dom';

import AuthUserContext from './AuthUserContext';
import { firebase, db } from '../../firebase';
import * as ROUTES from '../../constants/routes';

const withAuthorization = condition => Component => {
  class WithAuthorization extends React.Component {
    componentDidMount() {
      this.listener = firebase.auth.onAuthStateChanged(authUser => {
        if (authUser) {
          db.onceGetUser(authUser.uid).then(snapshot => {
            let dbUser = snapshot.val();

            if (!dbUser.roles) {
              dbUser.roles = [];
            }

            authUser = { ...authUser, ...dbUser };

            if (!condition(authUser)) {
              this.props.history.push(ROUTES.SIGN_IN);
            }
          });
        }
      });
    }

    componentWillUnmount() {
      this.listener();
    }

    render() {
      return (
        <AuthUserContext.Consumer>
          {authUser =>
            condition(authUser) ? <Component {...this.props} /> : null
          }
        </AuthUserContext.Consumer>
      );
    }
  }

  return withRouter(WithAuthorization);
};

export default withAuthorization;
