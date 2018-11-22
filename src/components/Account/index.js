import React, { Component } from 'react';

import { AuthUserContext, withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';

const AccountPage = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <div>
        <h1>Account: {authUser.email}</h1>
        <PasswordForgetForm />
        <PasswordChangeForm />
        <LoginManagement authUser={authUser} />
      </div>
    )}
  </AuthUserContext.Consumer>
);

class LoginManagementBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeSignInMethods: [],
      error: null,
    };
  }

  componentDidMount() {
    this.fetchSignInMethods();
  }

  fetchSignInMethods = () => {
    this.props.firebase.auth
      .fetchSignInMethodsForEmail(this.props.authUser.email)
      .then(activeSignInMethods =>
        this.setState({ activeSignInMethods }),
      );
  };

  onLinkWithGoogle = () => {
    this.props.firebase
      .doLinkWithGoogle()
      .then(this.fetchSignInMethods)
      .catch(error => this.setState({ error }));
  };

  onLinkWithFacebook = () => {
    this.props.firebase
      .doLinkWithFacebook()
      .then(this.fetchSignInMethods)
      .catch(error => this.setState({ error }));
  };

  onLinkWithTwitter = () => {
    this.props.firebase
      .doLinkWithTwitter()
      .then(this.fetchSignInMethods)
      .catch(error => this.setState({ error }));
  };

  render() {
    const { activeSignInMethods, error } = this.state;

    return (
      <div>
        <div>
          Active Sign In Methods:
          <ul>
            {activeSignInMethods.map(login => (
              <li key={login}>{login}</li>
            ))}
          </ul>
          <button type="button" onClick={this.onLinkWithGoogle}>
            Link Google
          </button>
          <button type="button" onClick={this.onLinkWithFacebook}>
            Link Facebook
          </button>
          <button type="button" onClick={this.onLinkWithTwitter}>
            Link Twitter
          </button>
          {error && error.message}
        </div>
      </div>
    );
  }
}

const LoginManagement = withFirebase(LoginManagementBase);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(AccountPage);
