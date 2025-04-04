import React from "react";
import useTableLogic from "./useTableLogic.js";
import ReusableTable from "./ReusableTable.jsx";
import { getCIDData, cidDelete, cidUpdate } from "../../services/cidService.js";
import CIDRegisterForm from "./CIDRegisterForm.jsx";
import { useDarkMode } from "../../context/DarkModeContext";
import { createTheme } from "@mui/material";

const columns = ["cid_id", "part_number", "next_rev", "supplier_id", "rework_or_not", "ots_or_not", "status", "deadline", "change_notice", "created_date", "closing_date", "note"];

const CIDTable = ({selectedTaskCategoryForQuestion, setSelectedTaskCategoryForQuestion}) => {

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

  const logic = useTableLogic({
    fetchDataFn: getCIDData,
    identifierKey: "cid_id",
    deleteFn: cidDelete,
    updateFn: cidUpdate,
    itemLabelKey: "cid_id",
  });

  return (
    <ReusableTable
        logic={logic}
        columns={columns}
        identifierKey="cid_id"
        selectedItemByOtherTableFiltering={selectedTaskCategoryForQuestion} 
        setSelectedItemByOtherTableFiltering={setSelectedTaskCategoryForQuestion}
        identifierKeyOfFilteringTable="cid_id"
        title="CID List"
        RegisterFormComponent={CIDRegisterForm}
        theme={theme}
    />
  );
};

export default CIDTable;
