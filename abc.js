<TableRow
                                        key={dataItem[identifierKey]}
                                        hover
                                        sx={{
                                        height: "30px",
                                        cursor: "pointer",
                                        transition: "background 0.2s ease-in-out",
                                        "&:hover": { backgroundColor: "#f5f5f5" },
                                        backgroundColor: selectedItemByOtherTableFiltering?.[identifierKeyOfFilteringTable] === dataItem[identifierKeyOfFilteringTable] && identifierKey === identifierKeyOfFilteringTable ? "#89A0B6" : "inherit",
                                        }}
                                        onClick= {setSelectedItemByOtherTableFiltering ? () => setSelectedItemByOtherTableFiltering(dataItem) : null} //🆕 Select category on row click
                                    >
                                        {columns.map((column) => (
                                            <TableCell
                                            key={column}
                                            sx={{
                                              fontSize: "0.75rem",
                                              padding: "8px 12px",
                                              whiteSpace:
                                                editingRowId === dataItem[identifierKey]
                                                  ? "normal" // Allows multiline editing clearly
                                                  : column.toLowerCase().includes("date") || column === "deadline"
                                                  ? "nowrap"
                                                  : "nowrap",
                                              wordBreak: "break-word",
                                              overflow: editingRowId === dataItem[identifierKey] ? "visible" : "hidden",
                                              textOverflow: editingRowId === dataItem[identifierKey] ? "clip" : "ellipsis",
                                              maxWidth: editingRowId === dataItem[identifierKey] ? "none" : "300px",
                                              verticalAlign: "top",
                                            }}
                                          >
                                            {editingRowId === dataItem[identifierKey] ? (
                                                // EDIT MODE
                                                column.toLowerCase().includes("date") ||column.toLowerCase().includes("deadline") ? (
                                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                    <DatePicker
                                                    sx={{
                                                        "& .MuiInputBase-input": { fontSize: "0.8rem" },
                                                        "& .MuiAutocomplete-input": { fontSize: "0.8rem" },
                                                        "& .MuiOutlinedInput-input": { fontSize: "0.8rem" },
                                                        "& .MuiSelect-select": { fontSize: "0.8rem" },
                                                      }}
                                                    value={editValues[column] ? new Date(editValues[column]) : null}
                                                    onChange={(newValue) => {
                                                        setEditValues((prev) => ({
                                                        ...prev,
                                                        [column]: newValue?.toISOString().split('T')[0] || ""
                                                        }));
                                                    }}
                                                    renderInput={(params) => <TextField size="small" {...params} />}
                                                    />
                                                </LocalizationProvider>
                                                ) : column.toLowerCase() === "status" ? (
                                                <Select
                                                    sx={{
                                                        "& .MuiInputBase-input": { fontSize: "0.8rem" },
                                                        "& .MuiAutocomplete-input": { fontSize: "0.8rem" },
                                                        "& .MuiOutlinedInput-input": { fontSize: "0.8rem" },
                                                        "& .MuiSelect-select": { fontSize: "0.8rem" },
                                                    }}
                                                    size="medium"
                                                    value={editValues[column] || ""}
                                                    onChange={(e) =>
                                                    setEditValues((prev) => ({
                                                        ...prev,
                                                        [column]: e.target.value
                                                    }))
                                                    }
                                                >
                                                    {["in-progress", "overdue", "complete", "submitted", "pending", "cancel"].map((status) => (
                                                    <MenuItem key={status} value={status} sx={{
                                                        "& .MuiInputBase-input": { fontSize: "0.8rem" },
                                                        "& .MuiAutocomplete-input": { fontSize: "0.8rem" },
                                                        "& .MuiOutlinedInput-input": { fontSize: "0.8rem" },
                                                        "& .MuiSelect-select": { fontSize: "0.8rem" },
                                                      }}
                                                    >
                                                        {status}
                                                    </MenuItem>
                                                    ))}
                                                </Select>
                                                ) : typeof dataItem[column] === "boolean" ? (
                                                    <Select
                                                        sx={{
                                                            "& .MuiInputBase-input": { fontSize: "0.8rem" },
                                                            "& .MuiAutocomplete-input": { fontSize: "0.8rem" },
                                                            "& .MuiOutlinedInput-input": { fontSize: "0.8rem" },
                                                            "& .MuiSelect-select": { fontSize: "0.8rem" },
                                                        }}
                                                        size="small"
                                                        value={editValues[column] || ""}
                                                        onChange={(e) =>
                                                        setEditValues((prev) => ({
                                                            ...prev,
                                                            [column]: e.target.value
                                                        }))
                                                        }
                                                    >
                                                        {["true", "false"].map((status) => (
                                                        <MenuItem key={status} value={status}>
                                                            {status}
                                                        </MenuItem>
                                                        ))}
                                                    </Select>
                                                ) : column === "part_number" && productData ? (
                                                    <Autocomplete
                                                        options={productData}
                                                        getOptionLabel={(opt) => `${opt.part_number} - ${opt.part_name}`}
                                                        size="small"
                                                        disablePortal={false} // this allows overflow outside table cell
                                                        PopperProps={{
                                                            sx: {
                                                              minWidth: "300px !important", // or your preferred width
                                                            },
                                                        }}
                                                        onChange={(_, value) => setEditValues((prev) => ({ ...prev, [column]: value?.part_number }))}
                                                        renderInput={(params) => (
                                                            <TextField {...params}                                                     sx={{
                                                                "& .MuiInputBase-input": { fontSize: "0.8rem" },
                                                                "& .MuiAutocomplete-input": { fontSize: "0.8rem" },
                                                                "& .MuiOutlinedInput-input": { fontSize: "0.8rem" },
                                                                "& .MuiSelect-select": { fontSize: "0.8rem" },
                                                            }} 
                                                            />
                                                        )}
                                                    />
                                                )
                                                : (
                                                <TextField
                                                    variant="outlined"
                                                    size="small"
                                                    value={editValues[column] || ""}
                                                    onChange={(e) =>
                                                    setEditValues((prev) => ({
                                                        ...prev,
                                                        [column]: e.target.value
                                                    }))
                                                    }
                                                />
                                                )
                                            ) : (
                                                // VIEW MODE
                                                <Tooltip
                                                title={
                                                    // this is to show product information of CID Table
                                                    column === "part_number" && productData
                                                    ? (
                                                        <div style={{ fontSize: "0.9rem", lineHeight: "1.5" }}>
                                                        {(() => {
                                                            const product = productData.find(p => p.part_number === dataItem[column]);
                                                            return product ? (
                                                            <>
                                                                <div><strong>Product ID:</strong> {product.product_id}</div>
                                                                <div><strong>Model:</strong> {product.model}</div>
                                                                <div><strong>Part Number:</strong> {product.part_number}</div>
                                                                <div><strong>Part Name:</strong> {product.part_name}</div>
                                                                <div><strong>Owner:</strong> {product.owner}</div>
                                                            </>
                                                            ) : (
                                                            "No product info available"
                                                            );
                                                        })()}
                                                        </div>
                                                    )
                                                    : (dataItem[column]?.toString() || "")
                                                }
                                                arrow
                                                placement="top"
                                                componentsProps={{
                                                    tooltip: {
                                                    sx: {
                                                        fontSize: "0.8rem",
                                                        padding: "12px",
                                                        backgroundColor: "#333",
                                                        color: "#fff",
                                                        borderRadius: "6px",
                                                        whiteSpace: "normal",
                                                    },
                                                    },
                                                }}
                                                >
                                                <span>
                                                    {typeof dataItem[column] === "boolean" ? (
                                                    dataItem[column] ? (
                                                        <CheckIcon sx={{ color: "green" }} />
                                                    ) : (
                                                        <ClearIcon sx={{ color: "red" }} />
                                                    )
                                                    ) : column.toLowerCase().includes("date") || column === "deadline" ? (
                                                    dataItem[column] ?format(new Date(dataItem[column]), "dd-MMM-yy") : ""
                                                    ) : column.toLowerCase() === "status" ? (
                                                    <span
                                                        style={{
                                                        padding: "2px 8px",
                                                        borderRadius: "12px",
                                                        backgroundColor:
                                                            statusColors[dataItem[column]?.toLowerCase()] || "#ddd",
                                                        color: "#fff",
                                                        fontWeight: 500,
                                                        fontSize: "0.65rem",
                                                        textTransform: "capitalize",
                                                        }}
                                                    >
                                                        {dataItem[column]}
                                                    </span>
                                                    ) : (
                                                    dataItem[column]
                                                    )}
                                                </span>
                                                </Tooltip>
                                            )}
                                        </TableCell>
                                        ))}
                                        {/* ACTIONS: If editing => show Save button, else show 3-dot */}
                                        <TableCell align="right">
                                        {editingRowId === dataItem[identifierKey] ? (
                                            <Box sx= {{display: 'flex', gap: 1}}>
                                            <Button variant="contained" onClick={() => handleSaveClick(dataItem[identifierKey])}>
                                                Save
                                            </Button>
                                            <Button variant="contained" color="error" onClick={() => setEditingRowId(null)}>
                                                Cancel
                                            </Button>
                                            </Box>
                                        ) : (
                                            <IconButton onClick={(e) => handleMenuOpen(e, dataItem)}>
                                            <MoreVertIcon />
                                            </IconButton>
                                        )}
                                        </TableCell>
                                    </TableRow>
