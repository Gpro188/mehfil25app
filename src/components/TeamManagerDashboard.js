import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { loadFromLocalStorage, saveToLocalStorage } from '../utils/dataStorage';

const DashboardContainer = styled.div`
  padding: 20px;
  color: white;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
`;

const Title = styled.h1`
  margin: 0;
  color: gold;
`;

const LogoutButton = styled.button`
  padding: 10px 20px;
  background: #ff4757;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background: #ff6b81;
  }
`;

const RoleSwitcher = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const RoleButton = styled.button`
  padding: 8px 16px;
  background: ${props => props.active ? 'gold' : 'rgba(255,255,255,0.2)'};
  color: ${props => props.active ? '#333' : 'white'};
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.active ? 'gold' : 'rgba(255,255,255,0.3)'};
  }
`;

const FormContainer = styled.div`
  background: rgba(255,255,255,0.1);
  border-radius: 15px;
  padding: 30px;
  backdrop-filter: blur(10px);
  margin-bottom: 30px;
`;

const FormTitle = styled.h2`
  margin-top: 0;
  color: gold;
  border-bottom: 1px solid rgba(255,255,255,0.2);
  padding-bottom: 10px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
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
  padding: 12px 25px;
  background: gold;
  color: #333;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  transition: all 0.3s ease;
  margin-right: 10px;
  margin-bottom: 10px;

  &:hover {
    background: #ffd700;
    transform: translateY(-2px);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: rgba(255,255,255,0.1);
  border-radius: 10px;
  overflow: hidden;
`;

const Th = styled.th`
  background: rgba(0,0,0,0.2);
  padding: 15px;
  text-align: left;
`;

const Td = styled.td`
  padding: 15px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
`;

const Tr = styled.tr`
  &:hover {
    background: rgba(255,255,255,0.05);
  }
`;

