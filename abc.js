import { useState, useEffect } from "react";

const useTableLogic = ({ fetchDataFunction, columns, selectionHandler }) => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await fetchDataFunction();
        setData(result);
      } catch (err) {
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const refreshData = async () => {
    try {
      setLoading(true);
      const result = await fetchDataFunction();
      setData(result);
    } catch (err) {
      setError(err.message || "Failed to refresh data");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditClick = (row) => {
    setEditingRowId(row[columns[0]]);
    setEditValues({ ...row });
  };

  const handleSelectRow = (row) => {
    setSelectedRow(row);
    selectionHandler(row);
  };

  const filteredData = data
    .filter((row) =>
      Object.values(row)
        .map((v) => String(v).toLowerCase())
        .join(" ")
        .includes(searchQuery.toLowerCase())
    );

  return {
    data: filteredData,
    searchQuery,
    setSearchQuery,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    loading,
    error,
    refreshData,
    handleSearchChange,
    handleEditClick,
    editingRowId,
    editValues,
    setEditValues,
    selectedRow,
    handleSelectRow,
  };
};
