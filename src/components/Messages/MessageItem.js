import React, { useState } from 'react';

const MessageItem = (props) => {
  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState(props.message.text);

  const onToggleEditMode = () => {
    setEditMode(!editMode);
    setEditText(props.message.text);
  };

  const onChangeEditText = event => {
    setEditText(event.target.value);
  };

  const onSaveEditText = () => {
    props.onEditMessage(props.message, editText);
    setEditMode(false)
  };

  const { authUser, message, onRemoveMessage } = props;

  return (
    <li>
      {editMode ? (
        <input
          type="text"
          value={editText}
          onChange={onChangeEditText}
        />
      ) : (
        <span>
          <strong>{message.userId}</strong> {message.text}
          {message.editedAt && <span>(Edited)</span>}
        </span>
      )}

      {authUser.uid === message.userId && (
        <span>
          {editMode ? (
            <span>
              <button onClick={onSaveEditText}>Save</button>
              <button onClick={onToggleEditMode}>Reset</button>
            </span>
          ) : (
            <button onClick={onToggleEditMode}>Edit</button>
          )}

          {!editMode && (
            <button
              type="button"
              onClick={() => onRemoveMessage(message.uid)}
            >
              Delete
            </button>
          )}
        </span>
      )}
    </li>
  );
}

export default MessageItem;
