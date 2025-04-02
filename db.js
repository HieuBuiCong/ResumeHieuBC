import React, { useEffect, useState } from "react";
import useTableLogic from "./useTableLogic.js";
import ReusableTable from "./ReusableTable.jsx";
import { getTaskData, taskDelete, taskUpdate } from "../../services/taskService.js";
import { getUserData } from "../../services/userService";
import { getTaskCategoryData } from "../../services/taskCategoryService.js";
import TaskRegisterForm from "./TaskRegisterForm.jsx";
import { useDarkMode } from "../../context/DarkModeContext";
import { createTheme } from "@mui/material";
import { useCallback } from "react";

const columns = ["cid_task_id", "task_name", "assignee_name", "status", "deadline", "created_date", "submitted_date", "approver_name", "approval_date", "dependency_cid_id", "dependency_date"];

const TaskTable = ({selectedCidRow, setSelectedCidRow }) => {

  const { darkMode } = useDarkMode();
  const theme = React.useMemo(() =>
    createTheme({
      palette: {
        mode: darkMode ? "dark" : "light",
        primary: { main: darkMode ? "#90caf9" : "#1976d2" },
        background: { default: darkMode ? "#121212" : "#f8f9fa" },
        backgroundColor: { default: darkMode ? "rgba(33, 31, 31, 0.7)" : "rgba(255,255,255,0.7)" },
        text: { primary: darkMode ? "#ffffff" : "#000000" },
      },
    }), [darkMode]
  );

  const filterCondition = useCallback(
    (item) => selectedCidRow.cid_id === item.cid_id,
    [selectedCidRow]
  );
    // 🌟 fetch user data separately here
    const [userData, setUserData] = useState([]);
    const [taskCategoryData, setTaskCategoryData] = useState([]);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const users = await getUserData();
          setUserData(users);
          const taskCategory = await getTaskCategoryData();
          setTaskCategoryData(taskCategory);
        } catch (err) {
          throw new Error("Error fetching lookup data");
        }
      };
      fetchData();
    }, []);
  

  const logic = useTableLogic({
    fetchDataFn: getTaskData,
    identifierKey: "cid_task_id",
    deleteFn: async (id) => {
      await taskDelete(id);
      setTimeout(() => {
        window.location.reload();
      }, 4000);
       //✅ Refresh CID Table on delete
    },
    updateFn: async (id, data) => {
      await taskUpdate(id, data);
      setTimeout(() => {
        window.location.reload();
      }, 4000);
    },
    itemLabelKey: "task_name",
    filterCondition,
  });

  return (
    <ReusableTable
      logic={logic}
      columns={columns}
      identifierKey="cid_task_id"
      selectedItemByOtherTableFiltering={selectedCidRow} 
      setSelectedItemByOtherTableFiltering={null}
      identifierKeyOfFilteringTable="cid_id"
      title="Tasks For"
      RegisterFormComponent={TaskRegisterForm}
      theme={theme}
      userData={userData}
      taskCategoryData={taskCategoryData}
      isTaskTable={true}
      width="1300px"
    />
  );
};

export default TaskTable;
