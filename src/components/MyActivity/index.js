import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import Link from '@material-ui/core/Link';
import Divider from '@material-ui/core/Divider';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import ActivityTable from './ActivityTable';
import { withFirebase } from '../Firebase';
import {
  AuthUserContext,
  withAuthorization,
  withEmailVerification,
} from '../Session';
import { compose } from 'recompose';
const numbers = [25, 50, 100, 250];
const MyActivity = ({ firebase }) => {
  const classes = useStyles();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(25);

  const handleChangeLimit = (event) => {
    setLimit(event.target.value);
  };

  const onListenForActivity = (uid) => {
    let givenList = [];
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
          firebase
            .activities()
            .orderByChild('member_id')
            .equalTo(uid)
            .limitToLast(limit)
            .on('value', async (snapshot) => {
              const activityObject2 = snapshot.val();
              if (activityObject2) {
                const activityList2 = Object.keys(
                  activityObject2,
                ).map((uid) => ({
                  ...activityObject2[uid],
                  uid,
                }));
                givenList = activityList2.map((obj) =>
                  obj.activityType === 'Business Received'
                    ? {
                        ...obj,
                        activityType: 'Business Given',
                        username: obj.this_username,
                      }
                    : obj,
                );
                setActivities([...givenList, ...activityList]);
                setLoading(false);
              } else {
                setActivities(activityList);
                setLoading(false);
              }
            });
        } else {
          setActivities([]);
          setLoading(false);
        }
      });
  };

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  return (
    <AuthUserContext.Consumer>
      {(authUser) => (
        <div className={classes.root}>
          <CssBaseline />
          <main className={classes.content}>
            {/* <div className={classes.appBarSpacer} /> */}
            <Container maxWidth="lg" className={classes.container}>
              <Divider />
              <Grid container spacing={5}>
                <Grid item xs={12} md={12} lg={12}>
                  {/* <Paper className={fixedHeightPaper}> */}
                  <ActivityTable
                    setActivities={setActivities}
                    authUser={authUser}
                    onListenForActivity={onListenForActivity}
                    activities={activities}
                  />
                  {/* </Paper> */}
                  <InputLabel style={{ marginTop: '1em' }}>
                    Show
                  </InputLabel>
                  Last{' '}
                  <Select value={limit} onChange={handleChangeLimit}>
                    {numbers.map((value, index) => (
                      <MenuItem key={index} value={value}>
                        {value}
                      </MenuItem>
                    ))}
                  </Select>
                  Activities
                </Grid>
              </Grid>
              <Box pt={1}>
                <Copyright />
              </Box>
            </Container>
          </main>
        </div>
      )}
    </AuthUserContext.Consumer>
  );
};

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © Designed and Created by '}
      <Link color="inherit" href="https://netwrk.biz">
        netwrk.biz
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));

const condition = (authUser) => authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(withFirebase(MyActivity));
