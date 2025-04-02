import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import MainLayout from '../components/Layout/MainLayout.jsx';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';

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

const radarData = [
  { subject: 'Math', A: 120, B: 110, C: 95 },
  { subject: 'English', A: 98, B: 130, C: 85 },
  { subject: 'History', A: 86, B: 90, C: 100 },
  { subject: 'Physics', A: 99, B: 100, C: 110 },
  { subject: 'Geography', A: 85, B: 95, C: 80 },
  { subject: 'Chinese', A: 65, B: 70, C: 75 },
];

const horizontalData = [
  { name: 'Italy', A: 44, B: 53 },
  { name: 'Japan', A: 32, B: 55 },
  { name: 'China', A: 38, B: 41 },
  { name: 'Canada', A: 50, B: 64 },
  { name: 'France', A: 13, B: 27 },
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
                      nameKey="name"
                      label
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                      <LabelList dataKey="value" position="outside" />
                    </Pie>
                    <Tooltip />
                    <Legend />
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
                    <Bar dataKey="TeamA" fill="#003f8a">
                      <LabelList dataKey="TeamA" position="top" />
                    </Bar>
                    <Bar dataKey="TeamB" fill="#7fbfff">
                      <LabelList dataKey="TeamB" position="top" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Conversion rates <Typography variant="caption">(+43%) than last year</Typography>
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={horizontalData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="A" fill="#5a55ca">
                      <LabelList dataKey="A" position="right" />
                    </Bar>
                    <Bar dataKey="B" fill="#5bb0f6">
                      <LabelList dataKey="B" position="right" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>Current subject</Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis />
                    <Radar name="Series 1" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Radar name="Series 2" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                    <Radar name="Series 3" dataKey="C" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
                    <Legend />
                  </RadarChart>
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
