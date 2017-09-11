import React from 'react';
import { withRouter } from 'react-router-dom';

import { firebase } from '../../firebase';
import * as routes from '../../constants/routes';

const withAuthorization = (needsAuthorization) => (Component) => {
  class WithAuthorization extends React.Component {
    componentDidMount() {
      firebase.auth.onAuthStateChanged(authUser => {
        if (!authUser && needsAuthorization) {
          this.props.history.push(routes.SIGN_IN)
        }
      });
    }

    render() {
      return (
        <Component />
      );
    }
  }

  return withRouter(WithAuthorization);
}

export default withAuthorization;