import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import SaveIcon from '@material-ui/icons/Save';
import { AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';

// import Menu from '@material-ui/core/Menu';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
// import List from '@material-ui/core/List';
// import ListItem from '@material-ui/core/ListItem';
// import ListItemText from '@material-ui/core/ListItemText';

import Select from '@material-ui/core/Select';
// import { ReferenceArea } from 'recharts';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
}));

const options = [
  // 'Activity Type',
  'Referral Given',
  'Business Received',
  'One on One',
  'Networking Event',
];

const users = [
  'Former Member',
  'Volker Ackerman',
  'Pam Morton',
  'Carl Corsini',
  'Don Mcrea',
];

const NewActivity = ({ firebase, authUser }) => {
  const classes = useStyles();
  const [member, setMember] = useState('Former Member');
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState(firebase.serverValue.TIMESTAMP);
  const [activityType, setActivityType] = useState('Referral Given');
  const [note, setNote] = useState('');

  const handleChangeMember = event => {
    setMember(event.target.value);
  };

  const handleChangeType = event => {
    setActivityType(event.target.value);
  };
  const handleChangeNote = event => {
    setNote(event.target.value);
  };

  const handleChangeDate = event => {
    setDate(event.target.value);
  };

  const handleChangeAmount = event => {
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

  const onCreateActivity = (event, authUser) => {
    event.preventDefault();
    console.log(authUser);
    let { key, ...results } = firebase.activities().push({
      activityType,
      userId: authUser.uid,
      amount,
      date,
      note,
      createdAt: firebase.serverValue.TIMESTAMP,
    });
  };

  return (
    <AuthUserContext.Consumer>
      {auth => (
        <Container component="main" maxWidth="xs">
          <Typography
            style={{ marginTop: '1em' }}
            variant="h6"
            gutterBottom
          >
            New Activity
          </Typography>
          <Typography
            style={{ marginBottom: '1em' }}
            variant="subtitle1"
            gutterBottom
          >
            Track a New Activity by selecting from the options below,
            hit save when you are finished.
          </Typography>
          <Grid container spacing={3}>
            {/* <Grid item xs={12} md={6}>
          <SimpleListMenu
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
          />
        </Grid> */}
            <Grid item xs={12} md={6}>
              <InputLabel id="demo-simple-select-label">
                Type of Activity
              </InputLabel>
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
            {(activityType === 'Referral Given' ||
              activityType === 'Business Received') && (
              <Grid item xs={12} md={6}>
                <InputLabel id="demo-simple-select-label">
                  Member
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={member}
                  onChange={handleChangeMember}
                >
                  {users.map((username, index) => (
                    <MenuItem key={index} value={username}>
                      {username}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
            )}
            <Grid item xs={12} md={6}>
              <TextField
                id="date"
                label="Date of Activity"
                type="date"
                defaultValue="2021-06-23"
                className={classes.textField}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={handleChangeDate}
              />
            </Grid>
            {activityType === 'Business Received' && (
              <Grid item xs={12} md={6}>
                <TextField
                  id="amount"
                  label="Amount in $"
                  helperText="Amount of dollars closed"
                  fullWidth
                  onChange={handleChangeAmount}
                />
              </Grid>
            )}
            <Grid item xs={12} md={6}>
              <TextField
                id="notes"
                label="Notes"
                helperText="Write a note here"
                fullWidth
                onChange={handleChangeNote}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                onClick={event => onCreateActivity(event, auth)}
                variant="contained"
                color="primary"
                size="large"
                className={classes.button}
                startIcon={<SaveIcon />}
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </Container>
      )}
    </AuthUserContext.Consumer>
  );
};

export default withFirebase(NewActivity);
