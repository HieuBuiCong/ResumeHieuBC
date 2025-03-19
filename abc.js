import React from "react";
import useTableLogic from "../../hooks/useTableLogic";
import ReusableTable from "../common/ReusableTable";
import { getTaskCategoryData, taskCategoryDelete, taskCategoryUpdate } from "../../services/taskCategoryService";
import TaskCategoryRegisterForm from "./TaskCategoryRegisterForm";
import { useDarkMode } from "../../context/DarkModeContext";
import { createTheme } from "@mui/material";

const columns = ["task_category_id", "task_name"];

const TaskCategoryTable = () => {
  const { darkMode } = useDarkMode();
  const theme = createTheme({ palette: { mode: darkMode ? "dark" : "light" } });

  const logic = useTableLogic({
    fetchDataFn: getTaskCategoryData,
    identifierKey: "task_category_id",
    deleteFn: taskCategoryDelete,
    updateFn: taskCategoryUpdate,
    itemLabelKey: "task_name",
  });

  return (
    <ReusableTable
      logic={logic}
      columns={columns}
      identifierKey="task_category_id"
      title="Task Categories"
      RegisterFormComponent={TaskCategoryRegisterForm}
      theme={theme}
    />
  );
};

export default TaskCategoryTable;