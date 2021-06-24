import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Link as Link2 } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';
import SignOutButton from '../SignOut';
import { AuthUserContext } from '../Session';

const useStyles = makeStyles(theme => ({
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

const TemporaryDrawer = () => {
  const classes = useStyles();
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => event => {
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
          style={{ textDecoration: 'none', color: '#000000de' }}
          to={ROUTES.HOME}
        >
          <ListItem button>Home</ListItem>
        </Link2>
        {/* {['New Activity', 'My Activity'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemText primary={text} />
          </ListItem>
        ))} */}
        <Link2
          style={{ textDecoration: 'none', color: '#000000de' }}
          to={ROUTES.NEW_ACTIVITY}
        >
          <ListItem button>New Activity</ListItem>
        </Link2>
        <Link2
          style={{ textDecoration: 'none', color: '#000000de' }}
          to={ROUTES.MY_ACTIVITY}
        >
          <ListItem button>My Activity</ListItem>
        </Link2>
        {!!roles[ROLES.ADMIN] && (
          <Link2
            style={{ textDecoration: 'none', color: '#000000de' }}
            to={ROUTES.ADMIN}
          >
            <ListItem button>Admin</ListItem>
          </Link2>
        )}
      </List>
    </div>
  );

  const listNoAuth = anchor => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <ListItem button>
          <Link2
            style={{ textDecoration: 'none', color: '#000000de' }}
            to={ROUTES.SIGN_IN}
          >
            <ListItemText primary="Sign In" />
          </Link2>
        </ListItem>
        <ListItem button>
          <Link2
            style={{ textDecoration: 'none', color: '#000000de' }}
            to={ROUTES.SIGN_UP}
          >
            <ListItemText primary="Sign Up" />
          </Link2>
        </ListItem>
      </List>
    </div>
  );

  const anchor = 'left';
  return (
    <AuthUserContext.Consumer>
      {auth =>
        auth ? (
          <div>
            <Button onClick={toggleDrawer(anchor, true)}>
              <MenuIcon style={{ color: 'white' }} />
            </Button>
            <Drawer
              anchor={anchor}
              open={state[anchor]}
              onClose={toggleDrawer(anchor, false)}
            >
              {authList(anchor, auth.roles)}
            </Drawer>
          </div>
        ) : (
          <div>
            <Button onClick={toggleDrawer(anchor, true)}>
              <MenuIcon style={{ color: 'white' }} />
            </Button>
            <Drawer
              anchor={anchor}
              open={state[anchor]}
              onClose={toggleDrawer(anchor, false)}
            >
              {listNoAuth(anchor)}
            </Drawer>
          </div>
        )
      }
    </AuthUserContext.Consumer>
  );
};

const Navigation = ({ authUser }) => {
  const classes = useStyles();
  const [profileMenu, setProfileMenu] = React.useState(null);
  const open = Boolean(profileMenu);

  const handleMenu = event => {
    setProfileMenu(event.currentTarget);
  };

  const handleClose = () => {
    setProfileMenu(null);
  };

  return (
    <AuthUserContext.Consumer>
      {auth => (
        <div className={classes.root}>
          <FormGroup>
            {/* <FormControlLabel
              control={
                <Switch
                  checked={auth}
                  onChange={handleChange}
                  aria-label="login switch"
                />
              }
              label={auth ? 'Logout' : 'Login'}
            /> */}
          </FormGroup>
          <AppBar position="static">
            <Toolbar>
              <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
                aria-label="menu"
              >
                <TemporaryDrawer />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                MRN Tracking
              </Typography>

              {auth && (
                <div>
                  <Typography variant="span">
                    {auth.username}
                  </Typography>
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
                    profileMenu={profileMenu}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={open}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={handleClose}>
                      My account
                    </MenuItem>
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

// import React from 'react';
// import { Link as Link2 } from 'react-router-dom';
// import { Menu } from 'semantic-ui-react';

// import SignOutButton from '../SignOut';
// import Typography from '@material-ui/core/Typography';
// import Breadcrumbs from '@material-ui/core/Breadcrumbs';
// import Link from '@material-ui/core/Link';
// import * as ROUTES from '../../constants/routes';
// import * as ROLES from '../../constants/roles';

// const NavigationAuth = ({ authUser }) => (
//   <div id="login-container">
//     <Breadcrumbs aria-label="breadcrumb">
//       <Link color="inherit">
//         <Link to={ROUTES.LANDING}>MRN</Link>
//       </Link>
//       <Link color="inherit">
//         <Link to={ROUTES.HOME}>Home</Link>
//       </Link>
//     </Breadcrumbs>
//     <div>
//       <Link to={ROUTES.ACCOUNT}>Account</Link>
//       {!!authUser.roles[ROLES.ADMIN] && (
//         <Link to={ROUTES.ADMIN}>Admin</Link>
//       )}

//       <SignOutButton />
//     </div>
//   </div>
// );

// const NavigationNonAuth = () => (
//   <div>
//     <Breadcrumbs aria-label="breadcrumb">
//       <Link color="inherit">
//         <Link to={ROUTES.LANDING}>MRN</Link>
//       </Link>
//       <Link color="inherit">
//         <Link to={ROUTES.SIGN_IN}>Sign In</Link>
//       </Link>
//     </Breadcrumbs>
//   </div>
// );

export default Navigation;
