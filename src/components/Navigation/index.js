import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import SignOutButton from '../SignOut';
import * as routes from '../../constants/routes';

import { Menu } from 'semantic-ui-react'

const Navigation = (props, { authUser }) =>
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
  <Menu pointing secondary>
    <Menu.Item>
      <Link to={routes.LANDING}>Landing</Link>
    </Menu.Item>
    <Menu.Item>
      <Link to={routes.HOME}>Home</Link>
    </Menu.Item>
    <Menu.Item>
      <Link to={routes.ACCOUNT}>Account</Link>
    </Menu.Item>
    <Menu.Item>
      <SignOutButton />
    </Menu.Item>
  </Menu>

const NavigationNonAuth = () =>
  <Menu pointing secondary>
    <Menu.Item>
      <Link to={routes.LANDING}>Landing</Link>
    </Menu.Item>
    <Menu.Item>
      <Link to={routes.SIGN_IN}>Sign In</Link>
    </Menu.Item>
  </Menu>

export default Navigation;
