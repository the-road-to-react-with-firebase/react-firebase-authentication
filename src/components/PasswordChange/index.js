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
    const {
      passwordOne,
      passwordTwo,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '';

    return (
      <form onSubmit={this.onSubmit}>
        <input
          value={passwordOne}
          onChange={event => this.setState(() => ({ email: event.target.value }))}
          type="password"
          placeholder="New Password"
        />
        <input
          value={passwordTwo}
          onChange={event => this.setState(() => ({ email: event.target.value }))}
          type="password"
          placeholder="Confirm New Password"
        />
        <button  disabled={isInvalid} type="submit">
          Reset My Password
        </button>
      </form>
    );
  }
}

export default PasswordChangeForm;