import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { loadFromLocalStorage } from '../utils/dataStorage';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
`;

const LoginForm = styled.div`
  background: rgba(255,255,255,0.1);
  border-radius: 15px;
  padding: 40px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  text-align: center;
  color: gold;
  margin-top: 0;
  margin-bottom: 30px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: white;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: none;
  background: rgba(255,255,255,0.1);
  color: white;
  font-size: 1rem;

  &:focus {
    outline: 2px solid gold;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: gold;
  color: #333;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:hover {
    background: #ffd700;
    transform: translateY(-2px);
  }
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  text-align: center;
  margin-top: 15px;
`;

const AdminLogin = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Get saved password
    const savedPassword = loadFromLocalStorage('adminPassword', 'admin123');
    
    // Simple validation
    if (username.trim() === '' || password.trim() === '') {
      setError('Please enter both username and password');
      return;
    }
    
    // Check credentials
    if (username === 'admin' && password === savedPassword) {
      // Save login state (in a real app, use proper authentication)
      localStorage.setItem('isAdminLoggedIn', 'true');
      navigate('/admin');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <LoginContainer>
      <LoginForm>
        <Title>Admin Login</Title>
        <form onSubmit={handleLogin}>
          <FormGroup>
            <Label>Username</Label>
            <Input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Password</Label>
            <Input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
            />
          </FormGroup>
          
          <Button type="submit">Login</Button>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </form>
      </LoginForm>
    </LoginContainer>
  );
};

export default AdminLogin;