import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { compose } from 'recompose';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginBottom: '1em',
    marginTop: '1em',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

import { withAuthorization, withEmailVerification } from '../Session';
import { UserList, UserItem } from '../Users';
import AdminTable from './AdminTable';
import * as ROLES from '../../constants/roles';
import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';
const AdminPage = ({ firebase }) => {
  const classes = useStyles();
  const [activities, setActivities] = useState([]);
  const [given, setGiven] = useState([]);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(25);
  const [users, setUsers] = useState([
    { username: 'Former Member', uid: 'former_member' },
  ]);
  const [selectedMember, setSelectedMember] =
    useState('former_member');

  const onListenForGiven = (uid) => {
    firebase
      .activities()
      .orderByChild('member_id')
      .equalTo(uid)
      .limitToLast(limit)
      .on('value', async (snapshot) => {
        const activityObject2 = snapshot.val();
        console.log(activityObject2);
        if (await activityObject2) {
          const activityList2 = Object.keys(activityObject2).map(
            (uid) => ({
              ...activityObject2[uid],
              uid,
            }),
          );
          const givenList = activityList2.map((obj) =>
            obj.activityType === 'Business Received'
              ? {
                  ...obj,
                  activityType: 'Business Given',
                }
              : obj,
          );
          setGiven(givenList);
          setLoading(false);
        }
      });
  };

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
  }, []);
  return (
    <AuthUserContext.Consumer>
      {(authUser) => (
        <Container>
          <h1>Admin</h1>
          <p>Select a member to view each members activites.</p>

          <Grid item xs={12} md={6}>
            <InputLabel>Member</InputLabel>
            <Select
              value={selectedMember}
              onChange={handleChangeMember}
            >
              {users.map((data, index) => {
                console.log(authUser)
                if (data.uid !== authUser.uid) {
                  return (
                    <MenuItem key={index} value={data.uid}>
                      {data.username}
                    </MenuItem>
                  );
                }
              })}
            </Select>
          </Grid>
          <AdminTable
            selectedMember={selectedMember}
            authUser={authUser}
            onListenForActivity={onListenForActivity}
            onListenForGiven={onListenForGiven}
            activities={activities}
            given={given}
            setActivities={setActivities}
          />
          <Switch>
            <div className={classes.root}>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography className={classes.heading}>
                    Users List
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Route
                    exact
                    path={ROUTES.ADMIN_DETAILS}
                    component={UserItem}
                  />
                  <Route
                    exact
                    path={ROUTES.ADMIN}
                    component={UserList}
                  />
                </AccordionDetails>
              </Accordion>
            </div>
          </Switch>
        </Container>
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
