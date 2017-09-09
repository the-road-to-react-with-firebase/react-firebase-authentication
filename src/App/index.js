import React, { Component, PropTypes } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import AccountPage from '../Account';

import './index.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authUser: null,
    };
  }

  getChildContext() {
    return {
      authUser: this.state.authUser,
    };
  }

  render() {
    return (
      <Router>
        <div>
          <Navigation />

          <hr/>

          <Route exact path="/" component={LandingPage} />
          <Route exact path="/signup" component={SignUpPage} />
          <Route exact path="/signin" component={SignInPage} />
          <Route exact path="/pw-forget" component={PasswordForgetPage} />
          <Route path="/home" component={HomePage} />
          <Route path="/account" component={AccountPage} />
        </div>
      </Router>
    );
  }
}

App.childContextTypes = {
  authUser: PropTypes.object,
};

const Navigation = ({ authUser }) =>
  <div>
    { authUser
        ? <NavigationAuth />
        : <NavigationNonAuth />
    }
  </div>

Navigation.contextTypes = {
  authUser: PropTypes.object,
};

const NavigationAuth = () =>
  <ul>
  <li><Link to="/">Landing</Link></li>
    <li><Link to="/home">Home</Link></li>
    <li><Link to="/account">Account</Link></li>
  </ul>

const NavigationNonAuth = () =>
  <ul>
    <li><Link to="/">Landing</Link></li>
    <li><Link to="/signin">Sign In</Link></li>
  </ul>

export default App;
