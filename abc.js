import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import MainLayout from "../components/Layout/MainLayout";
import TaskCategoryTableS from "../components/ReusableTable/TaskCategoryTableS";
import TaskQuestionTableS from "../components/ReusableTable/TaskQuestionTableS";
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const companyLogo = "/assets/HitachiEnergyLogo.png";

const TaskManagementPage = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const [authLoading, setAuthLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Authentication guard with loading indicator
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
    setAuthLoading(false);
  }, [isAuthenticated, navigate]);

  // Fetch initial category dynamically (if required)
  useEffect(() => {
    const fetchInitialCategory = async () => {
      // Example: fetch from API
      const initialCategory = { id: 1, name: "Default Category" };
      setSelectedCategory(initialCategory);
    };
    fetchInitialCategory();
  }, []);

  if (authLoading || !selectedCategory) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
  }

  return (
    <MainLayout>
      <div
        className="position-relative d-flex flex-column vh-100 justify-content-start overflow"
        style={{ zIndex: 1, padding: "20px", marginTop: "70px" }}
      >
        <div 
          style={{ 
            display: "flex", 
            justifyContent: "center", 
            gap: "40px",
            flexWrap: "wrap" // responsive improvement
          }}
        >
          <TaskCategoryTableS 
            selectedTaskCategory={selectedCategory} 
            setSelectedTaskCategory={setSelectedCategory}
          />
          <TaskQuestionTableS 
            selectedTaskCategory={selectedCategory} 
          />
        </div>

        <div 
          style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between", 
            marginTop: "40px",
            flexWrap: "wrap" // responsive improvement
          }}
        >
          <footer
            style={{
              padding: "8px",
              color: "#fff",
              background: "rgba(0,0,0,0.5)",
              fontSize: "13px",
              textAlign: "center",
              borderRadius: "5px",
              width: "100%",
              maxWidth: "400px",
              margin: "auto"
            }}
          >
            ©2025 Developed by INT team PGHV Hitachi Energy VN
          </footer>
          <img 
            src={companyLogo} 
            alt="Hitachi Energy Logo" 
            style={{ width: "150px", margin: "auto" }} 
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default TaskManagementPage;
