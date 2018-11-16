import React from 'react';

import * as ROLES from '../../constants/roles';
import AuthUserContext from '../Session/AuthUserContext';
import withAuthorization from '../Session/withAuthorization';

const AdminPage = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <div>
        <h1>Admin Account: {authUser.email}</h1>
      </div>
    )}
  </AuthUserContext.Consumer>
);

const authCondition = authUser =>
  authUser && authUser.roles.includes(ROLES.ADMIN);

export default withAuthorization(authCondition)(AdminPage);
