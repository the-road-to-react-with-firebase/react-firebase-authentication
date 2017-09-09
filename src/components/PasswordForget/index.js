import React, { Component } from 'react';
import { Link } from 'react-router-dom';

const PasswordForgetPage = () =>
  <div>
    <h1>PasswordForget</h1>
    <PasswordForgetForm />
  </div>

class PasswordForgetForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
    };
  }

  onSubmit = (event) => {
    // do firebase password forget

    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <input
          value={this.state.email}
          onChange={event => this.setState(() => ({ email: event.target.value }))}
          type="text"
          placeholder="Email Address"
        />
        <button type="submit">
          Reset My Password
        </button>
      </form>
    );
  }
}

const PasswordForgetLink = () =>
  <p>
    <Link to="/pw-forget">Forgot Password?</Link>
  </p>

export default PasswordForgetPage;

export {
  PasswordForgetForm,
  PasswordForgetLink,
};
