import React, { useState, useEffect } from 'react';

import { AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';
import MessageList from './MessageList';

const Messages = (props) => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [limit, setLimit] = useState(5);
  const [text, setText] = useState('');

  useEffect(() => {
    const unsubscribe = onListenForMessages();
    return () => unsubscribe();
  }, [limit])

  const onListenForMessages = () => {
    setLoading(true);
    const unsubscribe = props.firebase
      .messages()
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .onSnapshot(querySnapshot => {
        if (!querySnapshot.empty) {
          const messageList = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            uid: doc.id
          }));
          setMessages(messageList);
          setLoading(false);
        } else {
          setMessages(null);
          setLoading(false);
        }
      });
    return unsubscribe;
  };

  const onChangeText = event => {
    setText(event.target.value);
  };

  const onCreateMessage = (event, authUser) => {
    props.firebase.messages().add({
      text,
      userId: authUser.uid,
      createdAt: props.firebase.serverValue.serverTimestamp(),
    });
    setText('')
    event.preventDefault();
  };

  const onEditMessage = (message, text) => {
    const { uid, ...messageSnapshot } = message;

    props.firebase.message(message.uid).set({
      ...messageSnapshot,
      text,
      editedAt: props.firebase.serverValue.serverTimestamp(),
    });
  };

  const onRemoveMessage = uid => {
    props.firebase.message(uid).delete();
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
