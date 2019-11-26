import React, { useState, useEffect } from 'react';

import { AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';
import MessageList from './MessageList';

const Messages = (props) => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [limit, setLimit] = useState(5);
  const [text, setText] = useState('');

  useEffect(() => onListenForMessages(), [limit]);

  const onListenForMessages = () => {
    setLoading(true);
    props.firebase
      .messages()
      .orderByChild('createdAt')
      .limitToLast(limit)
      .on('value', snapshot => {
        const messageObject = snapshot.val();
        if (messageObject) {
          const messageList = Object.keys(messageObject).map(key => ({
            ...messageObject[key],
            uid: key,
          }));
          setMessages(messageList);
          setLoading(false);
        } else {
          setMessages(null);
          setLoading(false);
        }
      });
  };

  useEffect(() => {
    onListenForMessages();
    return () => props.firebase.messages().off();
  }, [])

  const onChangeText = event => {
    setText(event.target.value);
  };

  const onCreateMessage = (event, authUser) => {
    props.firebase.messages().push({
      text,
      userId: authUser.uid,
      createdAt: props.firebase.serverValue.TIMESTAMP,
    });
    setText('')
    event.preventDefault();
  };

  const onEditMessage = (message, text) => {
    const { uid, ...messageSnapshot } = message;

    props.firebase.message(message.uid).set({
      ...messageSnapshot,
      text,
      editedAt: props.firebase.serverValue.TIMESTAMP,
    });
  };

  const onRemoveMessage = uid => {
    props.firebase.message(uid).remove();
  };

  const onNextPage = () => {
    setLimit(limit => limit + 5)
  };

  return (
    <AuthUserContext.Consumer>
      {authUser => (
        <div>
          {!loading && messages && (
            <button type="button" onClick={onNextPage}>
              More
            </button>
          )}

          {loading && <div>Loading ...</div>}

          {messages && (
            <MessageList
              authUser={authUser}
              messages={messages}
              onEditMessage={onEditMessage}
              onRemoveMessage={onRemoveMessage}
            />
          )}

          {!messages && <div>There are no messages ...</div>}

          <form
            onSubmit={event => onCreateMessage(event, authUser)}
          >
            <input
              type="text"
              value={text}
              onChange={onChangeText}
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </AuthUserContext.Consumer>
  );
}
export default withFirebase(Messages);
