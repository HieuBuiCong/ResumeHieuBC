import React from 'react';
 
const Error = ({ message }) => (
  <div className="p-2 bg-red-100 text-red-600 border border-red-400 rounded">
    {message}
  </div>
);
 
export default Error;
