import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';

const columns = [
  { field: 'activityType', headerName: 'Activity Type', width: 70 },
  { field: 'amount', headerName: 'Amount', width: 130 },
  { field: 'note', headerName: 'Notes', width: 130 },
  {
    field: 'date',
    headerName: 'Date',
    type: 'date',
    width: 90,
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

// const rows = [
//   { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
//   { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
//   { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
//   { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
//   { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
//   { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
//   { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
//   { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
//   { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
// ];

const ActivityTable = ({activities}) => {
  return (
    <div style={{ height: 400, width: '100%' }}>
      {/* <DataGrid
        rows={activities}
        columns={columns}
        pageSize={5}
        checkboxSelection
      /> */}
    </div>
  );
};

export default ActivityTable;
