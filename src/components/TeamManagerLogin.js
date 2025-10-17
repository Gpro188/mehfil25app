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

const Select = styled.select`
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
  margin-bottom: 10px;

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

const InfoBox = styled.div`
  background: rgba(255,255,255,0.1);
  border-radius: 10px;
  padding: 15px;
  margin-top: 20px;
  color: rgba(255,255,255,0.8);
`;

const TeamManagerLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Load teams and team managers from localStorage
  const teams = loadFromLocalStorage('teams', []);
  const teamManagers = loadFromLocalStorage('teamManagers', []);

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Simple validation
    if (username.trim() === '' || password.trim() === '') {
      setError('Please enter both username and password');
      return;
    }
    
    // Check if team is selected
    if (selectedTeam === '') {
      setError('Please select a team to manage');
      return;
    }
    
    // Authenticate team manager
    const manager = teamManagers.find(mgr => 
      mgr.username === username && 
      mgr.password === password && 
      mgr.team === selectedTeam
    );
    
    if (manager) {
      // Valid credentials
      localStorage.setItem('isTeamManagerLoggedIn', 'true');
      localStorage.setItem('managedTeam', selectedTeam);
      localStorage.setItem('teamManagerUsername', username);
      navigate('/team-manager');
    } else {
      setError('Invalid username, password, or team assignment');
    }
  };

  const handleBackToPublic = () => {
    navigate('/');
  };

  return (
    <LoginContainer>
      <LoginForm>
        <Title>Team Manager Login</Title>
        <form onSubmit={handleLogin}>
          <FormGroup>
            <Label>Username</Label>
            <Input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Password</Label>
            <Input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Select Team to Manage</Label>
            <Select 
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
            >
              <option value="">Select a team</option>
              {teams.map(team => (
                <option key={team.id} value={team.name}>{team.name}</option>
              ))}
            </Select>
          </FormGroup>
          
          <Button type="submit">Login</Button>
          <Button 
            type="button" 
            onClick={handleBackToPublic}
            style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}
          >
            Back to Public View
          </Button>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </form>
        
        <InfoBox>
          <p style={{ margin: '0 0 10px 0' }}><strong>Team Manager Features:</strong></p>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li>Register students for your team</li>
            <li>Edit student information</li>
            <li>Delete students from your team</li>
            <li>Search and filter students</li>
          </ul>
        </InfoBox>
      </LoginForm>
    </LoginContainer>
  );
};

export default TeamManagerLogin;