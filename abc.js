import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import MainLayout from "../components/Layout/MainLayout";

import TaskCategoryTableS from "../components/ReusableTable/TaskCategoryTableS";
import TaskQuestionTableS from "../components/ReusableTable/TaskQuestionTableS";

import 'bootstrap/dist/css/bootstrap.min.css';

import { useNavigate } from 'react-router-dom';

const companyLogo = "/assets/HitachiEnergyLogo.png";

const TaskManagementPage = () => { 
  const { isAuthenticated } = useContext(AuthContext);
  const [selectedTaskCategoryForQuestion, setSelectedTaskCategoryForQuestion] = useState({task_category_id: 1, task_name: ""});

  // navigate to authen page
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  return (
    <MainLayout>
      <div
        className="position-relative d-flex flex-column vh-100 justify-content-start overflow"
        style={{ zIndex: 1, padding: "20px", marginTop: "70px" }}
      >
        <div style={{ display: "flex", justifyContent: "center", gap: "40px" }}>
            <TaskCategoryTableS 
              selectedTaskCategoryForQuestion={selectedTaskCategoryForQuestion} setSelectedTaskCategoryForQuestion={setSelectedTaskCategoryForQuestion} // 🆕 Pass function to update selectedTask
            />
            <TaskQuestionTableS 
              selectedTaskCategoryForQuestion={selectedTaskCategoryForQuestion} setSelectedTaskCategoryForQuestion={setSelectedTaskCategoryForQuestion} // 🆕 Pass state upon the selectedTask
            />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "40px" }}>
          <footer className="p-2 text-white"
            style={{
              fontSize: "13px",
              background: "rgba(0,0,0,0.5)",
              textAlign: "center",
              width: "400px",
              borderRadius: "5px"
            }}
          >
            ©2025 Developed by INT team PGHV Hitachi Energy VN
          </footer>
          <img src={companyLogo} alt="company logo" style={{ width: "150px" }} />
        </div>
      </div>
    </MainLayout>
  );
};

export default TaskManagementPage;
