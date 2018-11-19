import React, { Component } from 'react';
import { compose } from 'recompose';

import AuthUserContext from '../Session/AuthUserContext';
import withAuthorization from '../Session/withAuthorization';
import { withFirebase } from '../Firebase';

class HomePage extends Component {
  constructor() {
    super();

    this.state = {
      userLoading: false,
      messageLoading: false,
      error: false,
      text: '',
      messages: [],
      users: {},
    };
  }

  componentDidMount() {
    this.setState({ userLoading: true, messageLoading: true });

    this.props.firebase.users().on('value', snapshot => {
      this.setState(state => ({
        users: snapshot.val(),
        userLoading: false,
      }));
    });

    this.props.firebase
      .messages()
      .orderByKey()
      .limitToLast(100)
      .on('child_added', snapshot => {
        this.setState(state => ({
          messages: [snapshot.val(), ...state.messages],
          messageLoading: false,
        }));
      });
  }

  onChange = event => {
    this.setState({ text: event.target.value });
  };

  onSubmit = (event, authUser) => {
    const { text } = this.state;

    this.props.firebase.messages().push({
      text,
      userId: authUser.uid,
    });

    this.setState({ text: '' });

    event.preventDefault();
  };

  render() {
    const {
      messages,
      users,
      text,
      userLoading,
      messageLoading,
      error,
    } = this.state;

    const loading = userLoading || messageLoading;

    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <div>
            <h1>Home Page</h1>
            <p>
              The Home Page is accessible by every signed in user.
            </p>

            {loading && <div>Loading ...</div>}
            {error && <div>Something went wrong ...</div>}

            {!loading && (
              <MessageList messages={messages} users={users} />
            )}

            <form onSubmit={event => this.onSubmit(event, authUser)}>
              <input
                type="text"
                value={text}
                onChange={this.onChange}
              />
              <button type="submit">Send</button>
            </form>
          </div>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

const MessageList = ({ messages, users }) => (
  <ul>
    {messages.map((message, key) => (
      <MessageItem
        key={key}
        message={message}
        user={users[message.userId]}
      />
    ))}
  </ul>
);

const MessageItem = ({ message, user }) => (
  <li>
    <strong>{user.username}</strong>

    {message.text}
  </li>
);

const authCondition = authUser => !!authUser;

export default compose(
  withAuthorization(authCondition),
  withFirebase,
)(HomePage);
