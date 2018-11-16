import React, { Component } from 'react';

import AuthUserContext from '../Session/AuthUserContext';
import withAuthorization from '../Session/withAuthorization';
import { db } from '../../firebase';

class HomePage extends Component {
  constructor() {
    super();

    this.state = {
      loading: false,
      error: false,
      text: '',
      messages: [],
      users: {},
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    db.users()
      .once('value')
      .then(snapshot => {
        this.setState(state => ({
          users: snapshot.val(),
          loading: false,
        }));
      })
      .catch(error => {
        this.setState({ error: true, loading: false });
      });

    db.messages()
      .orderByKey()
      .limitToLast(100)
      .on('child_added', snapshot => {
        this.setState(state => ({
          messages: [snapshot.val(), ...state.messages],
        }));
      });
  }

  onChange = event => {
    this.setState({ text: event.target.value });
  };

  onSubmit = (event, authUser) => {
    const { text } = this.state;

    db.messages().push({
      text,
      userId: authUser.id,
    });

    this.setState({ text: '' });

    event.preventDefault();
  };

  render() {
    const { messages, users, text, loading, error } = this.state;

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

            <MessageList messages={messages} users={users} />

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

export default withAuthorization(authCondition)(HomePage);
