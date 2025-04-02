import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import MainLayout from '../components/Layout/MainLayout.jsx';
import { Box, Typography, Paper, Grid, Card, CardContent } from '@mui/material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const pieData = [
  { name: 'America', value: 43.8 },
  { name: 'Asia', value: 31.3 },
  { name: 'Europe', value: 18.8 },
  { name: 'Africa', value: 6.3 },
];

const pieColors = ['#007bff', '#fbbc04', '#6f42c1', '#ea4335'];

const barData = [
  { name: 'Jan', TeamA: 40, TeamB: 50 },
  { name: 'Feb', TeamA: 30, TeamB: 70 },
  { name: 'Mar', TeamA: 20, TeamB: 45 },
  { name: 'Apr', TeamA: 35, TeamB: 65 },
  { name: 'May', TeamA: 65, TeamB: 40 },
  { name: 'Jun', TeamA: 65, TeamB: 35 },
  { name: 'Jul', TeamA: 40, TeamB: 30 },
  { name: 'Aug', TeamA: 25, TeamB: 70 },
  { name: 'Sep', TeamA: 55, TeamB: 25 },
];

const DashboardPage = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <MainLayout>
      <Box sx={{ padding: 4 }}>
        <Typography variant="h4" gutterBottom>
          Hi, Welcome back 👋
        </Typography>

        <Grid container spacing={3} mb={4}>
          {[
            { title: 'Weekly sales', value: '714k', growth: '+2.6%', color: '#e0f7fa' },
            { title: 'New users', value: '1.35m', growth: '-0.1%', color: '#f3e5f5' },
            { title: 'Purchase orders', value: '1.72m', growth: '+2.8%', color: '#fff8e1' },
            { title: 'Messages', value: '234', growth: '+3.6%', color: '#ffebee' },
          ].map((item, i) => (
            <Grid item xs={12} md={3} key={i}>
              <Paper elevation={3} sx={{ p: 2, bgcolor: item.color, borderRadius: 3 }}>
                <Typography variant="subtitle2" color="text.secondary">{item.title}</Typography>
                <Typography variant="h5">{item.value}</Typography>
                <Typography variant="caption" color="success.main">{item.growth}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>Current visits</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Website visits <Typography variant="caption">(+43%) than last year</Typography>
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="TeamA" fill="#003f8a" />
                    <Bar dataKey="TeamB" fill="#7fbfff" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box mt={6} display="flex" justifyContent="center">
          <Paper elevation={4} sx={{ p: 5, bgcolor: 'white', borderRadius: 3, textAlign: 'center', width: 400 }}>
            <Typography variant="h5" mb={2}>Welcome to the Dashboard</Typography>
            {isAuthenticated ? (
              <Typography color="success.main">You are logged in successfully! ✅</Typography>
            ) : (
              <Typography color="error.main">You are not authenticated ❌</Typography>
            )}
          </Paper>
        </Box>
      </Box>
    </MainLayout>
  );
};

export default DashboardPage;
