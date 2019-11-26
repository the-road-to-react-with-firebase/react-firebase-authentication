import React, { useState, useEffect } from 'react';
import { compose } from 'recompose';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import {
  AuthUserContext,
  withAuthorization,
  withEmailVerification,
} from '../Session';
import { withFirebase } from '../Firebase';
import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';
import {SIGN_IN_METHODS} from '../../constants/signInMethods';

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

const LoginManagementBase = (props) => {
  const [error, setError] = useState(null);
  const [activeSignInMethods, setActiveSignInMethods] = useState([]);

  useEffect(() => fetchSignInMethods(), [])

  const fetchSignInMethods = () => {
    props.firebase.auth
      .fetchSignInMethodsForEmail(props.authUser.email)
      .then(activeSignInMethods => {
        setError(null);
        setActiveSignInMethods(activeSignInMethods)
      })
      .catch(error => setError(error));
  };

  const onSocialLoginLink = provider => {
    props.firebase.auth.currentUser
      .linkWithPopup(props.firebase[provider])
      .then(fetchSignInMethods)
      .catch(error => setError(error));
  };

  const onDefaultLoginLink = password => {
    const credential = props.firebase.emailAuthProvider.credential(
      props.authUser.email,
      password,
    );

    props.firebase.auth.currentUser
      .linkAndRetrieveDataWithCredential(credential)
      .then(fetchSignInMethods)
      .catch(error => setError(error));
  };

  const onUnlink = providerId => {
    props.firebase.auth.currentUser
      .unlink(providerId)
      .then(fetchSignInMethods)
      .catch(error => setError(error));
  };

  return (
    <div>
      Sign In Methods:
      <ul>
        {SIGN_IN_METHODS.map(signInMethod => {
          const onlyOneLeft = activeSignInMethods.length === 1;
          const isEnabled = activeSignInMethods.includes(
            signInMethod.id,
          );

          return (
            <li key={signInMethod.id}>
              {signInMethod.id === 'password' ? (
                <DefaultLoginToggle
                  onlyOneLeft={onlyOneLeft}
                  isEnabled={isEnabled}
                  signInMethod={signInMethod}
                  onLink={onDefaultLoginLink}
                  onUnlink={onUnlink}
                />
              ) : (
                <SocialLoginToggle
                  onlyOneLeft={onlyOneLeft}
                  isEnabled={isEnabled}
                  signInMethod={signInMethod}
                  onLink={onSocialLoginLink}
                  onUnlink={onUnlink}
                />
              )}
            </li>
          );
        })}
      </ul>
      {error && error.message}
    </div>
  );
}

const SocialLoginToggle = ({
  onlyOneLeft,
  isEnabled,
  signInMethod,
  onLink,
  onUnlink,
}) =>
  isEnabled ? (
    <button
      type="button"
      onClick={() => onUnlink(signInMethod.id)}
      disabled={onlyOneLeft}
    >
      Deactivate {signInMethod.id}
    </button>
  ) : (
    <button
      type="button"
      onClick={() => onLink(signInMethod.provider)}
    >
      Link {signInMethod.id}
    </button>
  );

const INITIAL_STATE = {
  password: '',
  confirmPassword: '',
};

const DefaultLoginToggle = (props) => {
  const onSubmit = (values, { setFieldError, setSubmitting }) => {
    const {passwordOne} = values;
    props.onLink(passwordOne);
  };

  const validate = (values) => {
    const errors = {};
    if(values.password !== values.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    return errors;
  }

  const {
    onlyOneLeft,
    isEnabled,
    signInMethod,
    onUnlink,
  } = props;

  return isEnabled ? (
    <button
      type="button"
      onClick={() => onUnlink(signInMethod.id)}
      disabled={onlyOneLeft}
    >
      Deactivate {signInMethod.id}
    </button>
  ) : (
    <Formik
      initialValues={INITIAL_STATE}
      validate={validate}
      onSubmit={onSubmit}
    >
    {({ isSubmitting, errors }) => (
      <Form>
        <Field type="password" name="password" placeholder="New Password" />
        <ErrorMessage name="password" component="div" />
        <Field type="password" name="confirmPassword" placeholder="Confirm New Password"/>
        <ErrorMessage name="confirmPassword" component="div" />
        <button disabled={isSubmitting} type="submit">
          Link {signInMethod.id}
        </button>
          <span style={{ color: 'red' }}>{errors.general}</span>
        </Form>
      )}
    </Formik>
  );
}

const LoginManagement = withFirebase(LoginManagementBase);

const condition = authUser => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(AccountPage);
