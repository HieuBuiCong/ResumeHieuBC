import React, { createContext, useContext, useState } from 'react';
import { Snackbar, Alert, Portal, CircularProgress, Box } from '@mui/material';

// Create Context
const NotificationContext = createContext();

// Custom Hook for easy access
export const useNotification = () => useContext(NotificationContext);

// Notification Provider Component
export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({ open: false, message: "", severity: "info" });
  const [loading, setLoading] = useState(false);

  const showNotification = (message, severity = "info") => {
    setNotification({ open: true, message, severity });
    setLoading(false); // Ensure loading is stopped
  };

  const showLoading = () => {
    setLoading(true);
  };

  return (
    <NotificationContext.Provider value={{ showNotification, showLoading }}>
      {children}

      {/* Portal for Global Notifications */}
      <Portal>
        {/* Loading Snackbar */}
        <Snackbar
          open={loading}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Box
            sx={{
              backgroundColor: '#FFD700', // Yellow
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 20px',
              borderRadius: '8px',
              color: '#333',
              fontWeight: 'bold',
            }}
          >
            <CircularProgress size={20} sx={{ color: '#333' }} />
            Loading... Please wait
          </Box>
        </Snackbar>

        {/* Success/Error Notification */}
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
