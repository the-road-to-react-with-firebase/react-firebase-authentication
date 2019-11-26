import React from 'react';

import { withFirebase } from '../Firebase';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const INITIAL_STATE = {
  password: '',
  confirmPassword: '',
};

const PasswordChangeForm = (props) => {
  const onSubmit = (values, { setFieldError, setSubmitting }) => {
    const { password} = values;

    props.firebase
      .doPasswordUpdate(password)
      .then(() => {
      })
      .catch(error => {
        setFieldError('general', error.message);
      });
  };

  const validate = (values) => {
    const errors = {};
    if(values.password !== values.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
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
        <Field type="password" name="password" placeholder="New Password" />
        <ErrorMessage name="password" component="div" />
        <Field type="password" name="confirmPassword" placeholder="Confirm New Password"/>
        <ErrorMessage name="confirmPassword" component="div" />
        <button disabled={isSubmitting} type="submit">
          Reset My Password
        </button>
          <span style={{ color: 'red' }}>{errors.general}</span>
        </Form>
      )}
    </Formik>
  );
}
export default withFirebase(PasswordChangeForm);
