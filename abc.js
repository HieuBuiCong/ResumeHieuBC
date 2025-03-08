import { useState, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import { AuthContext } from '../context/AuthContext';
import apiClient from '../services/apiClient';
import { Iconify } from '../components/iconify'; // Replace with actual icon component

export function AuthPage() {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleInputChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSignIn = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.post('/auth/login', credentials);
      if (response.status === 200) {
        setIsAuthenticated(true);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }, [credentials, navigate, setIsAuthenticated]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" sx={{ mt: 8 }}>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Sign in</Typography>
        <Typography variant="body2" color="text.secondary">
          Don’t have an account?
          <Link variant="subtitle2" sx={{ ml: 0.5 }} 
                href="mailto:hieu.bui-cong@hitachienergy.com ; duy.van-dang1@hitachienergy.com">
            Contact Admin
          </Link>
        </Typography>
      </Box>

      <Box display="flex" flexDirection="column" alignItems="flex-end">
        <TextField
          fullWidth
          name="username"
          label="Username"
          value={credentials.username}
          onChange={handleInputChange}
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 3 }}
        />

        <TextField
          fullWidth
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={credentials.password}
          onChange={handleInputChange}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        <Link variant="body2" color="inherit" sx={{ mb: 1.5 }}>
          Forgot password?
        </Link>

        <LoadingButton
          fullWidth
          size="large"
          color="primary"
          variant="contained"
          onClick={handleSignIn}
          loading={loading}
        >
          Sign in
        </LoadingButton>
      </Box>
    </Box>
  );
}

export default AuthPage;
