import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@material-ui/data-grid';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import {
  TablePagination,
  Grid,
  InputLabel,
  Typography,
  Divider,
} from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';

import { withFirebase } from '../Firebase';
import { componentFromStreamWithConfig } from 'recompose';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const columns = [
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
    field: 'num_one_on_ones',
    headerName: '# 1 on 1s',
    width: 150,
    // hide: true,
  },
  {
    field: 'num_guests',
    headerName: '# of Guests',
    width: 150,
    hide: true,
  },
  {
    field: 'member_id',
    headerName: 'Member ID',
    width: 150,
    hide: true,
  },
  { field: 'username', headerName: 'Member', width: 150 },
  {
    field: 'attendance',
    headerName: 'Attendance',
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
  firebase,
  onListenForActivity,
  authUser,
}) => {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [sortModel, setSortModel] = React.useState([
    {
      field: 'date',
      sort: 'desc',
    },
  ]);
  const [selectedItem, setSelectedItem] = useState({});
  const [dateRange, setDateRange] = useState(30);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalOneOnOnes, setTotalOneOnOnes] = useState(0);
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);

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

  const handleDelete = () => {
    firebase.activity(selectedItem.uid).remove();
    setOpen(false);
  };

  const handleRenderEdit = () => {
    setEdit(true);
  };
  
  const {
    activityType,
    note,
    amount,
    member,
    date,
    num_one_on_ones,
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
            // onChange={handleChangeNote}
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
              // onChange={handleChangeNote}
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
              // onChange={handleChangeNote}
              />
          </Grid>
        )}
        {num_one_on_ones > 0 && (
          <Grid item xs={12} md={6}>
            <TextField
              disabled={!edit}
              id="num_one_on_ones"
              label="# of One on Ones"
              helperText="Number of one on ones"
              fullWidth
              value={num_one_on_ones}
              // onChange={handleChangeNote}
              />
          </Grid>
        )}
        {attendance && (
          <Grid item xs={12} md={6}>
            <TextField
              disabled={!edit}
              id="num_one_on_ones"
              label="# of One on Ones"
              helperText="Number of one on ones"
              fullWidth
              value={num_one_on_ones}
              // onChange={handleChangeNote}
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
            // onChange={handleChangeNote}
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
  
    useEffect(() => {
      if (activities.length > 0) {
        setTotalAmount(activities.reduce((a, b) => +a + +b.amount, 0));
        setTotalOneOnOnes(
          activities.reduce((a, b) => +a + +b.num_one_on_ones, 0),
        );
        setTotalReferrals(
          activities.filter((a) => a.activityType === 'Referral Given')
            .length,
        );
        setTotalEvents(
          activities.filter(
            (a) => a.activityType === 'Networking Event',
          ).length,
        );
      }
    }, [activities]);

  useEffect(() => {
    onListenForActivity(authUser.uid);
  }, []);
  return (
    <>
      <div
        style={{ height: 500, width: '100%', marginBottom: '5em' }}
      >
        <DataGrid
          onFilterModelChange={(props) => {
            let filtered = Array.from(
              props.visibleRows,
              ([name, value]) => ({ ...value }),
            );
            
            let bufferTotalAmount = 0;
            let bufferTotalOneOnOnes = 0;
            let bufferTotalReferrals = 0;
            let bufferTotalEvents = 0;
            if (filtered) {
              filtered.forEach((a) => {
                bufferTotalAmount += Number(a.amount);
                bufferTotalOneOnOnes += Number(
                  a.num_one_on_ones,
                );
                if (a.activityType === 'Referral Given') {
                  bufferTotalReferrals += 1;
                }
                if (a.activityType === 'Networking Event') {
                  bufferTotalEvents += 1;
                }
              });
              setTotalAmount(bufferTotalAmount);
              setTotalOneOnOnes(bufferTotalOneOnOnes);
              setTotalReferrals(bufferTotalReferrals);
              setTotalEvents(bufferTotalEvents);
            }
          }}
          // style={{ marginBottom: '1em' }}
          components={{
            Toolbar: GridToolbar,
          }}
          onRowSelected={(e) => setSelectedItem(e.data)}
          rows={activities}
          columns={columns}
          pageSize={10}
          getRowId={(row) => row.uid}
          sortModel={sortModel}
        />
        <Button
          disabled={!selectedItem.activityType}
          variant="contained"
          onClick={handleDelete}
          color="secondary"
        >
          Delete Selected
        </Button>
        <Button
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
        </Modal>
      </div>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Total Business Received</TableCell>
              <TableCell>Total One on Ones</TableCell>
              <TableCell>Total Referrals Given</TableCell>
              <TableCell>Total Networking Events</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow key={'totalsRow'}>
              <TableCell component="th" scope="row">
                {currencyFormatter.format(Number(totalAmount))}
              </TableCell>
              <TableCell>{totalOneOnOnes}</TableCell>
              <TableCell>{totalReferrals}</TableCell>
              <TableCell>{totalEvents}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default withFirebase(ActivityTable);
