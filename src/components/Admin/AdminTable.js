import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@material-ui/data-grid';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { Grid } from '@material-ui/core';
// import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

import { withFirebase } from '../Firebase';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const qbrColumns = [
  {
    field: 'member',
    headerName: 'Member',
    width: 160,
  },
  {
    field: 'business_received',
    headerName: 'Business Received',
    width: 160,
    type: 'number',
    valueFormatter: (params) => {
      return !params.value
        ? ''
        : currencyFormatter.format(Number(params.value));
    },
  },
  {
    field: 'business_given',
    headerName: 'Business Given',
    width: 160,
    type: 'number',
    valueFormatter: (params) => {
      return !params.value
        ? ''
        : currencyFormatter.format(Number(params.value));
    },
  },
  {
    field: 'referrals_given',
    type: 'number',
    headerName: 'Referrals Given',
    width: 150,
    // hide: true,
  },
  {
    field: 'attendance',
    type: 'number',
    headerName: 'Attendance',
    width: 150,
  },
  {
    field: 'num_one_to_ones',
    headerName: '# 1 to 1s',
    type: 'number',
    width: 150,
    // hide: true,
  },
  {
    field: 'events',
    type: 'number',
    headerName: 'Events',
    width: 150,
  },
  // {
  //   field: 'date',
  //   headerName: 'Date of First Activity in Calculation',
  //   type: 'date',
  //   width: 120,
  //   valueFormatter: (params) =>
  //     new Date(params.value).toLocaleDateString(),
  //   sortComparator: (v1, v2, cellParams1, cellParams2) => {
  //     return (
  //       new Date(cellParams1.value) - new Date(cellParams2.value)
  //     );
  //   },
  // },
];

const columns = [
  {
    field: 'this_username',
    headerName: 'Member',
    width: 160,
  },
  {
    field: 'activityType',
    description: 'This is the type of activity tracked',
    headerName: 'Activity Type',
    width: 160,
  },
  {
    type: 'number',
    field: 'amount',
    valueFormatter: (params) => {
      return !params.value
        ? ''
        : currencyFormatter.format(Number(params.value));
    },
    headerName: 'Amount',
    width: 140,
  },
  { field: 'note', headerName: 'Notes', width: 150 },
  {
    field: 'num_one_to_ones',
    headerName: '# 1 to 1s',
    width: 150,
    // hide: true,
  },
  {
    field: 'member_id',
    headerName: 'Other Member ID',
    width: 150,
    hide: true,
  },
  { field: 'username', headerName: 'Other Member', width: 150 },
  {
    field: 'attendance',
    headerName: 'Attendance',
    width: 150,
    hide: true,
  },
  {
    field: 'num_guests',
    headerName: '# of Guests',
    width: 150,
    hide: true,
  },
  {
    field: 'date',
    headerName: 'Date',
    type: 'date',
    width: 120,
    valueFormatter: (params) =>
      new Date(params.value).toLocaleDateString(),
    sortComparator: (v1, v2, cellParams1, cellParams2) => {
      return (
        new Date(cellParams1.value) - new Date(cellParams2.value)
      );
    },
  },
  {
    field: 'createdAt',
    headerName: 'Created',
    type: 'date',
    width: 120,
    hide: true,
  },
];

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #2f479a',
    boxShadow: theme.shadows[3],
    padding: theme.spacing(2, 4, 3),
    borderRadius: '12px',
  },
}));

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const dateRanges = [7, 30, 60, 90, 180, 365];

