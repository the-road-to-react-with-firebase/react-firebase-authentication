import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import InputLabel from '@material-ui/core/InputLabel';
import SaveIcon from '@material-ui/icons/Save';
import { AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';

import Select from '@material-ui/core/Select';
import { ReferenceArea } from 'recharts';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
}));

const options = [
  // 'Activity Type',
  'Referral Given',
  '$ Business Received',
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


const NewActivity = ({firebase}) => {
  console.log(firebase)
  const classes = useStyles();
  const [member, setMember] = React.useState('Former Member');
  const [activityType, setActivityType] = React.useState(
    'Referral Given',
  );

  const handleChange = event => {
    setMember(event.target.value);
  };
  const handleChangeType = event => {
    setActivityType(event.target.value);
  };

  const onCreateMessage = (event, authUser) => {
    firebase.messages().push({
      text: this.state.text,
      userId: authUser.uid,
      createdAt: this.props.firebase.serverValue.TIMESTAMP,
    });

    this.setState({ text: '' });

    event.preventDefault();
  };

  
  return (
    <Container component="main" maxWidth="xs">
      <Typography
        style={{ marginTop: '1em' }}
        variant="h6"
        gutterBottom
      >
        New Activity
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
          activityType === 'Closed Business Recieved') && (
          <Grid item xs={12} md={6}>
            <InputLabel id="demo-simple-select-label">
              Member
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={member}
              onChange={handleChange}
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
          />
        </Grid>
        <Grid item xs={12} md={6}>
          {activityType === '$ Business Received' && (
            <TextField
              id="amount"
              label="Amount in $"
              helperText="Amount of dollars closed"
              fullWidth
            />
          )}
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            className={classes.button}
            startIcon={<SaveIcon />}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default withFirebase(NewActivity);
