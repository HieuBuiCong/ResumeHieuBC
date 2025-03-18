// ✅ Table Columns
const columns = ["task_category_id", "question_name"];

const TaskQuestionTable = ({selectedTaskCategoryForQuestion}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({});
    const [anchorEl, setAnchorEl] = useState(null);
    const [filterColumn, setFilterColumn] = useState("");
    const [filterSearch, setFilterSearch] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [taskQuestionData, setTaskQuestionData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 💕🆕 NEW: Three-dot Menu States
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [selectedTaskQuestion, setSelectedTaskQuestion] = useState(null);

    // 🦤 NEW: Row Editing State
    const [editingRowId, setEditingRowId] = useState(null);
    const [editValues, setEditValues] = useState({});
    
    // 🤣😂 NEW: Delete confirmation Dialog Open
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    // Dealing with Error of deleting, edit, changepassword
    const [localError, setLocalError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // Load the task category data when mounted
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await getTaskQuestionData();
                const filteredData = data.filter(question => question.task_category_id === selectedTaskCategoryForQuestion.task_category_id);
                setTaskQuestionData(filteredData);
                console.log(filteredData); // Log the filtered data instead
            } catch (error) {
                setError(error.message || "Failed to load data");
                console.error(error); // Log the error for debugging
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedTaskCategoryForQuestion]);

    // refresh the task category
    const refreshTaskQuestion = async () => {
      try {
        setLoading(true);
        const data = await getTaskQuestionData();
        const filteredData = data.filter(question => question.task_category_id === selectedTaskCategoryForQuestion.task_category_id);
        console.log(filteredData);
        setTaskQuestionData(filteredData);
      } catch (err) {
        setError(err.message || "Failed to refresh taskQuestion");
      } finally {
        setLoading(false);
      }
    };

    // 🌑🌚🌚🌚🎯 dark mode
    const { darkMode } = useDarkMode();
    const theme = createTheme({
        palette: {
        mode: darkMode ? "dark" : "light",
        primary: { main: darkMode ? "#90caf9" : "#1976d2" },
        background: { default: darkMode ? "#121212" : "#f8f9fa" },
        backgroundColor : {default: darkMode ? "rgba(33, 31, 31, 0.7)" : "rgba(255,255,255,0.7)"},
        text: { primary: darkMode ? "#ffffff" : "#000000" },
        },
    });

    // ✅ Global Search
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // ✅ Open Filter Menu
    const handleOpenFilter = (event, column) => {
        setAnchorEl(event.currentTarget);
        setFilterColumn(column);
        setFilterSearch(""); // Reset dropdown search input
    };

    // ✅ Toggle Filter Selection
    const handleFilterChange = (value) => {
        const strValue = String(value); // ✅ Convert to string for consistency
        setFilters((prev) => ({
        ...prev,
        [filterColumn]: prev[filterColumn]?.includes(strValue)
            ? prev[filterColumn].filter((v) => v !== strValue)
            : [...(prev[filterColumn] || []), strValue],
        }));
    };

    // ✅ Clear Filters for a Column
    const clearFilter = () => {
        setFilters((prev) => {
        const updatedFilters = { ...prev };
        delete updatedFilters[filterColumn];
        return updatedFilters;
        });
        setAnchorEl(null);
    };

    // ✅ Handle Pagination
    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // 💕🆕 OPEN & CLOSE 3-DOT MENU
    const handleMenuOpen = (event, taskQuestion) => {
        setMenuAnchor(event.currentTarget);
        setSelectedTaskQuestion(taskQuestion);
    };
    const handleMenuClose = () => {
        setMenuAnchor(null);
        //setSelectedTaskQuestion(null);
    };

    // 🦤 NEW: Edit Row
    const handleEditClick = (taskQuestion) => {
        setEditingRowId(taskQuestion.task_category_question_id);
        setEditValues({ ...taskQuestion }); // Pre-fill textfields with row data
        console.log(editValues);
        handleMenuClose();
    }
    
    // 🦤🦤🦤🦤🦤🦤🦤🦤🦤🦤 NEW: Save Row (POST request placeholder)
    const handleSaveClick = async (taskQuestion) => {
        try {
        setLoading(true);
        await taskQuestionUpdate(selectedTaskQuestion.task_category_question_id, editValues );
        setSuccess(true);
        setSuccessMessage(`${selectedTaskQuestion.question_name} updated successfully`);
        
        } catch (err) {
        setLocalError(err.message || "Failed to update task category");
        } finally {
        setLoading(false);
        setDeleteDialogOpen(false);
        setSelectedTaskQuestion(null);
        setEditingRowId(null);
        refreshTaskQuestion();
        }
        console.log("Updated task category:", selectedTaskQuestion);
    }

    // 🦤🦤🦤🦤🦤🦤🦤🦤🦤🦤 NEW: Delete a row with dialog
    const handleDeleteClick = (taskQuestion) => {
        console.log("Deleting task category:", taskQuestion);
        setSelectedTaskQuestion(taskQuestion);
        setDeleteDialogOpen(true);
        handleMenuClose(); 
    }

    const handleConfirmDelete =  async(taskQuestion) => {
        try {
        setLoading(true);
        await taskQuestionDelete(selectedTaskQuestion.task_category_question_id);
        refreshTaskQuestion();
        setSuccess(true);
        setSuccessMessage(`${selectedTaskQuestion.question_name} deleted successfully`);
        } catch (err) {
        setLocalError(err.message || "Failed to delete task category");
        } finally {
        setLoading(false);
        setDeleteDialogOpen(false);
        setSelectedTaskQuestion(null);
        setEditingRowId(null);
        }
        console.log("Deleted task category:", selectedTaskQuestion);
    }

    function handleCancelDelete() {
        setDeleteDialogOpen(false);
        setSelectedTaskQuestion(null);
    }

    // ✅ APPLY FILTER & SEARCH
    const filteredTaskQuestion = taskQuestionData
        .filter((taskQuestion) =>
        Object.keys(filters).every((column) =>
            filters[column]?.length ? filters[column].includes(String(taskQuestion[column])) : true // ✅ Convert all values to strings
        )
        )
        .filter((taskQuestion) =>
        Object.values(taskQuestion)
            .map((v) => String(v).toLowerCase()) // ✅ Convert everything to string & lowercase before filtering
            .join(" ")
            .includes(searchQuery.toLowerCase())
        );
