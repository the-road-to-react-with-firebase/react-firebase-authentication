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

import Select from '@material-ui/core/Select';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
}));

const options = [
  'Activity Type',
  'Referral Given',
  'Closed Business Received',
  'One on One',
  'Networking Event',
];

const SimpleListMenu = ({ selectedIndex, setSelectedIndex }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClickListItem = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setAnchorEl(null);
    console.log(selectedIndex);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      <List component="nav" aria-label="Device settings">
        <ListItem
          button
          aria-haspopup="true"
          aria-controls="lock-menu"
          aria-label="Activity Type"
          onClick={handleClickListItem}
        >
          <ListItemText
            primary="Activity Type"
            secondary={options[selectedIndex]}
          />
        </ListItem>
      </List>
      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {options.map((option, index) => (
          <MenuItem
            key={option}
            disabled={index === 0}
            selected={index === selectedIndex}
            onClick={event => handleMenuItemClick(event, index)}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

const NewActivity = () => {
  const classes = useStyles();
  const [member, setMember] = React.useState('Don Mcrea');

  const handleChange = event => {
    setMember(event.target.value);
  };
  const [selectedIndex, setSelectedIndex] = React.useState(1);
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
        <Grid item xs={12} md={6}>
          <SimpleListMenu
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
          />
        </Grid>
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
            <MenuItem value="Don Mcrea">Don Mcrea</MenuItem>
            <MenuItem value="Pam Morton">Pam Morton</MenuItem>
            <MenuItem value="Volker Ackerman">
              Volker Ackerman
            </MenuItem>
          </Select>
        </Grid>
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
          <TextField
            id="amount"
            label="Amount in $"
            helperText="Amount of dollars closed"
            fullWidth
          />
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

export default NewActivity;
