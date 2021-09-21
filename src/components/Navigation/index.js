import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Link as Link2 } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';
import SignOutButton from '../SignOut';
import { AuthUserContext } from '../Session';
// import Switch from '@material-ui/core/Switch';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Divider from '@material-ui/core/Divider';
// import ListItemIcon from '@material-ui/core/ListItemIcon';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
}));

const TemporaryDrawer = ({ setSelected }) => {
  const classes = useStyles();
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const authList = (anchor, roles) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <Link2
          onClick={() => setSelected(' - New Activity')}
          style={{ textDecoration: 'none', color: '#000000de' }}
          to={ROUTES.NEW_ACTIVITY}
        >
          <ListItem button>New Activity</ListItem>
        </Link2>
        <Link2
          onClick={() => setSelected(' - My Activity')}
          style={{ textDecoration: 'none', color: '#000000de' }}
          to={ROUTES.MY_ACTIVITY}
        >
          <ListItem button>My Activity</ListItem>
        </Link2>
        {!!roles[ROLES.ADMIN] && (
          <Link2
          onClick={() => setSelected(' - Admin')}
            style={{ textDecoration: 'none', color: '#000000de' }}
            to={ROUTES.ADMIN}
          >
            <ListItem button>Admin</ListItem>
          </Link2>
        )}
      </List>
    </div>
  );

  const listNoAuth = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <Link2
          style={{ textDecoration: 'none', color: '#000000de' }}
          to={ROUTES.SIGN_IN}
        >
          <ListItem button>
            <ListItemText primary="Sign In" />
          </ListItem>
        </Link2>
        <Link2
          style={{ textDecoration: 'none', color: '#000000de' }}
          to={ROUTES.SIGN_UP}
        >
          <ListItem button>
            <ListItemText primary="Sign Up" />
          </ListItem>
        </Link2>
      </List>
    </div>
  );

  const anchor = 'left';
  return (
    <AuthUserContext.Consumer>
      {(auth) => (
        <div>
          <Button onClick={toggleDrawer(anchor, true)}>
            <MenuIcon style={{ color: 'white' }} />
          </Button>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {auth ? authList(anchor, auth.roles) : listNoAuth(anchor)}
          </Drawer>
        </div>
      )}
    </AuthUserContext.Consumer>
  );
};

const Navigation = () => {
  const classes = useStyles();
  const [profileMenu, setProfileMenu] = React.useState(null);
  const [selected, setSelected] = React.useState('');
  const open = Boolean(profileMenu);

  const handleMenu = (event) => {
    setProfileMenu(event.currentTarget);
  };

  const handleClose = () => {
    setProfileMenu(null);
  };

  return (
    <AuthUserContext.Consumer>
      {(auth) => (
        <div className={classes.root}>
          <FormGroup>
          </FormGroup>
          <AppBar position="static">
            <Toolbar>
              <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
                aria-label="menu"
              >
                <TemporaryDrawer setSelected={setSelected} />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                {`MRN Tracking ${selected}`}
              </Typography>
              {auth && (
                <div>
                  <span>
                    {auth.username}
                  </span>
                  <IconButton
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                  >
                    <AccountCircle />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={profileMenu}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    // transformOrigin={{
                    //   vertical: 'top',
                    //   horizontal: 'right',
                    // }}
                    open={open}
                    onClose={handleClose}
                  >
                    {/* <MenuItem onClick={handleClose}>
                      My Account
                    </MenuItem> */}
                    <MenuItem>
                      <SignOutButton />
                    </MenuItem>
                  </Menu>
                </div>
              )}
            </Toolbar>
          </AppBar>
        </div>
      )}
    </AuthUserContext.Consumer>
  );
};


export default Navigation;
