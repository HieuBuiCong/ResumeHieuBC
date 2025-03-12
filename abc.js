{columns.map((column) => (
  <TableCell key={column} sx={{ fontSize: "0.9rem", maxWidth: "150px", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
    {editingRowId === user.id ? (
      column === "role" ? (
        <Select
          value={editValues[column] || ""}
          onChange={(e) =>
            setEditValues((prev) => ({ ...prev, [column]: e.target.value }))
          }
          fullWidth
          variant="outlined"
          size="small"
        >
          {roleData.map((role) => (
            <MenuItem key={role.role_id} value={role.role_name}>
              {role.role_name}
            </MenuItem>
          ))}
        </Select>
      ) : column === "department" ? (
        <Select
          value={editValues[column] || ""}
          onChange={(e) =>
            setEditValues((prev) => ({ ...prev, [column]: e.target.value }))
          }
          fullWidth
          variant="outlined"
          size="small"
        >
          {departmentData.map((dept) => (
            <MenuItem key={dept.department_id} value={dept.department_name}>
              {dept.department_name}
            </MenuItem>
          ))}
        </Select>
      ) : (
        <TextField
          variant="outlined"
          size="small"
          value={editValues[column] || ""}
          onChange={(e) =>
            setEditValues((prev) => ({ ...prev, [column]: e.target.value }))
          }
        />
      )
    ) : (
      <Tooltip title={user[column]} arrow>
        <span>{user[column]}</span>
      </Tooltip>
    )}
  </TableCell>
))}