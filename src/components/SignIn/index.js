import React, { Component, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { Container } from '@material-ui/core';

// import Link from '@material-ui/core/Link';
// import { makeStyles } from '@material-ui/core/styles';
// import Typography from '@material-ui/core/Typography';
// import CssBaseline from '@material-ui/core/CssBaseline';
// import Grid from '@material-ui/core/Grid';

// const useStyles = makeStyles(theme => ({
//   paper: {
//     marginTop: theme.spacing(8),
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//   },
//   avatar: {
//     margin: theme.spacing(1),
//     backgroundColor: theme.palette.secondary.main,
//   },
//   form: {
//     width: '100%', // Fix IE 11 issue.
//     marginTop: theme.spacing(1),
//   },
//   submit: {
//     margin: theme.spacing(3, 0, 2),
//   },
// }));

// function Copyright() {
//   return (
//     <Typography variant="body2" color="textSecondary" align="center">
//       {'Copyright © '}
//       <Link color="inherit" href="https://material-ui.com/">
//         Your Website
//       </Link>{' '}
//       {new Date().getFullYear()}
//       {'.'}
//     </Typography>
//   );
// }

const SignInPage = () => {
  return (
    <Container component="main" maxWidth="xs">
      <h1>Sign In</h1>
      <SignInForm />

      <PasswordForgetLink />
      <SignUpLink />
    </Container>
  );
};

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

// const ERROR_CODE_ACCOUNT_EXISTS =
//   'auth/account-exists-with-different-credential';

// const ERROR_MSG_ACCOUNT_EXISTS = `
//   An account with an E-Mail address to
//   this social account already exists. Try to login from
//   this account instead and associate your social accounts on
//   your personal account page.
// `;

const SignInFormBase = ({ firebase, history }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(undefined);

  const onSignIn = (event) => {

    firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        setEmail('')
        setPassword('')
        history.push(ROUTES.NEW_ACTIVITY);
      })
      .catch((error) => {
        setError(error)
      });

    event.preventDefault();
  };

  const onChangeEmail = event => {
    setEmail(event.target.value);
  };
  const onChangePassword = event => {
    setPassword(event.target.value);
  };
  const isInvalid = password === '' || email === '';
  return (
    <form onSubmit={onSignIn}>
      <input
        name="email"
        value={email}
        onChange={onChangeEmail}
        type="text"
        placeholder="Email Address"
      />
      <input
        name="password"
        value={password}
        onChange={onChangePassword}
        type="password"
        placeholder="Password"
      />
      <button disabled={isInvalid} type="submit">
        Sign In
      </button>

      {error && <p>{error.message}</p>}
    </form>
  )
};

const SignInForm = compose(withRouter, withFirebase)(SignInFormBase);

export default SignInPage;

export { SignInForm };
