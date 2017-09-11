import React from 'react';

import withAuthorization from '../Session/withAuthorization';

const HomePage = () =>
  <div>
    <h1>Home</h1>
    <p>The Home Page is accessible by every signed in user.</p>
  </div>

export default withAuthorization(true)(HomePage);