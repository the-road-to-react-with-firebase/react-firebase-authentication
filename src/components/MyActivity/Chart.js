import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
} from 'recharts';
import Title from './Title';

const filterActivities = (data, type) => {
  return data.filter(a => a.activityType === type).reverse();
};

const convertDate = data => {
  return data.forEach(a => {
    a.date = new Date(a.date).toLocaleDateString();
  });
};

export default function Chart({ activities }) {
  const theme = useTheme();
  convertDate(activities);
  
  const filteredActivities = filterActivities(
    activities,
    'Business Received',
  )

  return (
    <React.Fragment>
      <Title>Business Received</Title>
      <ResponsiveContainer>
        <LineChart
          data={filteredActivities}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis
            dataKey="date"
            stroke={theme.palette.text.secondary}
          />
          <YAxis stroke={theme.palette.text.secondary}>
            <Label
              angle={270}
              position="left"
              style={{
                textAnchor: 'middle',
                fill: theme.palette.text.primary,
              }}
            >
              Dollars Closed ($)
            </Label>
          </YAxis>
          <Line
            type="monotone"
            dataKey="amount"
            stroke={theme.palette.primary.main}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
