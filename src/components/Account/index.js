import React from 'react';

import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';

const AccountPage = () => (
  <div>
    <h1>Account Page</h1>
    <PasswordForgetForm />
    <PasswordChangeForm />
  </div>
);

export default AccountPage;
