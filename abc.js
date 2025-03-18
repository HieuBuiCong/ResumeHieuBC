import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import MainLayout from "../components/Layout/MainLayout";
import TaskCategoryTable from "../components/TaskCategoryAndQuestion/TaskCategoryTable";
import TaskCategoryQuestionTable from "../components/TaskCategoryAndQuestion/TaskCategoryQuestionTable";
import 'bootstrap/dist/css/bootstrap.min.css';
import { getTaskCategoryData } from "../services/taskCategoryService";
import { getTaskQuestionData } from "../services/taskQuestionService";

const companyLogo = "/assets/HitachiEnergyLogo.png";

const TaskManagementPage = () => {
  const { isAuthenticated } = useContext(AuthContext);

  const [taskCategoryData, setTaskCategoryData] = useState([]);
  const [taskQuestionData, setTaskQuestionData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null); // 🆕 Store selected category
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch task categories
  useEffect(() => {
    const fetchTaskCategories = async () => {
      try {
        setLoading(true);
        const data = await getTaskCategoryData();
        setTaskCategoryData(data);
      } catch (error) {
        setError(error.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchTaskCategories();
  }, []);

  // Fetch task questions when a category is selected
  useEffect(() => {
    const fetchTaskQuestions = async () => {
      if (!selectedCategory) return; // 🛑 If no category is selected, do nothing
      try {
        setLoading(true);
        const data = await getTaskQuestionData(selectedCategory.task_category_id);
        setTaskQuestionData(data);
      } catch (error) {
        setError(error.message || "Failed to load questions");
      } finally {
        setLoading(false);
      }
    };
    fetchTaskQuestions();
  }, [selectedCategory]); // 🔄 Refetch when selectedCategory changes

  const refreshTaskCategory = async () => {
    try {
      setLoading(true);
      const data = await getTaskCategoryData();
      setTaskCategoryData(data);
    } catch (err) {
      setError(err.message || "Failed to refresh task categories");
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
              {/* Pass setSelectedCategory to TaskCategoryTable */}
              <TaskCategoryTable
                taskCategoryData={taskCategoryData}
                loading={loading}
                setLoading={setLoading}
                error={error}
                refreshTaskCategory={refreshTaskCategory}
                onCategorySelect={setSelectedCategory} // 🆕 Pass function to update selected category
              />
            </div>

            <div style={{ marginTop: "40px" }}>
              {/* Pass taskQuestionData and selectedCategory */}
              <TaskCategoryQuestionTable
                taskQuestionData={taskQuestionData}
                selectedCategory={selectedCategory}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "40px" }}>
              <footer
                className="p-2 text-white"
                style={{
                  fontSize: "13px",
                  background: "rgba(0,0,0,0.5)",
                  textAlign: "center",
                  width: "400px",
                  borderRadius: "5px",
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
