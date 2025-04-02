import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import MainLayout from '../components/Layout/MainLayout.jsx';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList
} from 'recharts';

const monthlyStatusData = [
  { month: 'Apr', Done: 178, OnGoing: 89, Total: 274 },
  { month: 'May', Done: 188, OnGoing: 89, Total: 287 },
  { month: 'Jun', Done: 209, OnGoing: 81, Total: 291 },
  { month: 'Jul', Done: 193, OnGoing: 101, Total: 301 },
  { month: 'Aug', Done: 232, OnGoing: 86, Total: 318 },
  { month: 'Sep', Done: 242, OnGoing: 91, Total: 331 },
  { month: 'Oct', Done: 253, OnGoing: 86, Total: 339 },
  { month: 'Nov', Done: 296, OnGoing: 63, Total: 361 },
  { month: 'Dec', Done: 302, OnGoing: 61, Total: 368 },
  { month: 'Jan', Done: 332, OnGoing: 67, Total: 393 },
  { month: 'Feb', Done: 344, OnGoing: 60, Total: 406 },
  { month: 'Mar', Done: 358, OnGoing: 64, Total: 422 }
];

const ongoingTypeData = [
  { type: 'Need OTS, need rework or disposal', ProductWaitingArrival: 4 },
  { type: 'Need OTS, no need rework or disposal', ProductWaitingArrival: 23, Other: 3 },
  { type: 'No need OTS, no need rework or disposal', ProductWaitingArrival: 28, Other: 6 }
];

const ongoingDeptData = [
  { department: 'On-Going IQC', quantity: 5 },
  { department: 'On-Going PE', quantity: 8 },
  { department: 'On-Going QC', quantity: 4 },
  { department: 'On-Going SCM', quantity: 47 }
];

const ongoingStatusData = [
  { status: 'Pending less than 3 m...', ProductWaitingArrival: 30, Other: 5 },
  { status: 'Pending over 3 months', ProductWaitingArrival: 7, Other: 1 },
  { status: 'Pending over 6 months', ProductWaitingArrival: 18, Other: 3 }
];

const chartCardStyle = {
  borderRadius: 3,
  boxShadow: 3,
  p: 2,
  backgroundColor: '#fafafa'
};

const titleStyle = {
  fontSize: '1.05rem',
  fontWeight: 600,
  color: '#333'
};

const labelTextStyle = {
  fill: '#212121',
  fontSize: 12,
  fontWeight: 500
};

const DashboardPage = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <MainLayout>
      <Box sx={{ padding: 4, marginTop: '50px' }}>
        <Typography variant="h5" gutterBottom fontWeight={700} color="primary.dark">
          🎯 Interrupter CID Overview ✅
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={chartCardStyle}>
              <CardContent>
                <Typography sx={titleStyle}>CID status per month</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyStatusData} barCategoryGap={10}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="month" stroke="#555" />
                    <YAxis stroke="#555" />
                    <Tooltip cursor={{ fill: '#f5f5f5' }} />
                    <Legend iconType="circle" />
                    <Bar dataKey="Done" stackId="a" fill="#4CAF50" radius={[6, 6, 0, 0]}>
                      <LabelList dataKey="Done" position="top" style={labelTextStyle} />
                    </Bar>
                    <Bar dataKey="OnGoing" stackId="a" fill="#3F51B5" radius={[6, 6, 0, 0]}>
                      <LabelList dataKey="OnGoing" position="top" style={labelTextStyle} />
                    </Bar>
                    <Bar dataKey="Total" fill="#FFCC80" radius={[6, 6, 0, 0]}>
                      <LabelList dataKey="Total" position="top" style={labelTextStyle} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={chartCardStyle}>
              <CardContent>
                <Typography sx={titleStyle}>On-Going CID (by Type)</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={ongoingTypeData} barGap={10}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="type" tick={{ fontSize: 11 }} stroke="#555" />
                    <YAxis stroke="#555" />
                    <Tooltip cursor={{ fill: '#f5f5f5' }} />
                    <Legend iconType="circle" />
                    <Bar dataKey="ProductWaitingArrival" fill="#4CAF50" radius={[6, 6, 0, 0]}>
                      <LabelList dataKey="ProductWaitingArrival" position="top" style={labelTextStyle} />
                    </Bar>
                    <Bar dataKey="Other" fill="#303F9F" radius={[6, 6, 0, 0]}>
                      <LabelList dataKey="Other" position="top" style={labelTextStyle} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={chartCardStyle}>
              <CardContent>
                <Typography sx={titleStyle}>On-Going CID (by Status)</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={ongoingStatusData} barGap={10}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="status" tick={{ fontSize: 12 }} stroke="#555" />
                    <YAxis stroke="#555" />
                    <Tooltip cursor={{ fill: '#f5f5f5' }} />
                    <Legend iconType="circle" />
                    <Bar dataKey="ProductWaitingArrival" fill="#4CAF50" radius={[6, 6, 0, 0]}>
                      <LabelList dataKey="ProductWaitingArrival" position="top" style={labelTextStyle} />
                    </Bar>
                    <Bar dataKey="Other" fill="#303F9F" radius={[6, 6, 0, 0]}>
                      <LabelList dataKey="Other" position="top" style={labelTextStyle} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={chartCardStyle}>
              <CardContent>
                <Typography sx={titleStyle}>On-Going CID (by Department)</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={ongoingDeptData} barGap={10}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="department" tick={{ fontSize: 12 }} stroke="#555" />
                    <YAxis stroke="#555" />
                    <Tooltip cursor={{ fill: '#f5f5f5' }} />
                    <Bar dataKey="quantity" fill="#4CAF50" radius={[6, 6, 0, 0]}>
                      <LabelList dataKey="quantity" position="top" style={labelTextStyle} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </MainLayout>
  );
};

export default DashboardPage;
