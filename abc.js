import React from "react";
import useTableLogic from "./useTableLogic.js";
import ReusableTable from "./ReusableTable.jsx";
import { getTaskQuestionData, taskQuestionDelete, taskQuestionUpdate } from "../../services/taskQuestionService";
import TaskCategoryRegisterForm from "../TaskCategoryAndQuestion/TaskCategoryRegisterForm.jsx";
import { useDarkMode } from "../../context/DarkModeContext";
import { createTheme } from "@mui/material";

const columns = ["task_category_question_id", "question_name"];

const TaskQuestionTableS = ({selectedTaskCategoryForQuestion, setSelectedTaskCategoryForQuestion}) => {

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
    fetchDataFn: getTaskQuestionData,
    identifierKey: "task_category_question_id",
    deleteFn: taskQuestionDelete,
    updateFn: taskQuestionUpdate,
    itemLabelKey: "question_name",
    filterCondition: (item) => selectedTaskCategoryForQuestion.task_category_id === item.task_category_id,
  });

  return (
    <ReusableTable
        logic={logic}
        columns={columns}
        identifierKey="task_category_question_id"
        selectedItemByOtherTableFiltering={selectedTaskCategoryForQuestion} 
        setSelectedItemByOtherTableFiltering={setSelectedTaskCategoryForQuestion}
        identifierKeyOfFilteringTable="task_category_id"
        title="Question"
        RegisterFormComponent={TaskCategoryRegisterForm}
        theme={theme}
    />
  );
};

export default TaskQuestionTableS;
