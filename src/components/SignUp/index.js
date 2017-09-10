import React, { Component } from 'react';
import { Link } from 'react-router-dom';

const SignUpPage = () =>
  <div>
    <h1>SignUp</h1>
    <SignUpForm />
  </div>

class SignUpForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      email: '',
      passwordOne: '',
      passwordTwo: '',
    };
  }

  onSubmit = (event) => {
    // do firebase sign up

    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <input
          value={this.state.username}
          onChange={event => this.setState(() => ({ username: event.target.value }))}
          type="text"
          placeholder="Full Name"
        />
        <input
          value={this.state.email}
          onChange={event => this.setState(() => ({ email: event.target.value }))}
          type="text"
          placeholder="Email Address"
        />
        <input
          value={this.state.passwordOne}
          onChange={event => this.setState(() => ({ passwordOne: event.target.value }))}
          type="password"
          placeholder="Password"
        />
        <input
          value={this.state.passwordTwo}
          onChange={event => this.setState(() => ({ passwordTwo: event.target.value }))}
          type="password"
          placeholder="Confirm Password"
        />
        <button type="submit">
          Sign Up
        </button>
      </form>
    );
  }
}

const SignUpLink = () =>
  <p>
    Don't have an account?
    {' '}
    <Link to="/signup">Sign Up</Link>
  </p>

export default SignUpPage;

export {
  SignUpForm,
  SignUpLink,
};