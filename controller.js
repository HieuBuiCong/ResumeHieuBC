import React, { useEffect, useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

const Error = ({ message, onClose }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false); // Auto-close after 2 seconds
      if (onClose) onClose();
    }, 2000);

    return () => clearTimeout(timer); // Cleanup timer
  }, [onClose]);

  return (
    <ToastContainer position="top-end" className="p-3">
      <Toast show={show} bg="danger" onClose={() => setShow(false)} delay={2000} autohide>
        <Toast.Header>
          <strong className="me-auto text-white">Error</strong>
        </Toast.Header>
        <Toast.Body className="text-white">{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default Error;
