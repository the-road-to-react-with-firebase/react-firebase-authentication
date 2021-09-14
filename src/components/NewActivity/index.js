import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import SaveIcon from '@material-ui/icons/Save';
import Alert from '@material-ui/lab/Alert';
import InputAdornment from '@material-ui/core/InputAdornment';
import { AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';
import { withAuthorization, withEmailVerification } from '../Session';
import { compose } from 'recompose';

// import Menu from '@material-ui/core/Menu';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
// import List from '@material-ui/core/List';
// import ListItem from '@material-ui/core/ListItem';
// import ListItemText from '@material-ui/core/ListItemText';

// import { ReferenceArea } from 'recharts';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
}));

const options = [
  'Referral Given',
  'Business Received',
  'One to One',
  'Networking Event',
  'Attendance',
];

const present = [
  { display: 'Present', value: true },
  { display: 'Absent', value: false },
];

const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const NewActivity = ({ firebase, history }) => {
  let today = new Date();
  const [users, setUsers] = useState([
    { username: 'Former Member', uid: 'former_member' },
  ]);
  const [thursday, setThursday] = useState(false);
  const classes = useStyles();
  const [guests, setGuests] = useState(0);
  const [member, setMember] = useState('former_member');
  const [username, setUsername] = useState('Former Member');
  const [amount, setAmount] = useState('');
  const [attendance, setAttendance] = useState(true);
  const [date, setDate] = useState(today.toISOString().slice(0, 10));
  const [activityType, setActivityType] = useState('Referral Given');
  const [note, setNote] = useState('');
  const [oneToOnes, setOneToOnes] = useState(1);
  const [success, setSuccess] = useState(false);

  const handleChangeMember = (event) => {
    setMember(event.target.value);
  };

  const handleChangeType = (event) => {
    setActivityType(event.target.value);
  };
  const handleChangeNote = (event) => {
    setNote(event.target.value);
  };

  const handleChangeAttendance = (event) => {
    const att = event.target.value;
    if (att === 'Present') {
      setAttendance(true);
    } else {
      setAttendance(false);
    }
  };

  const handleChangeDate = (event) => {
    setDate(event.target.value);
  };

  const handleChangeOneToOnes = (event) => {
    setOneToOnes(event.target.value);
  };

  const handleChangeGuests = (event) => {
    setGuests(event.target.value);
  };

  const handleChangeAmount = (event) => {
    setAmount(event.target.value);
  };

  const onEditMessage = (message, text) => {
    const { uid, ...messageSnapshot } = message;

    firebase.message(message.uid).set({
      ...messageSnapshot,
      text,
      editedAt: this.props.firebase.serverValue.TIMESTAMP,
    });
  };

  const onListenForUsers = () => {
    // setLoading(true);

    firebase
      .users()
      .orderByChild('email')
      .limitToLast(30)
      .on('value', (snapshot) => {
        const usersObject = snapshot.val();
        if (usersObject) {
          const usersList = Object.keys(usersObject).map((uid) => ({
            ...usersObject[uid],
            uid,
          }));
          usersList.sort(function (a, b) {
            if (a.username < b.username) {
              return -1;
            }
            if (a.username > b.username) {
              return 1;
            }
            return 0;
          });
          setUsers([...users, ...usersList]);
          // setLoading(false);
        } else {
          setUsers([]);
          // setLoading(false);
        }
      });
  };

  const onCreateActivity = async (event, authUser) => {
    event.preventDefault();
    let { key, ...results } = await firebase.activities().push({
      activityType,
      userId: authUser.uid,
      this_username: authUser.username,
      amount: activityType !== 'Business Received' ? '' : amount,
      date,
      date_timestamp: new Date(date).getTime() / 1000,
      note,
      num_one_to_ones: activityType !== 'One to One' ? '' : oneToOnes,
      attendance: activityType === 'Attendance' ? attendance : '',
      num_guests: activityType === 'Attendance' ? guests : '',
      member_id:
        activityType === 'Business Received' ||
        activityType === 'Referral Given'
          ? member
          : '',
      username:
        activityType === 'Business Received' ||
        activityType === 'Referral Given'
          ? username
          : '',
      createdAt: firebase.serverValue.TIMESTAMP,
    });
    if (await key) {
      setMember('former_member');
      setNote('');
      // setDate(event.target.value);
      setOneToOnes(1);
      setAmount('');
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 6000);
    } else {
      setSuccess(false);
    }
  };

  useEffect(() => {
    onListenForUsers();
  }, []);

  return (
    <AuthUserContext.Consumer>
      {(auth) => (
        <Container component="main" maxWidth="xs">
          <Typography
            style={{ marginTop: '1em' }}
            variant="h6"
            gutterBottom
          >
            New Activity
          </Typography>
          <Typography
            style={{ marginBottom: '2em' }}
            variant="subtitle1"
            gutterBottom
          >
            Track a <strong>new activity</strong> by selecting from
            the options below, hit save when you are finished.
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <InputLabel>Type of Activity</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={activityType}
                onChange={handleChangeType}
              >
                {options.map((value, index) => (
                  <MenuItem key={index} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            {activityType === 'Attendance' ? (
              <Grid item xs={12} md={6}>
                <InputLabel>Attendance</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={attendance}
                  onChange={handleChangeAttendance}
                >
                  {present.map((value, index) => (
                    <MenuItem key={index} value={value.value}>
                      {value.display}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
            ) : undefined}
            {(activityType === 'Referral Given' ||
              activityType === 'Business Received') && (
              <Grid item xs={12} md={6}>
                <InputLabel>Member</InputLabel>
                <Select value={member} onChange={handleChangeMember}>
                  {users.map((data, index) => {
                    if (data.uid !== auth.uid) {
                      return (
                        <MenuItem
                          onClick={() => setUsername(data.username)}
                          key={index}
                          value={data.uid}
                        >
                          {data.username}
                        </MenuItem>
                      );
                    }
                  })}
                </Select>
              </Grid>
            )}
            <Grid item xs={12} md={6}>
              <TextField
                id="date"
                defaultValue={date}
                label="Date of Activity"
                type="date"
                className={classes.textField}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={handleChangeDate}
              />
            </Grid>
            {activityType === 'One to One' && (
              <Grid item xs={12} md={6}>
                <InputLabel>Number of One to Ones</InputLabel>
                <Select
                  value={oneToOnes}
                  onChange={handleChangeOneToOnes}
                >
                  {numbers.map((value, index) => (
                    <MenuItem key={index} value={value}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
            )}
            {activityType === 'Attendance' && (
              <Grid item xs={12} md={6}>
                <InputLabel>Number of Guests</InputLabel>
                <Select value={guests} onChange={handleChangeGuests}>
                  {numbers.map((value, index) => (
                    <MenuItem key={index} value={value}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
            )}
            {activityType === 'Business Received' && (
              <Grid item xs={12} md={6}>
                <TextField
                  type="number"
                  id="amount"
                  label="Amount in $"
                  helperText="Amount of dollars closed"
                  fullWidth
                  value={amount}
                  onChange={handleChangeAmount}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        $
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            )}
            <Grid item xs={12} md={6}>
              <TextField
                id="notes"
                label="Notes"
                helperText="Write a note here"
                placeholder="note to self..."
                fullWidth
                value={note}
                onChange={handleChangeNote}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                onClick={(event) => onCreateActivity(event, auth)}
                variant="contained"
                color="primary"
                size="large"
                className={classes.button}
                startIcon={<SaveIcon />}
              >
                Save
              </Button>
            </Grid>
            <Grid item xs={12}>
              {success && (
                <Alert severity="success">
                  Activity saved succesfully! View your activites on the My Activity page.
                </Alert>
              )}
            </Grid>
          </Grid>
        </Container>
      )}
    </AuthUserContext.Consumer>
  );
};
const condition = (authUser) => authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(withFirebase(NewActivity));