const ActivityTable = ({
  activities,
  setActivities,
  given,
  firebase,
  onListenForActivity,
  onListenForGiven,
  loading,
  authUser,
}) => {
  let today = new Date();
  today.setDate(today.getDate() - 7);
  let sevenDays = today.toISOString().slice(0, 10);
  let otherDay = new Date();
  otherDay.setDate(otherDay.getDate() - 92);
  let quarterlyDays = otherDay.toISOString().slice(0, 10);

  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [edit, setEdit] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [dateRange, setDateRange] = useState(30);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalAmountGiven, setTotalAmountGiven] = useState(0);
  const [totalOneToOnes, setTotalOneToOnes] = useState(0);
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);
  const [totalGuests, setTotalGuests] = useState(0);
  const [totalAttendance, setTotalAttendance] = useState(0);
  const [groups, setGroups] = useState([]);
  const [sortModel, setSortModel] = React.useState([
    {
      field: 'date',
      sort: 'desc',
    },
  ]);
  const [filterModel, setFilterModel] = React.useState();
  const [users, setUsers] = useState([
    { username: 'Former Member', uid: 'former_member' },
    { username: 'All Members', uid: 'all_members' },
    {
      username: 'All Members - Quarterly',
      uid: 'all_members_quarterly',
    },
  ]);
  const [selectedMember, setSelectedMember] =
    useState('former_member');
  const [newNote, setNewNote] = useState('');

  const handleOpenDelete = () => {
    setDeleteOpen(true);
  };

  const handleCloseDelete = () => {
    setDeleteOpen(false);
  };

  const handleDelete = () => {
    firebase.activity(selectedItem.uid).remove();
    setOpen(false);
    setDeleteOpen(false);
  };
  const handleChangeMember = (event) => {
    setSelectedMember(event.target.value);
    if (event.target.value === 'all_members_quarterly') {
      setTimeout(() => {
        calculateGroup();
      }, 250);
    } else {
      setTimeout(() => {
        calculate();
      }, 250);
    }
  };

  const handleChangeNote = (event) => {
    setNote(event.target.value);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeDateRange = (event) => {
    setDateRange(event.target.value);
  };

  const handleRenderEdit = () => {
    setEdit(true);
  };

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

  useEffect(() => {
    onListenForUsers();
  }, []);

  const {
    activityType,
    note,
    amount,
    member,
    date,
    num_one_to_ones,
    attendance,
  } = selectedItem;
  const body = (
    <div style={modalStyle} className={classes.paper}>
      <h2 id="simple-modal-title">Activity Detail</h2>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            disabled={true}
            id="activity_type"
            label="Activity Type"
            helperText="You cannot change the Activity Type"
            fullWidth
            value={activityType}
          />
        </Grid>
        {(activityType === 'Business Received' ||
          activityType === 'Referral Given') && (
          <Grid item xs={12} md={6}>
            <TextField
              disabled={!edit}
              id="member"
              label="Member"
              helperText="Member involved in this activity"
              fullWidth
              value={member}
            />
          </Grid>
        )}

        {amount > 0 && (
          <Grid item xs={12} md={6}>
            <TextField
              disabled={!edit}
              id="notes"
              label="Notes"
              helperText="Amount of dollars closed"
              fullWidth
              value={note}
            />
          </Grid>
        )}
        {num_one_to_ones > 0 && (
          <Grid item xs={12} md={6}>
            <TextField
              disabled={!edit}
              id="num_one_to_ones"
              label="# of One to Ones"
              helperText="Number of One to Ones"
              fullWidth
              value={num_one_to_ones}
            />
          </Grid>
        )}
        {attendance && (
          <Grid item xs={12} md={6}>
            <TextField
              disabled={!edit}
              id="num_one_to_ones"
              label="# of One to Ones"
              helperText="Number of One to Ones"
              fullWidth
              value={num_one_to_ones}
            />
          </Grid>
        )}

        <Grid item xs={12} md={6}>
          <TextField
            disabled={!edit}
            id="date"
            label="Date"
            helperText="Date of Activity"
            fullWidth
            value={date}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          {edit ? (
            <Button
              variant="contained"
              onClick={() => setEdit(false)}
              style={{ backgroundColor: '#309a2f', color: 'white' }}
            >
              Save
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={() => setEdit(true)}
              color="primary"
            >
              Edit
            </Button>
          )}

          <Button
            disabled={!selectedItem.activityType}
            variant="contained"
            onClick={handleDelete}
            color="secondary"
          >
            Delete
          </Button>
        </Grid>
      </Grid>
    </div>
  );
  const calculateGroup = () => {
    setFilterModel({
      items: [{}],
    });
    if (activities.length > 0) {
      const group = activities.reduce((acc, item) => {
        if (!acc[item.userId]) {
          acc[item.userId] = [];
        }
        acc[item.userId].push(item);
        return acc;
      }, {});
      let bufferItem = {}
      const group2 = activities.reduce((acc, item) => {
        bufferItem = {}
        if (!acc[item.member_id] && item.member_id !== '') {
          
          acc[item.member_id] = [];
        }
        if (item.activityType === 'Business Received') {
          bufferItem.this_username = item.username
          bufferItem.username = item.this_username
          bufferItem.activityType = 'Business Given'
          bufferItem.business_received = 0
          bufferItem.business_given = item.amount
          bufferItem.userId = item.member_id
          bufferItem.attendance = 0
          bufferItem.num_guests = 0
          bufferItem.num_one_to_ones = 0
          bufferItem.referrals_given = 0
          bufferItem.events = 0
          acc[item.member_id].push(bufferItem);
        }
        return acc;
      }, {});
      let userGroup = [];
      let userData = {
        business_received: 0,
        business_given: 0,
        attendance: 0,
        num_one_to_ones: 0,
        referrals_given: 0,
        events: 0,
        date: '',
      };
      let amountInit = 0;
      let combo = {...group, ...group2}
      Object.keys(combo).forEach(function (key) {
        userData = {
          business_received: 0,
          business_given: 0,
          attendance: 0,
          num_one_to_ones: 0,
          referrals_given: 0,
          events: 0,
          date: '',
        };
        combo[key].forEach((a, idx) => {
          userData.date = a.date;
          userData.member = a.this_username;
          userData.uid = a.userId;
          userData.business_received += a.activityType === 'Business Received' ?  Number(a.amount) : 0;
          userData.business_given += a.activityType === 'Business Given' ?  Number(a.business_given) : 0;
          userData.attendance += a.attendance ? 1 : 0;
          userData.events +=
            a.activityType === 'Networking Event' ? 1 : 0;
          userData.num_one_to_ones += Number(a.num_one_to_ones);
          userData.referrals_given +=
            a.activityType === 'Referral Given' ? 1 : 0;
        });
        userGroup.push(userData);
      });
      setGroups(userGroup);
    }
  };

  const calculate = () => {
    if (activities.length > 0) {
      let totalAmountInit = 0;
      let totalAmountGivenInit = 0;
      [...given, ...activities].forEach((a) => {
        if (a.activityType === 'Business Received') {
          totalAmountInit += +a.amount;
        } else {
          totalAmountGivenInit += +a.amount;
        }
      });
      setTotalAmount(totalAmountInit);
      setTotalAmountGiven(totalAmountGivenInit);
      setTotalOneToOnes(
        activities.reduce((a, b) => +a + +b.num_one_to_ones, 0),
      );

      setTotalReferrals(
        activities.filter((a) => a.activityType === 'Referral Given')
          .length,
      );

      setTotalGuests(
        activities.reduce((a, b) => +a + +b.num_guests, 0),
      );

      setTotalAttendance(
        activities.reduce((a, b) => (+a + b.attendance ? 1 : 0), 0),
      );

      setTotalEvents(
        activities.filter(
          (a) => a.activityType === 'Networking Event',
        ).length,
      );
    }
    setFilterModel({
      items: [
        {
          columnField: 'date',
          id: 90144,
          operatorValue: 'onOrAfter',
          value: sevenDays,
        },
      ],
    });
  };

  useEffect(() => {
    onListenForGiven(selectedMember);
    onListenForActivity(selectedMember);
  }, [selectedMember]);

  useEffect(() => {
    setTimeout(() => {
      if (selectedMember === 'all_members_quarterly') {
        calculateGroup();
      } else {
        calculate();
      }
    }, 500);
  }, [activities]);

  return (
    <>
      <div
        style={{ height: 500, width: '100%', marginBottom: '12em' }}
      >
        <h1>Admin</h1>
        <p>Select a member to view each members activites.</p>

        <Grid item xs={12} md={6}>
          <InputLabel>Member</InputLabel>
          <Select
            value={selectedMember}
            onChange={handleChangeMember}
          >
            {users.map((data, index) => {
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
        {selectedMember !== 'all_members_quarterly' ? (
          <DataGrid
            loading={loading}
            onFilterModelChange={(props) => {
              let filtered = Array.from(
                props.visibleRows,
                ([name, value]) => ({ ...value }),
              );
              let bufferTotalAmount = 0;
              let bufferTotalAmountGiven = 0;
              let bufferTotalOneToOnes = 0;
              let bufferTotalReferrals = 0;
              let bufferTotalEvents = 0;
              let bufferTotalAttendance = 0;
              let bufferTotalGuests = 0;
              if (filtered) {
                filtered.forEach((a) => {
                  if (a.activityType === 'Business Received') {
                    bufferTotalAmount += Number(a.amount);
                  }
                  if (a.activityType === 'Referral Given') {
                    bufferTotalReferrals += 1;
                  }
                  if (a.activityType === 'Networking Event') {
                    bufferTotalEvents += 1;
                    bufferTotalGuests += Number(a.num_guests);
                  }
                  if (a.activityType === 'Attendance') {
                    bufferTotalAttendance += a.attendance ? 1 : 0;
                    bufferTotalGuests += Number(a.num_guests);
                  }
                  if (a.activityType === 'Business Given') {
                    bufferTotalAmountGiven += Number(a.amount);
                  }
                  if (a.activityType === 'One to One') {
                    bufferTotalOneToOnes += Number(a.num_one_to_ones);
                  }
                });
                setTotalAmount(bufferTotalAmount);
                setTotalAmountGiven(bufferTotalAmountGiven);
                setTotalOneToOnes(bufferTotalOneToOnes);
                setTotalReferrals(bufferTotalReferrals);
                setTotalEvents(bufferTotalEvents);
                setTotalAttendance(bufferTotalAttendance);
                setTotalGuests(bufferTotalGuests);
              } else {
              }
            }}
            // style={{ marginBottom: '1em' }}
            components={{
              Toolbar: GridToolbar,
            }}
            onRowSelected={(e) => setSelectedItem(e.data)}
            rows={[...given, ...activities]}
            columns={columns}
            pageSize={10}
            getRowId={(row) => row.uid}
            sortModel={sortModel}
            filterModel={filterModel}
          />
        ) : (
          <DataGrid
            loading={loading}
            // onFilterModelChange={(props) => {
            //   let filtered = Array.from(
            //     props.visibleRows,
            //     ([name, value]) => ({ ...value }),
            //   );
            //   let bufferTotalAmount = 0;
            //   let bufferTotalAmountGiven = 0;
            //   let bufferTotalOneToOnes = 0;
            //   let bufferTotalReferrals = 0;
            //   let bufferTotalEvents = 0;
            //   let bufferTotalAttendance = 0;
            //   let bufferTotalGuests = 0;
            //   if (filtered) {
            //     filtered.forEach((a) => {
            //       if (a.activityType === 'Business Received') {
            //         bufferTotalAmount += Number(a.amount);
            //       }
            //       if (a.activityType === 'Referral Given') {
            //         bufferTotalReferrals += 1;
            //       }
            //       if (a.activityType === 'Networking Event') {
            //         bufferTotalEvents += 1;
            //         bufferTotalGuests += Number(a.num_guests);
            //       }
            //       if (a.activityType === 'Attendance') {
            //         bufferTotalAttendance += a.attendance ? 1 : 0;
            //         bufferTotalGuests += Number(a.num_guests);
            //       }
            //       if (a.activityType === 'Business Given') {
            //         bufferTotalAmountGiven += Number(a.amount);
            //       }
            //       if (a.activityType === 'One to One') {
            //         bufferTotalOneToOnes += Number(a.num_one_to_ones);
            //       }
            //     });
            //     setTotalAmount(bufferTotalAmount);
            //     setTotalAmountGiven(bufferTotalAmountGiven);
            //     setTotalOneToOnes(bufferTotalOneToOnes);
            //     setTotalReferrals(bufferTotalReferrals);
            //     setTotalEvents(bufferTotalEvents);
            //     setTotalAttendance(bufferTotalAttendance);
            //     setTotalGuests(bufferTotalGuests);
            //   } else {
            //   }
            // }}
            // style={{ marginBottom: '1em' }}
            components={{
              Toolbar: GridToolbar,
            }}
            // onRowSelected={(e) => setSelectedItem(e.data)}
            rows={groups}
            columns={qbrColumns}
            pageSize={10}
            getRowId={(row) => row.uid}
            sortModel={sortModel}
            filterModel={filterModel}
          />
        )}
        {/* <Button
          disabled={!selectedItem.activityType}
          variant="contained"
          onClick={handleDelete}
          color="secondary"
        >
          Delete Selected
        </Button> */}

        <Button
          variant="contained"
          color="secondary"
          onClick={handleOpenDelete}
          disabled={!selectedItem.activityType}
        >
          Delete Selected
        </Button>
        <Dialog
          open={deleteOpen}
          onClose={handleCloseDelete}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {'Permanently Delete Activity?'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this Activity? This
              action is permanent.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDelete} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDelete} color="primary" autoFocus>
              Delete Permanently
            </Button>
          </DialogActions>
        </Dialog>

        {/* <Button
          disabled={!selectedItem.activityType}
          variant="contained"
          onClick={handleOpen}
          color="primary"
        >
          View/Edit Details
        </Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          {body}
        </Modal> */}
      </div>
      {selectedMember !== 'all_members_quarterly' &&
        selectedMember !== 'all_members' && (
          <TableContainer component={Paper}>
            {loading && <LinearProgress color="primary" />}
            <Table
              className={classes.table}
              aria-label="simple table"
            >
              <TableHead>
                <TableRow>
                  <TableCell>Total Business Received</TableCell>
                  <TableCell>Total Business Given</TableCell>
                  <TableCell>Total One to Ones</TableCell>
                  <TableCell>Total Referrals Given</TableCell>
                  <TableCell>Total Networking Events</TableCell>
                  <TableCell>Total Meetings Attended</TableCell>
                  <TableCell>Total Guests</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow key={'totalsRow'}>
                  <TableCell>
                    {currencyFormatter.format(Number(totalAmount))}
                  </TableCell>
                  <TableCell>
                    {currencyFormatter.format(
                      Number(totalAmountGiven),
                    )}
                  </TableCell>
                  <TableCell>{totalOneToOnes}</TableCell>
                  <TableCell>{totalReferrals}</TableCell>
                  <TableCell>{totalEvents}</TableCell>
                  <TableCell>{totalAttendance}</TableCell>
                  <TableCell>{totalGuests}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}
    </>
  );
};

export default withFirebase(ActivityTable);
