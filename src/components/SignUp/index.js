import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const SignUpPage = () => (
  <div>
    <h1>SignUp</h1>
    <SignUpForm />
  </div>
);

const INITIAL_STATE = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  isAdmin: false,
};

const ERROR_CODE_ACCOUNT_EXISTS = 'auth/email-already-in-use';

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with this E-Mail address already exists.
  Try to login with this account instead. If you think the
  account is already used from one of the social logins, try
  to sign in with one of them. Afterward, associate your accounts
  on your personal account page.
`;

const SignUpFormBase = (props) => {

  const onSubmit = (values, { setFieldError, setSubmitting }) => {
    const { username, email, password, admin } = values;
    const roles = {};

    if (admin) {
      roles[ROLES.ADMIN] = ROLES.ADMIN;
    }
    debugger
    props.firebase
      .doCreateUserWithEmailAndPassword(email, password)
      .then(authUser => {
        // Create a user in your Firebase realtime database
        return props.firebase.user(authUser.user.uid).set({
          username,
          email,
          roles,
        });
      })
      .then(() => {
        return props.firebase.doSendEmailVerification();
      })
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
  };

  const validate = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = 'Required';
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
    ) {
      errors.email = 'Invalid email address';
    }
    if(values.password !== values.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    if (!values.password) {
      errors.password = 'Required';
    }
    if (!values.username) {
      errors.username = 'Required';
    }
    return errors;
  }

  return (
    <Formik
      initialValues={INITIAL_STATE}
      validate={validate}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, errors }) => (
        <Form>
          <Field type="username" name="username" placeholder="Full Name"/>
          <ErrorMessage name="username" component="div"/>
          <Field type="email" name="email" placeholder="Email Address"/>
          <ErrorMessage name="email" component="div" />
          <Field type="password" name="password" placeholder="Password" />
          <ErrorMessage name="password" component="div" />
          <Field type="password" name="confirmPassword" placeholder="Confirm Password"/>
          <ErrorMessage name="confirmPassword" component="div" />
          <Field type="checkbox" name="admin" />
          <ErrorMessage name="admin" component="div" />
          <button type="submit" disabled={isSubmitting}>
            Sign Up
          </button>
          <br />
          <span style={{ color: 'red' }}>{errors.general}</span>
        </Form>
      )}
    </Formik>
  );
}

const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);

const SignUpForm = compose(
  withRouter,
  withFirebase,
)(SignUpFormBase);

export default SignUpPage;

export { SignUpForm, SignUpLink };
