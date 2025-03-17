 {/* ✅ Container for Search Bar & Register Button */}
    <Box 
        sx={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            marginBottom: "16px" 
        }}
    >
        {/* 🔍 Global Search */}
        <TextField
            placeholder="Search task category..."
            variant="outlined"
            sx={{
                maxWidth: "250px",
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

        {/* ➕ Register New Task Category Button (aligned to the right) */}
        <TaskCategoryRegisterForm refreshTaskCategory={refreshTaskCategory} />
    </Box>
