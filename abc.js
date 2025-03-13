{loading ? (
  <div style={{ textAlign: "center", marginTop: "20px" }}>
    <CircularProgress />
  </div>
) : error ? (
  <p style={{ textAlign: "center", color: "red" }}>😔😔 {error} 😔😔</p>
) : (
  <>
    {/* 🔹 Global Search */}
    <TextField
      placeholder="Search user..."
      variant="outlined"
      fullWidth
      sx={{
        maxWidth: "250px",
        ...
      }}
    />
  </>
)}