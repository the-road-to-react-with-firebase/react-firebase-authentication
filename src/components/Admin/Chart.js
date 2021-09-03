import React, { useState } from 'react';
import { useTheme } from '@material-ui/core/styles';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Title from './Title';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export default function Chart({ activities }) {
  // const [typeOne, setTypeOne] = useState({
  //   name: 'Business Given',
  //   key: 'business_given'
  // })
  // const [typeTwo, setTypeTwo] = useState({
  //   name: 'Business Received',
  //   key: 'business_given'
  // })

  return (
    <React.Fragment>
      <Title>Business Received & Business Given</Title>
      <ResponsiveContainer
        style={{ marginTop: '5em' }}
        width="100%"
        height="100%"
      >
        <BarChart
          width={700}
          height={300}
          data={activities}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="member" />
          <YAxis
            tickFormatter={(value) => currencyFormatter.format(value)}
            dataKey="business_received"
            dataKey="business_received"
          />
          <Tooltip />
          <Legend />
          <Bar
            formatter={(value) => currencyFormatter.format(value)}
            name="Business Given"
            dataKey="business_given"
            fill="#8884d8"
          />
          <Bar
            formatter={(value) => currencyFormatter.format(value)}
            name="Busines Received"
            dataKey="business_received"
            fill="#82ca9d"
          />
        </BarChart>
        {/* <button></button> */}
      </ResponsiveContainer>
    </React.Fragment>
  );
}
