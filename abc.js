import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/authService';
import { AuthContext } from '../../context/AuthContext';
import Button from '../Common/Button';
import Input from '../Common/Input';
import Error from '../Common/Error';
import { Form, InputGroup } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // ✅ Toggle password visibility

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
    <div className="d-flex vh-50 justify-content-center align-items-center bg-light p-5 bg-white shadow-lg rounded-lg" style={{ width: '400px' }}>
      <div  style={{ width: '400px' }}>
        <h2 className="text-center mb-3">Sign in</h2>
        <p className="text-center">
          Don’t have an account? <a href="mailto:admin@example.com" className="text-primary">Contact Admin</a>
        </p>

        {error && <Error message={error} />}

        <Form onSubmit={handleSubmit}>

          {/* Username Field */}
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

          {/* Password Field with "Forgot Password?" and Toggle Icon */}
          <Form.Group className="mb-3">
            <div className="d-flex justify-content-between">
              <Form.Label>Password</Form.Label>
              <a href="#" className="text-primary small">Forgot password?</a>
            </div>
            <InputGroup>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <InputGroup.Text // ✅ Eye icon inside the field, on the right
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: 'pointer', background: 'white', borderLeft: 'none' }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>

          {/* Sign In Button */}
          <Button type="submit" disabled={loading} className="w-100 bg-dark text-white">
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>

        </Form>
      </div>
    </div>
  );
};

export default LoginForm;
