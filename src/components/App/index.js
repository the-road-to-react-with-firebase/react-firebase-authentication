import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navigation from '../Navigation';
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import AccountPage from '../Account';
import AdminPage from '../Admin';
import { withAuthentication } from '../Session';
import * as ROUTES from '../../constants/routes';

import './index.css';

const App = () => (
  <Router>
    <div className="app">
      <Navigation />
      <hr />
      <Route exact path={ROUTES.LANDING} component={LandingPage} />
      <Route exact path={ROUTES.SIGN_UP} component={SignUpPage} />
      <Route exact path={ROUTES.SIGN_IN} component={SignInPage} />
      <Route
        exact
        path={ROUTES.PASSWORD_FORGET}
        component={PasswordForgetPage}
      />
      <Route exact path={ROUTES.HOME} component={HomePage} />
      <Route exact path={ROUTES.ACCOUNT} component={AccountPage} />
      <Route exact path={ROUTES.ADMIN} component={AdminPage} />
      <hr />
      <span>
        Found in{' '}
        <a href="https://roadtoreact.com/course-details?courseId=TAMING_THE_STATE">
          Taming the State in React
        </a>
      </span>{' '}
      |{' '}
      <span>
        Star the{' '}
        <a href="https://github.com/rwieruch/react-firebase-authentication">
          Repository
        </a>
      </span>{' '}
      |{' '}
      <span>
        Receive a{' '}
        <a href="https://www.getrevue.co/profile/rwieruch">
          Developer's Newsletter
        </a>
      </span>
    </div>
  </Router>
);

export default withAuthentication(App);
