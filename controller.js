import React, { useEffect, useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

const Error = ({ message, type = "danger", onClose }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      if (onClose) onClose();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <ToastContainer position="top-end" className="p-3">
      <Toast show={show} bg={type} onClose={() => setShow(false)} delay={2000} autohide>
        <Toast.Header>
          <strong className="me-auto text-white">
            {type === "danger" && "Error"}
            {type === "success" && "Success"}
            {type === "warning" && "Warning"}
            {type === "info" && "Information"}
          </strong>
        </Toast.Header>
        <Toast.Body className="text-white">{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default Error;
