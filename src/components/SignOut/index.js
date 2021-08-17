import React from 'react';

import { withFirebase } from '../Firebase';

const SignOutButton = ({ firebase, history }) => {
  const handleClick = () => {
    firebase.doSignOut();
  };
  return (
    <div
      position="right"
      onClick={handleClick}
      name="admin"
      // active={activeItem === 'editorials'}
    >
      Sign Out
    </div>
  );
};

export default withFirebase(SignOutButton);
