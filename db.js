import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import MainLayout from "../components/Layout/MainLayout";
import TaskCategoryTable from "../components/TaskCategoryAndQuestion/TaskCategoryTable";
import TaskQuestionTable from "../components/TaskCategoryAndQuestion/TaskQuestionTable";
import 'bootstrap/dist/css/bootstrap.min.css';
import { getTaskCategoryData } from "../services/taskCategoryService";
import { getTaskQuestionData } from "../services/taskQuestionService";

const companyLogo = "/assets/HitachiEnergyLogo.png";

const TaskManagementPage = () => { 
  const { isAuthenticated } = useContext(AuthContext);

  const [taskCategoryData, setTaskCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          const data = await getTaskCategoryData();
          setTaskCategoryData(data);
          console.log(taskCategoryData);
        } catch (error) {
          setError(error.message || "Failed to load data");
        } finally {
          setLoading(false);
        }
      }
      fetchData();
  }, []);

  const refreshTaskCategory = async () => {
    try {
      setLoading(true);
      const data = await getTaskCategoryData();
      setTaskCategoryData(data);
    } catch (err) {
      setError(err.message || "Failed to refresh taskCategory");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div
        className="position-relative d-flex flex-column vh-100 justify-content-start overflow"
        style={{ zIndex: 1, padding: "20px", marginTop: "70px" }}
      >
        {isAuthenticated ? (
          <>
            <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
                <TaskCategoryTable taskCategoryData={taskCategoryData} loading={loading} setLoading={setLoading} error={error} refreshTaskCategory={refreshTaskCategory} />
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
          </>
        ) : (
          <p className="text-red-600">You are not authenticated ❌</p>
        )}
      </div>
    </MainLayout>
  );
};

export default TaskManagementPage;
