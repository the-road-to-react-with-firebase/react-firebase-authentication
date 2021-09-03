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

export default Body