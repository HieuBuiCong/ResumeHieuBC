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
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
      {error && <Error message={error} />}

      {/* Username Input */}
      <Input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        className="mb-4"
      />

      {/* Password Input with Show/Hide Feature */}
      <Form.Group className="mb-4">
        <Form.Label>Password</Form.Label>
        <InputGroup>
          <Form.Control
            type={showPassword ? "text" : "password"} // ✅ Toggle visibility
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <InputGroup.Text // ✅ Eye icon inside the field, on the right side
            onClick={() => setShowPassword(!showPassword)}
            style={{ cursor: 'pointer', background: 'white', borderLeft: 'none' }}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </InputGroup.Text>
        </InputGroup>
      </Form.Group>

      {/* Login Button */}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Logging in...' : 'Login'}
      </Button>

      {/* Contact Admin for Account */}
      <div className="text-center mt-3">
        <p>Don't have an account? <a href="mailto:admin@example.com">Contact Admin</a></p>
      </div>
    </form>
  );
};

export default LoginForm;