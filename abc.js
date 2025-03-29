import React, { createContext, useContext, useState } from 'react';
import { Snackbar, Alert, Portal } from '@mui/material';

// Create Context
const NotificationContext = createContext();

// Custom Hook for easy access
export const useNotification = () => useContext(NotificationContext);

// Notification Provider Component
export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({ open: false, message: "", severity: "info" });

  const showNotification = (message, severity = "info") => {
    setNotification({ open: true, message, severity });
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}

      {/* Portal for Global Notifications */}
      <Portal>
        <Snackbar
          open={notification.open}
          autoHideDuration={4000}
          onClose={() => setNotification({ ...notification, open: false })}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setNotification({ ...notification, open: false })}
            severity={notification.severity}
            variant="filled"
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Portal>
    </NotificationContext.Provider>
  );
};
