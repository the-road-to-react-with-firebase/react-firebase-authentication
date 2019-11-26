import React from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const PasswordForgetPage = () => (
  <div>
    <h1>PasswordForget</h1>
    <PasswordForgetForm />
  </div>
);

const INITIAL_STATE = {
  email: '',
};

const PasswordForgetFormBase = (props) => {
  const onSubmit = (values, { setFieldError, setSubmitting }) => {
    const {email} = values;

    props.firebase
      .doPasswordReset(email)
      .then(() => {
      })
      .catch(error => {
        setFieldError('general', error.message);
      });
  }

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

  return (
    <Formik
      initialValues={INITIAL_STATE}
      validate={validate}
      onSubmit={onSubmit}
    >
    {({ isSubmitting, errors }) => (
      <Form>
        <Field type="email" name="email" placeholder="Email Address"/>
        <ErrorMessage name="email" component="div" />
        <button disabled={isSubmitting} type="submit">
          Reset My Password
        </button>
          <span style={{ color: 'red' }}>{errors.general}</span>
        </Form>
      )}
    </Formik>
  );
}

const PasswordForgetLink = () => (
  <p>
    <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
  </p>
);

export default PasswordForgetPage;

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);

export { PasswordForgetForm, PasswordForgetLink };
