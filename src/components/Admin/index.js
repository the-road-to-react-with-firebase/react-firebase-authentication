import React, { Component } from 'react';

import { db } from '../../firebase';
import * as ROLES from '../../constants/roles';
import withAuthorization from '../Session/withAuthorization';

class AdminPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      error: false,
      users: [],
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    db.users()
      .once('value')
      .then(snapshot => {
        const usersObject = snapshot.val();
        const users = Object.keys(usersObject).map(key => ({
          ...usersObject[key],
          id: key,
        }));

        this.setState(state => ({
          users,
          loading: false,
        }));
      })
      .catch(error => {
        this.setState({ error: true, loading: false });
      });

    db.users().on('child_removed', snapshot => {
      this.setState(state => ({
        users: state.users.filter(user => user.id !== snapshot.key),
      }));
    });
  }

  onRemove = userId => {
    db.user(userId).remove();
  };

  render() {
    const { users, loading, error } = this.state;

    return (
      <div>
        <h1>Admin</h1>
        <p>
          The Admin Page is accessible by every signed in admin user.
        </p>

        {loading && <div>Loading ...</div>}
        {error && <div>Something went wrong ...</div>}

        <UserList users={users} onRemove={this.onRemove} />
      </div>
    );
  }
}

const UserList = ({ users, onRemove }) => (
  <ul>
    {users.map(user => (
      <li key={user.id}>
        <span>
          <strong>ID:</strong> {user.id}
        </span>
        <span>
          <strong>E-Mail:</strong> {user.email}
        </span>
        <span>
          <strong>Username:</strong> {user.username}
        </span>
        <span>
          <strong>Roles:</strong> {(user.roles || []).join('')}
        </span>
        <span>
          <button type="button" onClick={() => onRemove(user.id)}>
            Remove
          </button>
        </span>
      </li>
    ))}
  </ul>
);

const authCondition = authUser =>
  authUser && authUser.roles.includes(ROLES.ADMIN);

export default withAuthorization(authCondition)(AdminPage);
