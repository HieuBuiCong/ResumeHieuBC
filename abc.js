import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import LogoutButton from '../components/Auth/LogOutButton';

const DashboardPage = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-2xl p-6 bg-white shadow-md rounded-lg text-center">
        <h1 className="text-3xl font-semibold mb-4">Welcome to the Dashboard</h1>
        {isAuthenticated ? (
          <p className="text-green-600">You are logged in successfully! ✅</p>
        ) : (
          <p className="text-red-600">You are not authenticated ❌</p>
        )}
        <div className="mt-6">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
