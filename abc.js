return (
    <MainLayout>
      <Box sx={{ padding: 4, marginTop: "50px" }}>
        <Typography variant="h5" gutterBottom>
          🎯 Interrupter CID Overview ✅
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
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
                <ResponsiveContainer width="100%" height={300}>
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
                <ResponsiveContainer width="100%" height={300}>
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

          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="subtitle1">On-Going CID (by Department)</Typography>
                <ResponsiveContainer width="100%" height={300}>
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
  );
