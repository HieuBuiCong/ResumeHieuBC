import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/authService';
import { AuthContext } from '../../context/AuthContext';
import { Box, TextField, IconButton, Typography, Link } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Error from '../Common/Error';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 

  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await loginUser(username, password);
      setIsAuthenticated(true);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid username or password.');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center"
      sx={{ width: 380, p: 4, bgcolor: 'white', boxShadow: 3, borderRadius: 2 }}
    >
      <Typography variant="h5" sx={{ mb: 1 }}>Sign in</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Don’t have an account? 
        <Link href="mailto:admin@example.com" sx={{ ml: 0.5 }}>Contact Admin</Link>
      </Typography>

      {error && <Error message={error} />}

      <form onSubmit={handleSubmit} style={{ width: '100%' }}>

        {/* Username Field */}
        <TextField
          fullWidth
          label="Username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* Password Field */}
        <TextField
          fullWidth
          label="Password"
          type={showPassword ? "text" : "password"}
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Link href="#" sx={{ display: 'block', mb: 2, textAlign: 'right' }}>Forgot password?</Link>

        {/* Sign In Button */}
        <LoadingButton 
          fullWidth
          variant="contained"
          color="primary"
          type="submit"
          loading={loading}
        >
          Sign in
        </LoadingButton>

      </form>
    </Box>
  );
};

export default LoginForm;
-------------------------------
import React from 'react';
import { Box } from '@mui/material';
import LoginForm from '../components/Auth/LoginForm';

const AuthPage = () => {
  return (
    <Box 
      display="flex" 
      alignItems="center" 
      justifyContent="center"
      minHeight="100vh"
      bgcolor="background.default"
    >
      <LoginForm />
    </Box>
  );
};

export default AuthPage;
