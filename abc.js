import React from "react";
import ReusableTable from "../common/ReusableTable";
import useTableLogic from "../../hooks/useTableLogic";
import { getTaskCategoryData, taskCategoryUpdate, taskCategoryDelete } from "../../services/taskCategoryService";
import TaskCategoryRegisterForm from "./TaskCategoryRegisterForm";

const TaskCategoryTable = ({ selectedTaskCategoryForQuestion, setSelectedTaskCategoryForQuestion }) => {
  const tableLogic = useTableLogic(getTaskCategoryData);

  return (
    <ReusableTable
      columns={["task_category_id", "task_name"]}
      tableLogic={tableLogic}
      handleUpdate={taskCategoryUpdate}
      handleDelete={taskCategoryDelete}
      CustomRegisterForm={TaskCategoryRegisterForm}
      title="Task Categories"
    />
  );
};

export default TaskCategoryTable;
