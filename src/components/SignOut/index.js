import React from 'react';


import { withFirebase } from '../Firebase';

const SignOutButton = ({ firebase }) => (
  <div
    position="right"
    onClick={firebase.doSignOut}
    name="admin"
    // active={activeItem === 'editorials'}
  >
    Sign Out
  </div>
);

export default withFirebase(SignOutButton);
