import React, { useContext } from 'react'; import { AuthContext } from '../context/AuthContext.jsx'; import MainLayout from '../components/Layout/MainLayout.jsx'; import { Box, Typography, Paper, Grid, Card, CardContent } from '@mui/material'; import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';

const monthlyStatusData = [ { month: 'Apr', Done: 178, OnGoing: 89, Total: 274 }, { month: 'May', Done: 188, OnGoing: 89, Total: 287 }, { month: 'Jun', Done: 209, OnGoing: 81, Total: 291 }, { month: 'Jul', Done: 193, OnGoing: 101, Total: 301 }, { month: 'Aug', Done: 232, OnGoing: 86, Total: 318 }, { month: 'Sep', Done: 242, OnGoing: 91, Total: 331 }, { month: 'Oct', Done: 253, OnGoing: 86, Total: 339 }, { month: 'Nov', Done: 296, OnGoing: 63, Total: 361 }, { month: 'Dec', Done: 302, OnGoing: 61, Total: 368 }, { month: 'Jan', Done: 332, OnGoing: 67, Total: 393 }, { month: 'Feb', Done: 344, OnGoing: 60, Total: 406 }, { month: 'March', Done: 358, OnGoing: 64, Total: 422 } ];

const ongoingTypeData = [ { type: 'Need OTS, need rework or disposal', ProductWaitingArrival: 4 }, { type: 'Need OTS, no need rework or disposal', ProductWaitingArrival: 23, Other: 3 }, { type: 'No need OTS, no need rework or disposal', ProductWaitingArrival: 28, Other: 6 } ];

const ongoingDeptData = [ { department: 'On-Going IQC', quantity: 5 }, { department: 'On-Going PE', quantity: 8 }, { department: 'On-Going QC', quantity: 4 }, { department: 'On-Going SCM', quantity: 47 } ];

const ongoingStatusData = [ { status: 'Pending less than 3 m...', ProductWaitingArrival: 30, Other: 5 }, { status: 'Pending over 3 months', ProductWaitingArrival: 7, Other: 1 }, { status: 'Pending over 6 months', ProductWaitingArrival: 18, Other: 3 } ];

const DashboardPage = () => { const { isAuthenticated } = useContext(AuthContext);

return ( <MainLayout> <Box sx={{ padding: 4 }}> <Typography variant="h5" gutterBottom> Interrupter CID Overview on March/2025 </Typography>

<Grid container spacing={3}>
      <Grid item xs={12}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="subtitle1">CID status per month</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Done" stackId="a" fill="#4CAF50">
                  <LabelList dataKey="Done" position="insideTop" />
                </Bar>
                <Bar dataKey="OnGoing" stackId="a" fill="#3F51B5">
                  <LabelList dataKey="OnGoing" position="insideTop" />
                </Bar>
                <Bar dataKey="Total" fill="#FFCC80" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="subtitle1">On-Going CID (by Type)</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={ongoingTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="ProductWaitingArrival" fill="#4CAF50" />
                <Bar dataKey="Other" fill="#303F9F" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="subtitle1">On-Going CID (by Status)</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={ongoingStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="ProductWaitingArrival" fill="#4CAF50" />
                <Bar dataKey="Other" fill="#303F9F" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="subtitle1">On-Going CID (by Department)</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={ongoingDeptData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantity" fill="#4CAF50" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </Box>
</MainLayout>

); };

export default DashboardPage;

