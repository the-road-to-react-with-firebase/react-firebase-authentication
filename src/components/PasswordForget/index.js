import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const PasswordForgetPage = () => (
  <div>
    <h1>PasswordForget</h1>
    <PasswordForgetForm />
  </div>
);

const PasswordForgetFormBase = (props) => {

  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);

  const onSubmit = (event) => {

    props.firebase
      .doPasswordReset(email)
      .then(() => {
        setEmail(email);
        setError(null)
      })
      .catch(error => {
        setError(error)
      });

    event.preventDefault();
  };

  const onChange = (event) => {
    const { value } = event;
    setEmail(value);
  };


  const isInvalid = email === '';

  return (
    <form onSubmit={onSubmit}>
      <input
        name="email"
        value={email}
        onChange={onChange}
        type="text"
        placeholder="Email Address"
      />
      <button disabled={isInvalid} type="submit">
        Reset My Password
      </button>

      {error && <p>{error.message}</p>}
    </form>
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
