import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from '../pages/AuthPage';
import DashboardPage from '../pages/DashboardPage';
import CIDManagementPage from '../pages/CIDManagementPage';
import NotFoundPage from '../pages/NotFoundPage';
import ProtectedRoute from '../components/Common/ProtectedRoute';
import UserPage from '../pages/UserPage';
import DepartmentPage from '../pages/DepartmentPage';
import ProductPage from '../pages/ProductPage';
import TaskManagementPage from '../pages/TaskManagementPage';

const AppRoutes = () => (
  <Routes>
    {/* Default route redirects to dashboard */}
    <Route path="/" element={<Navigate to="/dashboard" />} />
    
    {/* Public routes */}
    <Route path="/login" element={<AuthPage />} />

    {/* Protected routes (Only accessible if authenticated) */}
    <Route element={<ProtectedRoute />}>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/cid-management" element={<CIDManagementPage />} />
      <Route path="/user" element={<UserPage />} />
      <Route path="/department" element={<DepartmentPage/>} />
      <Route path="/product" element={<ProductPage/>} />
      <Route path="/task-management" element={<TaskManagementPage/>} />
    </Route>

    {/* 404 Not Found Page */}
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default AppRoutes;
