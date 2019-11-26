import React, { useState, useEffect } from 'react';

import { withFirebase } from '../Firebase';

const UserItem = (props) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(props.location.state.user);

  useEffect(() => {
    if(!user) return

    setLoading(true);

    props.firebase
      .user(props.match.params.id)
      .on('value', snapshot => {
        setUser(snapshot.val());
        setLoading(false)
      });
    return () => props.firebase.user(this.props.match.params.id).off();
  }, [])

  const onSendPasswordResetEmail = () => {
    props.firebase.doPasswordReset(user.email);
  };

  return (
    <div>
      <h2>User ({props.match.params.id})</h2>
      {loading && <div>Loading ...</div>}

      {user && (
        <div>
          <span>
            <strong>ID:</strong> {user.uid}
          </span>
          <span>
            <strong>E-Mail:</strong> {user.email}
          </span>
          <span>
            <strong>Username:</strong> {user.username}
          </span>
          <span>
            <button
              type="button"
              onClick={onSendPasswordResetEmail}
            >
              Send Password Reset
            </button>
          </span>
        </div>
      )}
    </div>
  );
}

export default withFirebase(UserItem);
