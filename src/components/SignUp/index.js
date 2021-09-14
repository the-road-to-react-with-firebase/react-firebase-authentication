import React, { Component, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import Alert from '@material-ui/lab/Alert';
import { SignUpLink } from '../SignUp';
import InputAdornment from '@material-ui/core/InputAdornment';
import { PasswordForgetLink } from '../PasswordForget';
import { withFirebase } from '../Firebase';
import { Container } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import IconButton from '@material-ui/core/IconButton';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
const config = {
  adminPasscode: process.env.REACT_APP_ADMIN_PASSCODE,
  standardPasscode: process.env.REACT_APP_STANDARD_PASSCODE,
};
function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://netwrk.biz">
        netwrk.biz
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const SignUpPage = () => {
  return (
    <Container component="main" maxWidth="xs">
      <SignUpForm />

      {/* <SignUpLink /> */}
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
};

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const ERROR_CODE_ACCOUNT_EXISTS = 'auth/email-already-in-use';

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with this E-Mail address already exists.
  Try to login with this account instead. If you think the
  account is already used from one of the social logins, try
  to sign in with one of them. Afterward, associate your accounts
  on your personal account page.
`;

const SignUpFormBase = ({ firebase, history }) => {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [passwordOne, setPasswordOne] = useState('');
  const [passwordTwo, setPasswordTwo] = useState('');
  const [username, setUsername] = useState('');
  const [isAdmin, setIsAdmin] = useState('');
  const [error, setError] = useState(undefined);
  const [showPasswordOne, setShowPasswordOne] = useState(false);
  const [showPasswordTwo, setShowPasswordTwo] = useState(false);
  const [accessCode, setAccessCode] = useState('');

  const onSubmit = (event) => {
    event.preventDefault();
    const roles = {};
    if (
      accessCode !== config.standardPasscode ||
      accessCode !== config.adminPasscode
    ) {
      setError({
        message:
          'invalid access code, access denied... nice try hackers!',
      });
      return;
    }
    if (isAdmin) {
      roles[ROLES.ADMIN] = ROLES.ADMIN;
    } else {
      roles[ROLES.STANDARD] = ROLES.STANDARD;
    }

    firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then((authUser) => {
        // Create a user in your Firebase realtime database
        return firebase.user(authUser.user.uid).set({
          username,
          email,
          roles,
        });
      })
      .then(() => {
        return firebase.doSendEmailVerification();
      })
      .then(() => {
        setEmail('');
        setPasswordOne('');
        setPasswordTwo('');
        setShowPasswordOne(false);
        setShowPasswordTwo(false);
        setAccessCode('');
        setUsername('');
        setIsAdmin('');
        history.push(ROUTES.HOME);
      })
      .catch((error) => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }

        setError({ error });
      });

    event.preventDefault();
  };

  const handleClickShowPasswordOne = () => {
    setShowPasswordOne(!showPasswordOne);
  };

  const handleMouseDownPasswordOne = (event) => {
    event.preventDefault();
  };

  const handleClickShowPasswordTwo = () => {
    setShowPasswordTwo(!showPasswordTwo);
  };

  const handleMouseDownPasswordTwo = (event) => {
    event.preventDefault();
  };
  const onChange = (event) => {
    if (event.target.name === 'username') {
      setUsername(event.target.value);
    }
    if (event.target.name === 'email') {
      setEmail(event.target.value);
    }
    if (event.target.name === 'passwordOne') {
      setPasswordOne(event.target.value);
    }
    if (event.target.name === 'passwordTwo') {
      setPasswordTwo(event.target.value);
    }
    if (event.target.name === 'accessCode') {
      setAccessCode(event.target.value);
    }
  };

  const onChangeCheckbox = (event) => {
    setIsAdmin(event.target.checked);
  };
  const isInvalid =
    passwordOne.match(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
    ) === null ||
    passwordOne !== passwordTwo ||
    passwordOne === '' ||
    email === '' ||
    username === '' ||
    (accessCode !== standardPasscode &&
      accessCode !== adminPasscode);

  const isMatch = passwordOne === passwordTwo;

  return (
    <>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          <form
            onSubmit={onSubmit}
            className={classes.form}
            noValidate
          >
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Full Name"
              name="username"
              helperText="This will be used as your display name on activities"
              // autoFocus
              value={username}
              onChange={onChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              helperText="Must be a valid email address"
              value={email}
              onChange={onChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPasswordOne}
                      onMouseDown={handleMouseDownPasswordOne}
                    >
                      {showPasswordOne ? (
                        <Visibility />
                      ) : (
                        <VisibilityOff />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              name="passwordOne"
              label="Password"
              type={showPasswordOne ? 'text' : 'password'}
              id="passwordOne"
              hiddenLabel="Password must be at least 8 characters long and contain one uppercase, one lowercase and one number"
              helperText="Password must be at least 8 characters long and contain one uppercase, one lowercase, one number and one special character"
              value={passwordOne}
              onChange={onChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="passwordTwo"
              label="Confirm Password"
              type={showPasswordTwo ? 'text' : 'password'}
              id="passwordTwo"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPasswordTwo}
                      onMouseDown={handleMouseDownPasswordTwo}
                    >
                      {showPasswordTwo ? (
                        <Visibility />
                      ) : (
                        <VisibilityOff />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={!isMatch}
              helperText={!isMatch ? 'Passwords must match' : ''}
              value={passwordTwo}
              onChange={onChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="access code"
              label="Access Code"
              name="accessCode"
              helperText="Access code will be supplied to you by MRN leadership"
              value={accessCode}
              onChange={onChange}
            />
            {accessCode === adminPasscode && (
              <label>
                Admin:
                <input
                  disabled={accessCode !== adminPasscode}
                  name="isAdmin"
                  type="checkbox"
                  checked={isAdmin}
                  onChange={onChangeCheckbox}
                />
              </label>
            )}

            <Button
              disabled={isInvalid}
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign Up
            </Button>

            {error && <Alert severity="error">{error.message}</Alert>}
            <PasswordForgetLink />
          </form>
        </div>
      </Container>
    </>
  );
};

const SignUpForm = compose(withRouter, withFirebase)(SignUpFormBase);

export default SignUpPage;

export { SignUpForm };
