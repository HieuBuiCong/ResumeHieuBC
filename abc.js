import { useState, useEffect } from "react";

/**
 * Custom Hook: useTableLogic
 * 
 * Handles:
 * - Fetching and refreshing data
 * - Search and filtering
 * - Pagination
 * - Error handling and notifications
 * - Row selection & editing
 * 
 * @param {Function} fetchDataFunction - Function to fetch data from API
 * @param {string} filterKey - The key used for filtering data (Default: "task_category_id")
 */
const useTableLogic = (fetchDataFunction, filterKey = "task_category_id") => {
    // 🔹 Data & Loading States
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 🔹 Search & Filter States
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({});

    // 🔹 Pagination States
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // 🔹 Row Selection & Editing States
    const [selectedRow, setSelectedRow] = useState(null);
    const [editingRowId, setEditingRowId] = useState(null);
    const [editValues, setEditValues] = useState({});

    // 🔹 Snackbar Notifications
    const [localError, setLocalError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // ✅ Fetch & Refresh Data
    useEffect(() => {
        refreshData();
    }, []);

    const refreshData = async () => {
        try {
            setLoading(true);
            const result = await fetchDataFunction();
            setData(result);
            setFilteredData(result);
        } catch (err) {
            setError(err.message || "Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Apply Search & Filters
    useEffect(() => {
        let updatedData = [...data];

        // Apply Search Filter
        if (searchQuery) {
            updatedData = updatedData.filter(item =>
                Object.values(item).some(value =>
                    String(value).toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        }

        // Apply Column Filters
        Object.keys(filters).forEach(key => {
            if (filters[key]?.length) {
                updatedData = updatedData.filter(item =>
                    filters[key].includes(String(item[key]))
                );
            }
        });

        setFilteredData(updatedData);
    }, [searchQuery, filters, data]);

    // ✅ Handle Search Change
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    // ✅ Handle Filter Change
    const handleFilterChange = (column, value) => {
        setFilters(prev => ({
            ...prev,
            [column]: prev[column]?.includes(value)
                ? prev[column].filter(v => v !== value)
                : [...(prev[column] || []), value]
        }));
    };

    // ✅ Clear Filters
    const clearFilters = () => {
        setFilters({});
    };

    // ✅ Handle Pagination Change
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // ✅ Select a Row
    const handleRowSelect = (row) => {
        setSelectedRow(row);
    };

    // ✅ Edit a Row
    const handleEditClick = (row) => {
        setEditingRowId(row.id);
        setEditValues({ ...row });
    };

    // ✅ Save Edited Row
    const handleSaveClick = async (updateFunction) => {
        try {
            setLoading(true);
            await updateFunction(editingRowId, editValues);
            setSuccess(true);
            setSuccessMessage("Successfully updated!");
            refreshData();
        } catch (err) {
            setLocalError(err.message || "Failed to update.");
        } finally {
            setLoading(false);
            setEditingRowId(null);
        }
    };

    // ✅ Delete a Row
    const handleDeleteClick = async (deleteFunction, rowId) => {
        try {
            setLoading(true);
            await deleteFunction(rowId);
            setSuccess(true);
            setSuccessMessage("Successfully deleted!");
            refreshData();
        } catch (err) {
            setLocalError(err.message || "Failed to delete.");
        } finally {
            setLoading(false);
        }
    };

    return {
        data: filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        setData,
        loading,
        error,
        page,
        setPage,
        rowsPerPage,
        setRowsPerPage,
        searchQuery,
        setSearchQuery,
        handleSearchChange,
        filters,
        handleFilterChange,
        clearFilters,
        refreshData,
        selectedRow,
        handleRowSelect,
        editingRowId,
        editValues,
        handleEditClick,
        handleSaveClick,
        handleDeleteClick,
        localError,
        setLocalError,
        success,
        setSuccess,
        successMessage,
    };
};

export default useTableLogic;