const TeamManagerDashboard = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [teams, setTeams] = useState([]);
  const [events, setEvents] = useState([]);
  const [managedTeam, setManagedTeam] = useState('');
  const [teamManagerUsername, setTeamManagerUsername] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingStudent, setEditingStudent] = useState(null);
  const [newStudent, setNewStudent] = useState({
    name: '',
    chestNumber: '',
    event: '',
    category: '',
    team: '',
    photo: null
  });

  // Load data from localStorage
  useEffect(() => {
    try {
      const savedStudents = loadFromLocalStorage('students', []);
      const savedCategories = loadFromLocalStorage('categories', []);
      const savedTeams = loadFromLocalStorage('teams', []);
      const savedEvents = loadFromLocalStorage('events', []);
      const savedManagedTeam = loadFromLocalStorage('managedTeam', '');
      const savedTeamManagerUsername = loadFromLocalStorage('teamManagerUsername', '');
      
      console.log('Loaded data from localStorage:', { 
        students: savedStudents, 
        categories: savedCategories, 
        teams: savedTeams,
        managedTeam: savedManagedTeam,
        username: savedTeamManagerUsername
      });
      
      setStudents(savedStudents || []);
      setCategories(savedCategories || []);
      setTeams(savedTeams || []);
      setEvents(savedEvents || []);
      setManagedTeam(savedManagedTeam || '');
      setTeamManagerUsername(savedTeamManagerUsername || '');
      
      // Set the managed team as the default team
      if (savedManagedTeam) {
        setSelectedTeam(savedManagedTeam);
        setNewStudent(prev => ({ ...prev, team: savedManagedTeam }));
      } else if (savedTeams && savedTeams.length > 0) {
        const defaultTeam = savedTeams[0].name;
        setSelectedTeam(defaultTeam);
        setNewStudent(prev => ({ ...prev, team: defaultTeam }));
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
    
    // Periodically check for data changes (every 5 seconds)
    const interval = setInterval(() => {
      try {
        const currentStudents = loadFromLocalStorage('students', []);
        // Only update if the data has actually changed
        if (JSON.stringify(currentStudents) !== JSON.stringify(students)) {
          console.log('Detected data change, refreshing students');
          setStudents(currentStudents || []);
        }
      } catch (error) {
        console.error('Error checking for data changes:', error);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [students]);

  // Add a function to refresh data from localStorage
  const refreshData = () => {
    console.log('Refreshing data from localStorage');
    const savedStudents = loadFromLocalStorage('students', []);
    const savedCategories = loadFromLocalStorage('categories', []);
    const savedTeams = loadFromLocalStorage('teams', []);
    const savedEvents = loadFromLocalStorage('events', []);
    
    setStudents(savedStudents);
    setCategories(savedCategories);
    setTeams(savedTeams);
    setEvents(savedEvents);
    
    console.log('Data refreshed:', { students: savedStudents, categories: savedCategories, teams: savedTeams, events: savedEvents });
  };

  // Filter students by managed team and search term
  const filteredStudents = students.filter(student => {
    // Only show students from the managed team
    const teamMatch = !managedTeam || student.team === managedTeam;
    const searchMatch = !searchTerm || 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.chestNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return teamMatch && searchMatch;
  });

  const handleLogout = () => {
    // Clear authentication state
    localStorage.removeItem('isTeamManagerLoggedIn');
    localStorage.removeItem('managedTeam');
    localStorage.removeItem('teamManagerUsername');
    navigate('/team-manager-login');
  };

  const handleRegisterStudent = () => {
    if (newStudent.name.trim() === '' || newStudent.chestNumber.trim() === '') return;
    
    // Ensure the student is assigned to the managed team (enforce server-side like security)
    const studentData = {
      ...newStudent,
      team: managedTeam || newStudent.team
    };
    
    if (editingStudent) {
      // Update existing student
      const updatedStudents = students.map(student => 
        student.id === editingStudent.id 
          ? { ...student, ...studentData }
          : student
      );
      setStudents(updatedStudents);
      const saveResult = saveToLocalStorage('students', updatedStudents);
      console.log('Student update save result:', saveResult);
      if (!saveResult) {
        console.error('Failed to save updated students to localStorage');
      }
      setEditingStudent(null);
    } else {
      // Add new student
      const student = {
        id: students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1,
        name: studentData.name,
        chestNumber: studentData.chestNumber,
        event: studentData.event,
        category: studentData.category,
        team: studentData.team,
        photo: studentData.photo || null
      };
      
      const updatedStudents = [...students, student];
      setStudents(updatedStudents);
      const saveResult = saveToLocalStorage('students', updatedStudents);
      console.log('Student creation save result:', saveResult);
      if (!saveResult) {
        console.error('Failed to save new student to localStorage');
      }
    }
    
    // Reset form
    setNewStudent({ 
      name: '', 
      chestNumber: '', 
      event: newStudent.event, 
      category: newStudent.category, 
      team: managedTeam || newStudent.team,
      photo: null
    });
  };

  const handleEditStudent = (student) => {
    // Only allow editing students from the managed team
    if (managedTeam && student.team !== managedTeam) {
      alert('You can only edit students from your managed team.');
      return;
    }
    
    setEditingStudent(student);
    setNewStudent({
      name: student.name,
      chestNumber: student.chestNumber,
      event: student.event,
      category: student.category,
      team: student.team,
      photo: student.photo || null
    });
  };

  const handleDeleteStudent = (studentId) => {
    // Check if student belongs to managed team
    const student = students.find(s => s.id === studentId);
    if (managedTeam && student.team !== managedTeam) {
      alert('You can only delete students from your managed team.');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this student?')) {
      const updatedStudents = students.filter(student => student.id !== studentId);
      setStudents(updatedStudents);
      const saveResult = saveToLocalStorage('students', updatedStudents);
      console.log('Student deletion save result:', saveResult);
      if (!saveResult) {
        console.error('Failed to save deleted student to localStorage');
      }
      
      // Clear form if we were editing this student
      if (editingStudent && editingStudent.id === studentId) {
        setEditingStudent(null);
        setNewStudent({ 
          name: '', 
          chestNumber: '', 
          event: newStudent.event, 
          category: newStudent.category, 
          team: managedTeam || newStudent.team,
          photo: null
        });
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingStudent(null);
    setNewStudent({ 
      name: '', 
      chestNumber: '', 
      event: newStudent.event, 
      category: newStudent.category, 
      team: managedTeam || newStudent.team,
      photo: null
    });
  };

  return (
    <DashboardContainer>
      <Header>
        <div>
          <Title>Team Manager Dashboard</Title>
          {teamManagerUsername && (
            <p style={{ margin: '5px 0 0 0', color: 'rgba(255,255,255,0.8)' }}>
              Logged in as: <strong>{teamManagerUsername}</strong>
            </p>
          )}
        </div>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </Header>
      
      <RoleSwitcher>
        <RoleButton 
          active={false}
          onClick={() => navigate('/')}
        >
          Public View
        </RoleButton>
        <RoleButton 
          active={false}
          onClick={() => navigate('/admin/login')}
        >
          Admin Dashboard
        </RoleButton>
        <RoleButton 
          active={true}
          onClick={() => {}}
        >
          Team Manager
        </RoleButton>
      </RoleSwitcher>
      
      {managedTeam && (
        <div style={{ 
          background: 'rgba(255,215,0,0.2)', 
          padding: '15px', 
          borderRadius: '10px', 
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0, color: 'gold' }}>
            <strong>Managing Team:</strong> {managedTeam}
          </p>
        </div>
      )}
      
      <FormContainer>
        <FormTitle>{editingStudent ? 'Edit Student' : 'Register Student'}</FormTitle>
        {managedTeam && (
          <div style={{ 
            background: 'rgba(255,215,0,0.2)', 
            padding: '10px', 
            borderRadius: '5px', 
            marginBottom: '15px',
            textAlign: 'center'
          }}>
            <p style={{ margin: 0, color: 'gold' }}>
              <strong>Note:</strong> You can only register students for team: {managedTeam}
            </p>
          </div>
        )}
        <FormGroup>
          <Label>Student Name</Label>
          <Input 
            type="text" 
            value={newStudent.name}
            onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
            placeholder="Enter student name"
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Chest Number</Label>
          <Input 
            type="text" 
            value={newStudent.chestNumber}
            onChange={(e) => setNewStudent({...newStudent, chestNumber: e.target.value})}
            placeholder="Enter chest number"
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Team</Label>
          <Input 
            type="text" 
            value={managedTeam}
            disabled
            style={{ background: 'rgba(255,255,255,0.05)' }}
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Event</Label>
          <Select 
            value={newStudent.event}
            onChange={(e) => setNewStudent({...newStudent, event: e.target.value, category: ''})}
          >
            <option value="">Select an event</option>
            {events.map((event, index) => (
              <option key={index} value={event.name}>{event.name}</option>
            ))}
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label>Category</Label>
          <Select 
            value={newStudent.category}
            onChange={(e) => setNewStudent({...newStudent, category: e.target.value})}
            disabled={!newStudent.event}
          >
            <option value="">Select a category</option>
            {newStudent.event && events.find(event => event.name === newStudent.event)?.categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label>Student Photo</Label>
          <Input 
            type="file" 
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                  setNewStudent({...newStudent, photo: event.target.result});
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          {newStudent.photo && (
            <div style={{ marginTop: '10px' }}>
              <img 
                src={newStudent.photo} 
                alt="Student preview" 
                style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '5px' }}
              />
            </div>
          )}
        </FormGroup>
        
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Button onClick={handleRegisterStudent}>
            {editingStudent ? 'Update Student' : 'Register Student'}
          </Button>
          {editingStudent && (
            <Button 
              onClick={handleCancelEdit}
              style={{ background: '#ff4757' }}
            >
              Cancel
            </Button>
          )}
        </div>
      </FormContainer>
      
      <FormContainer>
        <FormTitle>Manage Students</FormTitle>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <Label>Search Students</Label>
            <Input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or chest number"
            />
          </div>
        </div>
        
        {filteredStudents.length === 0 ? (
          <p>No students found.</p>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Photo</Th>
                <Th>Name</Th>
                <Th>Chest Number</Th>
                <Th>Event</Th>
                <Th>Team</Th>
                <Th>Category</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <Tr key={student.id}>
                  <Td>
                    {student.photo ? (
                      <img 
                        src={student.photo} 
                        alt={student.name} 
                        style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        No Photo
                      </div>
                    )}
                  </Td>
                  <Td>{student.name}</Td>
                  <Td>{student.chestNumber}</Td>
                  <Td>{student.event || 'N/A'}</Td>
                  <Td>{student.team}</Td>
                  <Td>{student.category}</Td>
                  <Td>
                    <Button 
                      onClick={() => handleEditStudent(student)}
                      style={{ padding: '5px 10px', marginRight: '5px' }}
                    >
                      Edit
                    </Button>
                    <Button 
                      onClick={() => handleDeleteStudent(student.id)}
                      style={{ padding: '5px 10px', background: '#ff4757' }}
                    >
                      Delete
                    </Button>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </FormContainer>

      <Button onClick={refreshData} style={{ marginTop: '20px' }}>
        Refresh Data
      </Button>
    </DashboardContainer>
  );
};

export default TeamManagerDashboard;