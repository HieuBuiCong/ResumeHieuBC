import React, { useEffect, useState } from "react";
import useTableLogic from "./useTableLogic.js";
import ReusableTable from "./ReusableTable.jsx";
import { getTaskData, taskDelete, taskUpdate } from "../../services/taskService.js";
import { getUserData } from "../../services/userService";
import { getTaskCategoryData } from "../../services/taskCategoryService.js";
import TaskRegisterForm from "./TaskRegisterForm.jsx";
import { useDarkMode } from "../../context/DarkModeContext";
import { useAuth } from "../../context/AuthContext";
import { createTheme } from "@mui/material";

const columns = [
  "cid_task_id",
  "task_name",
  "assignee_name",
  "status",
  "deadline",
  "created_date",
  "submitted_date",
  "approver_name",
  "approval_date",
  "dependency_cid_id",
  "dependency_date"
];

const MyTaskTable = () => {
  const { darkMode } = useDarkMode();
  const { user } = useAuth();

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          primary: { main: darkMode ? "#90caf9" : "#1976d2" },
          background: { default: darkMode ? "#121212" : "#f8f9fa" },
          backgroundColor: { default: darkMode ? "rgba(33, 31, 31, 0.7)" : "rgba(255,255,255,0.7)" },
          text: { primary: darkMode ? "#ffffff" : "#000000" },
        },
      }),
    [darkMode]
  );

  // 🌟 fetch user and taskCategory data
  const [userData, setUserData] = useState([]);
  const [taskCategoryData, setTaskCategoryData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await getUserData();
        setUserData(users);
        const taskCategories = await getTaskCategoryData();
        setTaskCategoryData(taskCategories);
      } catch (err) {
        console.error("Error fetching lookup data", err);
      }
    };
    fetchData();
  }, []);

  // Filter only current user's tasks
  const filterCondition = (task) => task.assignee_id === user.id;

  const logic = useTableLogic({
    fetchDataFn: getTaskData,
    identifierKey: "cid_task_id",
    deleteFn: taskDelete,
    updateFn: taskUpdate,
    itemLabelKey: "task_name",
    filterCondition,
  });

  return (
    <ReusableTable
      logic={logic}
      columns={columns}
      identifierKey="cid_task_id"
      selectedItemByOtherTableFiltering={null}
      setSelectedItemByOtherTableFiltering={null}
      identifierKeyOfFilteringTable={null}
      title="My Tasks"
      RegisterFormComponent={TaskRegisterForm}
      theme={theme}
      userData={userData}
      taskCategoryData={taskCategoryData}
      isTaskTable={true}
    />
  );
};

export default MyTaskTable;
