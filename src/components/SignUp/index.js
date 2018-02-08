import React, { Component } from 'react';
import {
  Link,
  withRouter,
} from 'react-router-dom';

import { auth, db } from '../../firebase';
import * as routes from '../../constants/routes';

import { Button, Form, Grid, Header, Image, Segment } from 'semantic-ui-react'

const SignUpPage = ({ history }) =>
  <div>
    <SignUpForm history={history} />
  </div>

const updateByPropertyName = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class SignUpForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const {
      username,
      email,
      passwordOne,
    } = this.state;

    const {
      history,
    } = this.props;

    auth.doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {

        // Create a user in your own accessible Firebase Database too
        db.doCreateUser(authUser.uid, username, email)
          .then(() => {
            this.setState(() => ({ ...INITIAL_STATE }));
            history.push(routes.HOME);
          })
          .catch(error => {
            this.setState(updateByPropertyName('error', error));
          });

      })
      .catch(error => {
        this.setState(updateByPropertyName('error', error));
      });

    event.preventDefault();
  }

  render() {
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      username === '' ||
      email === '';

    return (
      <div className='login-form'>
        {/*
          Heads up! The styles below are necessary for the correct render of this example.
          You can do same with CSS, the main idea is that all the elements up to the `Grid`
          below must have a height of 100%.
        */}
        <style>{`
          body > div,
          body > div > div,
          body > div > div > div.login-form {
            height: 100%;
          }
        `}</style>
        <Grid
          textAlign='center'
          style={{ height: '100%' }}
          verticalAlign='middle'
        >
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as='h2' color='teal' textAlign='center'>
              <Image src='/logo.png' />
              {' '}Sign Up
            </Header>
            <Form size='large' onSubmit={this.onSubmit}>
              <Segment stacked>
                <Form.Input
                  fluid
                  icon='user'
                  iconPosition='left'
                  placeholder='User Name'
                  value={username}
                  onChange={event => this.setState(updateByPropertyName('username', event.target.value))}
                  type="text"
                />
                <Form.Input
                  fluid
                  icon='mail'
                  iconPosition='left'
                  placeholder="Email Address"
                  value={email}
                  onChange={event => this.setState(updateByPropertyName('email', event.target.value))}
                  type="text"
                />
                <Form.Input
                  fluid
                  icon='lock'
                  iconPosition='left'
                  value={passwordOne}
                  onChange={event => this.setState(updateByPropertyName('passwordOne', event.target.value))}
                  type="password"
                  placeholder="Password"
                />
                <Form.Input
                  fluid
                  icon='lock'
                  iconPosition='left'
                  value={passwordTwo}
                  onChange={event => this.setState(updateByPropertyName('passwordTwo', event.target.value))}
                  type="password"
                  placeholder="Confirm Password"
                />
                
                <Button disabled={isInvalid} type="submit">
                  Sign Up
                </Button>
              </Segment>
            </Form>
            { error && <p>{error.message}</p> }
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

const SignUpLink = () =>
  <p>
    Don't have an account?
    {' '}
    <Link to={routes.SIGN_UP}>Sign Up</Link>
  </p>

export default withRouter(SignUpPage);

export {
  SignUpForm,
  SignUpLink,
};