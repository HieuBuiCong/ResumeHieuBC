  return (
    <ThemeProvider theme={theme}>
        {loading ? (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
                <CircularProgress />
            </div>
        ) : error ? (
            <p className="display-4 text-danger fw-bold" style={{fontSize: "30px"}}>😒😒{error}😒😒</p>
        ) : (
            <>
                <Paper
                    sx={{
                    width: "1200px",
                    overflow: "hidden",
                    p: 2,
                    borderRadius: "12px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                    backgroundColor: theme.palette.backgroundColor.default,
                    backdropFilter: "blur(10px)",
                    }}
                >

                    {/* 🔍 Global Search */}
                    <TextField
                        placeholder="Search task category..."
                        variant="outlined"
                        fullWidth
                        sx={{
                            maxWidth: "250px",
                            maxHeight: "100px",
                            borderRadius: "8px",
                            backgroundColor: theme.palette.backgroundColor.default,
                            boxShadow: "0 1px 5px rgba(0,0,0,0.1)",
                            "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                            "& fieldset": { borderColor: "#ddd" },
                            "&:hover fieldset": { borderColor: "#bbb" },
                            "&.Mui-focused fieldset": { borderColor: "#1976d2" }
                            }
                        }}
                        value={searchQuery}
                        onChange={handleSearchChange}
                        InputProps={{
                            startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: "#999" }} />
                            </InputAdornment>
                            ),
                        }}
                    />

                    <TaskCategoryRegisterForm refreshTaskCategory={refreshTaskCategory} />

                    {/*✅ Add this button to table component (above TableContainer)*/}
                    <SaveAltIcon
                        variant="contained"
                        color="primary"
                        onClick={handleExportCSV}
                        sx={{
                            ml: "52rem",
                            mt: 3,
                            width: "60px",
                            '&:hover': {
                            backgroundColor: 'rgba(68, 57, 168, 0.1)', // Change background color on hover
                            transform: 'scale(1.1)', // Slightly increase size on hover
                            }
                        }}
                    >
                    </SaveAltIcon>
