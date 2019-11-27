import React, { useState } from 'react';

import { withFirebase } from '../Firebase';

const INITIAL_STATE = {
  passwordOne: '',
  passwordTwo: '',
};

const PasswordChangeForm = (props) => {
  const [passwords, setPasswords] = useState(INITIAL_STATE);
  const [error, setError] = useState(null);

  const onSubmit = (event) => {
    const { passwordOne } = passwords;

    props.firebase
      .doPasswordUpdate(passwordOne)
      .then(() => {
        setPasswords(INITIAL_STATE);
        setError(null);
      })
      .catch(error => {
        setError(error)
      });

    event.preventDefault();
  };

  const onChange = (event) => {
    const { name, value } = event.target;
    setPasswords({...passwords, [name]: value });
  };

  const { passwordOne, passwordTwo } = passwords;

  const isInvalid =
    passwordOne !== passwordTwo || passwordOne === '';

  return (
    <form onSubmit={onSubmit}>
      <input
        name="passwordOne"
        value={passwordOne}
        onChange={onChange}
        type="password"
        placeholder="New Password"
      />
      <input
        name="passwordTwo"
        value={passwordTwo}
        onChange={onChange}
        type="password"
        placeholder="Confirm New Password"
      />
      <button disabled={isInvalid} type="submit">
        Reset My Password
      </button>

      {error && <p>{error.message}</p>}
    </form>
  );
}

export default withFirebase(PasswordChangeForm);
