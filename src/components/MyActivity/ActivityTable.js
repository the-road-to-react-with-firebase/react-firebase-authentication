import React, { useState } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';

import { withFirebase } from '../Firebase';

const columns = [
  {
    field: 'activityType',
    description: 'This is the type of activity tracked',
    headerName: 'Activity Type',
    width: 160,
  },
  { field: 'amount', headerName: 'Amount', width: 140 },
  { field: 'note', headerName: 'Notes', width: 150 },
  {
    field: 'date',
    headerName: 'Date',
    type: 'date',
    width: 120,
  },
  // {
  //   field: 'fullName',
  //   headerName: 'Full name',
  //   description:
  //     'This column has a value getter and is not sortable.',
  //   sortable: false,
  //   width: 160,
  //   valueGetter: params =>
  //     `${params.getValue('firstName') || ''} ${params.getValue(
  //       'lastName',
  //     ) || ''}`,
  // },
];

const dateRanges = [7, 30, 60, 90, 180, 365]

const ActivityTable = ({ activities, firebase }) => {
  console.log(activities, 'table');
  const [selectedItem, setSelectedItem] = useState({});
  const [dateRange, setDateRange] = useState(30);

  const handleChangeDate = event => {
    setDateRange(event.target.value);
  };

  const handleSelected = () => {
    firebase.activity(selectedItem.uid).remove();
  };

  return (
    <div style={{ height: 350, width: '100%', marginBottom: '5em' }}>
      <InputLabel>
        Date Range
      </InputLabel>Last{'   '}
      <Select
        value={dateRange}
        onChange={handleChangeDate}
      >
        {dateRanges.map((value, index) => (
          <MenuItem key={index} value={value}>
            {value}
          </MenuItem>
        ))}
      </Select>{'   '}Days
      <DataGrid
        // style={{ marginBottom: '1em' }}
        onRowSelected={(e) => setSelectedItem(e.data)}
        rows={activities}
        columns={columns}
        pageSize={5}
        getRowId={(row) => row.uid}
      />

      <Button
        // style={{ marginTop: '1em' }}
        variant="contained"
        onClick={handleSelected}
        color="secondary"
      >
        Delete Selected
      </Button>
      <Button
        variant="contained"
        // onClick={handleSelected}
        color="primary"
      >
        View Details
      </Button>
    </div>
  );
};

export default withFirebase(ActivityTable);
