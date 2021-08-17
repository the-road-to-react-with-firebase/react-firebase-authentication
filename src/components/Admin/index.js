import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { compose } from 'recompose';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { withAuthorization, withEmailVerification } from '../Session';
import { UserList, UserItem } from '../Users';
import AdminTable from './AdminTable';
import * as ROLES from '../../constants/roles';
import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';

const AdminPage = ({ firebase }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(25);
  const [users, setUsers] = useState([
    { username: 'Former Member', uid: 'former_member' },
  ]);
  const [selectedMember, setSelectedMember] =
    useState('former_member');
  const onListenForActivity = (uid) => {
    setLoading(true);

    firebase
      .activities()
      .orderByChild('userId')
      .equalTo(uid)
      .limitToLast(limit)
      .on('value', (snapshot) => {
        const activityObject = snapshot.val();

        if (activityObject) {
          const activityList = Object.keys(activityObject).map(
            (uid) => ({
              ...activityObject[uid],
              uid,
            }),
          );
          setActivities(activityList);
          setLoading(false);
        } else {
          setActivities([]);
          setLoading(false);
        }
      });
  };

  const handleChangeMember = (event) => {
    setSelectedMember(event.target.value);
  };

  useEffect(() => {
    const onListenForUsers = () => {
      firebase.users().on('value', (snapshot) => {
        const usersObject = snapshot.val();

        const usersList = Object.keys(usersObject).map((key) => ({
          ...usersObject[key],
          uid: key,
        }));

        setUsers([...users, ...usersList]);
      });
    };
    onListenForUsers();
  },[]);
  return (
    <AuthUserContext.Consumer>
      {(authUser) => (
        <div>
          <h1>Admin</h1>
          <p>
            The Admin Page is accessible by every signed in admin
            user.
          </p>
          <h1>Activites</h1>
          <Grid item xs={12} md={6}>
            <InputLabel>Member</InputLabel>
            <Select
              value={selectedMember}
              onChange={handleChangeMember}
            >
              {users.map((data, index) => (
                <MenuItem key={index} value={data.uid}>
                  {data.username}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <AdminTable
            selectedMember={selectedMember}
            authUser={authUser}
            onListenForActivity={onListenForActivity}
            activities={activities}
          />
          <Switch>
            <Route
              exact
              path={ROUTES.ADMIN_DETAILS}
              component={UserItem}
            />
            <Route exact path={ROUTES.ADMIN} component={UserList} />
          </Switch>
        </div>
      )}
    </AuthUserContext.Consumer>
  );
};

const condition = (authUser) =>
  authUser && !!authUser.roles[ROLES.ADMIN];

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(withFirebase(AdminPage));
