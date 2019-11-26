import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const SignInPage = () => (
  <div>
    <h1>SignIn</h1>
    <SignInForm />
    <SignInGoogle />
    <SignInFacebook />
    <SignInTwitter />
    <PasswordForgetLink />
    <SignUpLink />
  </div>
);

const INITIAL_STATE = {
  email: '',
  password: '',
};

const ERROR_CODE_ACCOUNT_EXISTS =
  'auth/account-exists-with-different-credential';

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with an E-Mail address to
  this social account already exists. Try to login from
  this account instead and associate your social accounts on
  your personal account page.
`;

const SignInFormBase = (props) => {

  const validate = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = 'Required';
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
    ) {
      errors.email = 'Invalid email address';
    }
    return errors;
  }

  const onSubmit = (values, { setFieldError, setSubmitting }) => {
    const {email, password} = values;
    props.firebase.auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          setFieldError('general', ERROR_MSG_ACCOUNT_EXISTS);
        } else {
          setFieldError('general', error.message);
        }
      });
  }

  return (
    <Formik
      initialValues={INITIAL_STATE}
      validate={validate}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, errors }) => (
        <Form>
          <Field type="email" name="email" />
          <ErrorMessage name="email" component="div" />
          <Field type="password" name="password" />
          <ErrorMessage name="password" component="div" />
          <button type="submit" disabled={isSubmitting}>
            Sign In
          </button>
          <br />
          <span style={{ color: 'red' }}>{errors.general}</span>
        </Form>
      )}
    </Formik>
  );
}

const SignInGoogleBase = (props) => {
  const [error, setError] = useState(null);

  const onSubmit = (event) => {
    props.firebase
      .doSignInWithGoogle()
      .then(socialAuthUser => {
        // Create a user in your Firebase Realtime Database too
        return props.firebase.user(socialAuthUser.user.uid).set({
          username: socialAuthUser.user.displayName,
          email: socialAuthUser.user.email,
          roles: {},
        });
      })
      .then(() => {
        setError(null);
        props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }
        setError(error);
      });

    event.preventDefault();
  };

  return (
    <form onSubmit={onSubmit}>
      <button type="submit">Sign In with Google</button>

      {error && <p>{error.message}</p>}
    </form>
  );
}

const SignInFacebookBase = (props) => {
  const [error, setError] = useState(null);

  const onSubmit = (event) => {
    props.firebase
      .doSignInWithFacebook()
      .then(socialAuthUser => {
        // Create a user in your Firebase Realtime Database too
        return props.firebase.user(socialAuthUser.user.uid).set({
          username: socialAuthUser.user.displayName,
          email: socialAuthUser.user.email,
          roles: {},
        });
      })
      .then(() => {
        setError(null);
        props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }
        setError(error);
      });

    event.preventDefault();
  };

  return (
    <form onSubmit={onSubmit}>
      <button type="submit">Sign In with Facebook</button>

      {error && <p>{error.message}</p>}
    </form>
  );
}


const SignInTwitterBase = (props) => {
  const [error, setError] = useState(null);

  const onSubmit = (event) => {
    props.firebase
      .doSignInWithTwitter()
      .then(socialAuthUser => {
        // Create a user in your Firebase Realtime Database too
        return props.firebase.user(socialAuthUser.user.uid).set({
          username: socialAuthUser.user.displayName,
          email: socialAuthUser.user.email,
          roles: {},
        });
      })
      .then(() => {
        setError(null);
        props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }
        setError(error);
      });

    event.preventDefault();
  };

  return (
    <form onSubmit={onSubmit}>
      <button type="submit">Sign In with Twitter</button>

      {error && <p>{error.message}</p>}
    </form>
  );
}


const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase);

const SignInGoogle = compose(
  withRouter,
  withFirebase,
)(SignInGoogleBase);

const SignInFacebook = compose(
  withRouter,
  withFirebase,
)(SignInFacebookBase);

const SignInTwitter = compose(
  withRouter,
  withFirebase,
)(SignInTwitterBase);

export default SignInPage;

export { SignInForm, SignInGoogle, SignInFacebook, SignInTwitter };
