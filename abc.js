import React from 'react';
import LoginForm from '../components/Auth/LoginForm';

const AuthPage = () => {
  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>
        <LoginForm />
      </div>
    </div>
  );
};

export default AuthPage;

