import React, { Component } from 'react';

class PasswordChangeForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      passwordOne: '',
      passwordTwo: '',
    };
  }

  onSubmit = (event) => {
    // do firebase password change

    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <input
          value={this.state.passwordOne}
          onChange={event => this.setState(() => ({ email: event.target.value }))}
          type="password"
          placeholder="New Password"
        />
        <input
          value={this.state.passwordTwo}
          onChange={event => this.setState(() => ({ email: event.target.value }))}
          type="password"
          placeholder="Confirm New Password"
        />
        <button type="submit">
          Reset My Password
        </button>
      </form>
    );
  }
}

export default PasswordChangeForm;