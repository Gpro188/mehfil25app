import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { loadFromLocalStorage, saveToLocalStorage, calculateTeamStandings } from '../utils/dataStorage';

const DashboardContainer = styled.div`
  padding: 20px;
  color: white;
  min-height: 100vh;
`;

const Header = styled.h1`
  text-align: center;
  font-size: 2rem;
  margin-bottom: 30px;
  color: gold;
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 2px solid rgba(255,255,255,0.2);
  margin-bottom: 30px;
  flex-wrap: wrap;
`;

const Tab = styled.button`
  padding: 15px 30px;
  background: ${props => props.active ? 'rgba(255,255,255,0.2)' : 'transparent'};
  color: ${props => props.active ? 'gold' : 'white'};
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: bold;

  &:hover {
    background: rgba(255,255,255,0.1);
  }
  
  @media (max-width: 768px) {
    padding: 10px 15px;
    font-size: 0.9rem;
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

const ColorPreview = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: ${props => `rgb(${props.r}, ${props.g}, ${props.b})`};
  display: inline-block;
  margin-right: 10px;
`;

const RGBInputContainer = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const RGBInput = styled.input`
  width: 80px;
  padding: 8px;
  border-radius: 5px;
  border: none;
  background: rgba(255,255,255,0.1);
  color: white;
  text-align: center;
`;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [teams, setTeams] = useState([]);
  const [categories, setCategories] = useState([]);
  const [students, setStudents] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [results, setResults] = useState([]);
  const [points, setPoints] = useState({
    gold: 3,
    silver: 2,
    bronze: 1
  });
  // Category-specific points configuration
  const [categoryPoints, setCategoryPoints] = useState({});
  // Grade-specific points configuration
  const [gradePoints, setGradePoints] = useState({});
  // Available grades configuration
  const [availableGrades, setAvailableGrades] = useState(['A', 'B', 'C', 'D']);
  // New grade points configuration
  const [newGradePoints, setNewGradePoints] = useState({
    gold: 3,
    silver: 2,
    bronze: 1
  });
  // Team managers configuration
  const [teamManagers, setTeamManagers] = useState([]);
  // Selected event for management
  const [selectedEvent, setSelectedEvent] = useState('');
  
  // Search functionality
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  // Form states
  const [newEvent, setNewEvent] = useState({ name: '', categories: [], color: { r: 106, g: 17, b: 203 } });
  const [newTeam, setNewTeam] = useState({ 
    name: '', 
    event: '',
    color: '#FF5733',
    teamLeader: { name: '', photo: null },
    assistantLeader: { name: '', photo: null },
    manager: { name: '', photo: null }
  });
  const [newCategory, setNewCategory] = useState({ name: '', order: 1 });
  const [newStudent, setNewStudent] = useState({ name: '', chestNumber: '', event: '', team: '', category: '', photo: null });
  const [newProgram, setNewProgram] = useState({ name: '', event: '', category: '', type: 'Individual' });
  const [newResult, setNewResult] = useState({ 
    event: '', 
    program: '', 
    category: '', 
    participants: [{ name: '', position: '', grade: '' }] 
  });
  const [newTeamManager, setNewTeamManager] = useState({ 
    username: '', 
    password: '', 
    event: '',
    team: '' 
  });
  const [editingTeamManager, setEditingTeamManager] = useState(null);
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [selectedCategoryForPoints, setSelectedCategoryForPoints] = useState('');
  const [selectedGradeForPoints, setSelectedGradeForPoints] = useState('');
  const [selectedCategoriesForBatch, setSelectedCategoriesForBatch] = useState([]);
  const [newGrade, setNewGrade] = '';
  
  // Event filtering states
  const [selectedEventForTeams, setSelectedEventForTeams] = useState('');
  const [selectedEventForStudents, setSelectedEventForStudents] = useState('');
  const [selectedEventForPrograms, setSelectedEventForPrograms] = useState('');
  const [selectedEventForResults, setSelectedEventForResults] = useState('');

  // Theme configuration
  const [appTheme, setAppTheme] = useState({
    primary: '#6a11cb',
    secondary: '#2575fc',
    accent: 'gold'
  });
  
  // App title configuration
  const [appTitle, setAppTitle] = useState('Mehfil Artsfest Leaderboard');
  
  // Logo configuration
  const [logoImage, setLogoImage] = useState(null);
  
  // Gallery images
  const [galleryImages, setGalleryImages] = useState([]);
  
  // Admin credentials
  const [newAdminUsername, setNewAdminUsername] = useState('');
  const [currentAdminPassword, setCurrentAdminPassword] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [confirmAdminPassword, setConfirmAdminPassword] = useState('');

  // Function to get position text
  const getPositionText = (position) => {
    switch(position) {
      case '1': return '1st Place';
      case '2': return '2nd Place';
      case '3': return '3rd Place';
      default: return position;
    }
  };

  // Function to add student to participants list
  const handleAddStudentToParticipants = (student) => {
    // Check if student is already in participants
    const isAlreadyAdded = newResult.participants.some(
      participant => participant.name === student.chestNumber
    );
    
    if (isAlreadyAdded) {
      alert('This participant is already added to the list');
      return;
    }
    
    // Add student to participants with chest number as name
    const updatedParticipants = [
      ...newResult.participants,
      { 
        name: student.chestNumber, // Use chest number for easier identification
        position: '', 
        grade: '' 
      }
    ];
    
    setNewResult({ 
      ...newResult, 
      participants: updatedParticipants 
    });
    
    // Clear search results
    setSearchResults([]);
    setSearchTerm('');
    
    alert(`Added ${student.name} (${student.chestNumber}) to participants list`);
  };

  // Function to search students by chest number
  const handleSearchByChestNumber = () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    
    const results = students.filter(student => 
      student.chestNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setSearchResults(results);
  };

  // Function to handle admin credentials change
  const handleAdminCredentialsChange = () => {
    // Get current saved password for verification
    const savedPassword = loadFromLocalStorage('adminPassword', 'admin123');
    
    // Validate current password
    if (currentAdminPassword !== savedPassword) {
      alert('Current password is incorrect!');
      return;
    }
    
    // Validate new password
    if (newAdminPassword !== confirmAdminPassword) {
      alert('New passwords do not match!');
      return;
    }
    
    // Check if any changes were made
    const hasUsernameChange = newAdminUsername.trim() !== '';
    const hasPasswordChange = newAdminPassword.trim() !== '';
    
    if (!hasUsernameChange && !hasPasswordChange) {
      alert('Please enter new username or password to update!');
      return;
    }
    
    // Update password if changed
    if (hasPasswordChange) {
      saveToLocalStorage('adminPassword', newAdminPassword);
      setAdminPassword(newAdminPassword);
      alert('Admin password updated successfully!');
    }
    
    // For username change, we would need to implement a more complex system
    // For now, we'll just notify that username change is not fully implemented
    if (hasUsernameChange) {
      alert('Username change functionality requires additional implementation. Password has been updated.');
    }
    
    // Clear the form
    setNewAdminUsername('');
    setCurrentAdminPassword('');
    setNewAdminPassword('');
    setConfirmAdminPassword('');
  };

  // Function to pre-configure points for a new grade across all categories
  const preConfigureGradePoints = (grade, pointsConfig) => {
    const updatedGradePoints = { ...gradePoints };
    
    // For each selected category, create a default grade point configuration
    selectedCategoriesForBatch.forEach(categoryName => {
      const key = `${categoryName}-${grade}`;
      updatedGradePoints[key] = { ...pointsConfig };
    });
    
    setGradePoints(updatedGradePoints);
  };

  // Function to reset all points to the new system
  const resetAllPointsToNewSystem = () => {
    if (window.confirm('Are you sure you want to reset all points to the new system? This will clear all existing custom point configurations.')) {
      // Reset default points
      const newDefaultPoints = { gold: 3, silver: 2, bronze: 1 };
      setPoints(newDefaultPoints);
      saveToLocalStorage('points', newDefaultPoints);
      
      // Clear category points
      setCategoryPoints({});
      saveToLocalStorage('categoryPoints', {});
      
      // Clear grade points
      setGradePoints({});
      saveToLocalStorage('gradePoints', {});
      
      // Reset new grade points to default
      const newGradePointsConfig = { gold: 3, silver: 2, bronze: 1 };
      setNewGradePoints(newGradePointsConfig);
      
      alert('All points have been reset to the new system.');
    }
  };

  // Add a function to refresh data from localStorage
  const refreshData = () => {
    console.log('Refreshing data from localStorage');
    try {
      const savedEvents = loadFromLocalStorage('events', []);
      const savedTeams = loadFromLocalStorage('teams', []);
      const savedCategories = loadFromLocalStorage('categories', []);
      const savedStudents = loadFromLocalStorage('students', []);
      const savedPrograms = loadFromLocalStorage('programs', []);
      const savedResults = loadFromLocalStorage('results', []);
      const savedPoints = loadFromLocalStorage('points', { gold: 3, silver: 2, bronze: 1 });
      const savedCategoryPoints = loadFromLocalStorage('categoryPoints', {});
      const savedGradePoints = loadFromLocalStorage('gradePoints', {});
      const savedTeamManagers = loadFromLocalStorage('teamManagers', []);

      setEvents(savedEvents || []);
      setTeams(savedTeams || []);
      setCategories(savedCategories || []);
      setStudents(savedStudents || []);
      setPrograms(savedPrograms || []);
      setResults(savedResults || []);
      setPoints(savedPoints);
      setCategoryPoints(savedCategoryPoints || {});
      setGradePoints(savedGradePoints || {});
      setTeamManagers(savedTeamManagers || []);

      console.log('Admin data refreshed');
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedEvents = loadFromLocalStorage('events', []);
    const savedTeams = loadFromLocalStorage('teams', []);
    const savedCategories = loadFromLocalStorage('categories', []);
    const savedStudents = loadFromLocalStorage('students', []);
    const savedPrograms = loadFromLocalStorage('programs', []);
    const savedResults = loadFromLocalStorage('results', []);
    const savedPoints = loadFromLocalStorage('points', { gold: 3, silver: 2, bronze: 1 });
    const savedCategoryPoints = loadFromLocalStorage('categoryPoints', {});
    const savedGradePoints = loadFromLocalStorage('gradePoints', {});
    const savedPassword = loadFromLocalStorage('adminPassword', 'admin123');
    const savedAvailableGrades = loadFromLocalStorage('availableGrades', ['A', 'B', 'C', 'D']);
    const savedTeamManagers = loadFromLocalStorage('teamManagers', []);

    // Load settings
    const savedAppTitle = loadFromLocalStorage('appTitle', 'Mehfil Artsfest Leaderboard');
    const savedAppTheme = loadFromLocalStorage('appTheme', {
      primary: '#6a11cb',
      secondary: '#2575fc',
      accent: 'gold'
    });
    const savedLogoImage = loadFromLocalStorage('logoImage', null);

    // Load event filtering states
    const savedSelectedEventForTeams = loadFromLocalStorage('selectedEventForTeams', '');
    const savedSelectedEventForStudents = loadFromLocalStorage('selectedEventForStudents', '');
    const savedSelectedEventForPrograms = loadFromLocalStorage('selectedEventForPrograms', '');
    const savedSelectedEventForResults = loadFromLocalStorage('selectedEventForResults', '');

    console.log('Admin dashboard loaded data:', {
      events: savedEvents,
      teams: savedTeams,
      categories: savedCategories,
      students: savedStudents,
      programs: savedPrograms,
      results: savedResults,
      points: savedPoints,
      categoryPoints: savedCategoryPoints,
      gradePoints: savedGradePoints,
      teamManagers: savedTeamManagers
    });

    setEvents(savedEvents || []);
    setTeams(savedTeams || []);
    setCategories(savedCategories || []);
    setStudents(savedStudents || []);
    setPrograms(savedPrograms || []);
    setResults(savedResults || []);
    setPoints(savedPoints);
    setCategoryPoints(savedCategoryPoints || {});
    setGradePoints(savedGradePoints || {});
    setAdminPassword(savedPassword);
    setAvailableGrades(savedAvailableGrades || ['A', 'B', 'C', 'D']);
    setTeamManagers(savedTeamManagers || []);
    
    // Set settings
    setAppTitle(savedAppTitle);
    setAppTheme(savedAppTheme);
    setLogoImage(savedLogoImage);

    // Set event filtering states
    setSelectedEventForTeams(savedSelectedEventForTeams || '');
    setSelectedEventForStudents(savedSelectedEventForStudents || '');
    setSelectedEventForPrograms(savedSelectedEventForPrograms || '');
    setSelectedEventForResults(savedSelectedEventForResults || '');

    // Initialize form select options
    if (savedEvents && savedEvents.length > 0) {
      setNewResult(prev => ({ ...prev, event: savedEvents[0].name }));
      setSelectedEvent(savedEvents[0].name);
    }
    if (savedPrograms && savedPrograms.length > 0) {
      setNewResult(prev => ({ ...prev, program: savedPrograms[0].name }));
    }
    if (savedCategories && savedCategories.length > 0) {
      setNewResult(prev => ({ ...prev, category: savedCategories[0].name }));
      setSelectedCategoryForPoints(savedCategories[0].name);
      // Initialize selected categories for batch
      setSelectedCategoriesForBatch(savedCategories.map(cat => cat.name));
    }
    if (savedTeams && savedTeams.length > 0) {
      setNewTeamManager(prev => ({ ...prev, team: savedTeams[0].name }));
    }
  }, []);

  // Initialize selected categories for batch when categories change
  useEffect(() => {
    if (categories.length > 0 && selectedCategoriesForBatch.length === 0) {
      // Initially select all categories
      setSelectedCategoriesForBatch(categories.map(cat => cat.name));
    }
  }, [categories, selectedCategoriesForBatch.length]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    navigate('/');
  };

  // Handle event selection
  const handleEventSelection = (eventName) => {
    setSelectedEvent(eventName);
    
    // Update forms that depend on event selection
    setNewTeam({ ...newTeam, event: eventName });
    setNewCategory({ ...newCategory, event: eventName });
    setNewStudent({ ...newStudent, event: eventName });
    setNewProgram({ ...newProgram, event: eventName });
    setNewResult({ ...newResult, event: eventName });
    setNewTeamManager({ ...newTeamManager, event: eventName });
  };

  // Team manager CRUD operations
  const handleCreateTeamManager = () => {
    if (newTeamManager.username.trim() === '' || newTeamManager.password.trim() === '' || newTeamManager.team.trim() === '') {
      alert('Please fill in all fields');
      return;
    }
    
    // Check if username already exists
    if (teamManagers.some(manager => manager.username === newTeamManager.username)) {
      alert('Username already exists');
      return;
    }
    
    const updatedTeamManagers = [...teamManagers, newTeamManager];
    setTeamManagers(updatedTeamManagers);
    saveToLocalStorage('teamManagers', updatedTeamManagers);
    setNewTeamManager({ username: '', password: '', team: '' });
  };

  const handleUpdateTeamManager = () => {
    if (!editingTeamManager) return;
    
    const updatedTeamManagers = teamManagers.map(manager => 
      manager.username === editingTeamManager.username ? newTeamManager : manager
    );
    
    setTeamManagers(updatedTeamManagers);
    saveToLocalStorage('teamManagers', updatedTeamManagers);
    setEditingTeamManager(null);
    setNewTeamManager({ username: '', password: '', team: '' });
  };

  const handleDeleteTeamManager = (username) => {
    if (window.confirm('Are you sure you want to delete this team manager?')) {
      const updatedTeamManagers = teamManagers.filter(manager => manager.username !== username);
      setTeamManagers(updatedTeamManagers);
      saveToLocalStorage('teamManagers', updatedTeamManagers);
    }
  };

  // Handle photo upload for students
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewStudent({ ...newStudent, photo: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Gallery image upload handler
  const handleGalleryImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if we already have 10 images
      if (galleryImages.length >= 10) {
        alert('Maximum of 10 gallery images allowed');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setGalleryImages([...galleryImages, event.target.result]);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove gallery image
  const removeGalleryImage = (index) => {
    const updatedImages = [...galleryImages];
    updatedImages.splice(index, 1);
    setGalleryImages(updatedImages);
  };

  // Save gallery images
  const saveGalleryImages = () => {
    saveToLocalStorage('galleryImages', galleryImages);
    alert('Gallery images saved successfully!');
  };

  return (
    <DashboardContainer>
      <Header>Admin Dashboard</Header>
      <TabContainer>
        <Tab active={activeTab === 'events'} onClick={() => setActiveTab('events')}>Events</Tab>
        <Tab active={activeTab === 'teams'} onClick={() => setActiveTab('teams')}>Teams</Tab>
        <Tab active={activeTab === 'students'} onClick={() => setActiveTab('students')}>Students</Tab>
        <Tab active={activeTab === 'programs'} onClick={() => setActiveTab('programs')}>Programs</Tab>
        <Tab active={activeTab === 'results'} onClick={() => setActiveTab('results')}>Results</Tab>
        <Tab active={activeTab === 'points'} onClick={() => setActiveTab('points')}>Points</Tab>
        <Tab active={activeTab === 'teamManagers'} onClick={() => setActiveTab('teamManagers')}>Team Managers</Tab>
        <Tab active={activeTab === 'settings'} onClick={() => setActiveTab('settings')}>Settings</Tab>
      </TabContainer>
      {activeTab === 'events' && (
        <div>
          <FormContainer>
            <FormTitle>Add New Event</FormTitle>
            <FormGroup>
              <Label>Name</Label>
              <Input type="text" value={newEvent.name} onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })} />
            </FormGroup>
            <FormGroup>
              <Label>Color</Label>
              <ColorPreview r={newEvent.color.r} g={newEvent.color.g} b={newEvent.color.b} />
              <RGBInputContainer>
                <RGBInput type="number" value={newEvent.color.r} onChange={(e) => setNewEvent({ ...newEvent, color: { ...newEvent.color, r: parseInt(e.target.value) } })} />
                <RGBInput type="number" value={newEvent.color.g} onChange={(e) => setNewEvent({ ...newEvent, color: { ...newEvent.color, g: parseInt(e.target.value) } })} />
                <RGBInput type="number" value={newEvent.color.b} onChange={(e) => setNewEvent({ ...newEvent, color: { ...newEvent.color, b: parseInt(e.target.value) } })} />
              </RGBInputContainer>
            </FormGroup>
            
            {/* Category Management for Event */}
            <FormGroup>
              <Label>Event Categories</Label>
              <p>Add categories for this event:</p>
              
              {/* Input for new category */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <Input 
                  type="text" 
                  value={newCategory.name} 
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })} 
                  placeholder="Enter category name"
                />
                <Button 
                  onClick={() => {
                    if (newCategory.name.trim() !== '') {
                      const updatedCategories = [...newEvent.categories, newCategory.name.trim()];
                      setNewEvent({ ...newEvent, categories: updatedCategories });
                      setNewCategory({ name: '', order: 1 });
                    }
                  }}
                >
                  Add Category
                </Button>
              </div>
              
              {/* Display existing categories for this event */}
              {newEvent.categories.length > 0 && (
                <div>
                  <h4>Current Categories:</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {newEvent.categories.map((category, index) => (
                      <div 
                        key={index} 
                        style={{ 
                          background: 'rgba(255,215,0,0.2)', 
                          padding: '5px 10px', 
                          borderRadius: '15px', 
                          display: 'flex', 
                          alignItems: 'center' 
                        }}
                      >
                        {category}
                        <button 
                          onClick={() => {
                            const updatedCategories = newEvent.categories.filter((_, i) => i !== index);
                            setNewEvent({ ...newEvent, categories: updatedCategories });
                          }}
                          style={{ 
                            background: 'none', 
                            border: 'none', 
                            color: 'white', 
                            marginLeft: '5px', 
                            cursor: 'pointer' 
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </FormGroup>
            
            <Button onClick={() => {
              setEvents([...events, newEvent]);
              saveToLocalStorage('events', [...events, newEvent]);
              setNewEvent({ name: '', categories: [], color: { r: 106, g: 17, b: 203 } });
            }}>Add Event</Button>
          </FormContainer>
          <Table>
            <thead>
              <tr>
                <Th>Name</Th>
                <Th>Categories</Th>
                <Th>Color</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, index) => (
                <Tr key={index}>
                  <Td>{event.name}</Td>
                  <Td>
                    {event.categories.map((category, catIndex) => (
                      <span key={catIndex} style={{ display: 'inline-block', background: 'rgba(255,215,0,0.2)', padding: '2px 8px', borderRadius: '10px', marginRight: '5px', marginBottom: '3px' }}>
                        {category}
                      </span>
                    ))}
                  </Td>
                  <Td><ColorPreview r={event.color.r} g={event.color.g} b={event.color.b} /></Td>
                  <Td>
                    <Button onClick={() => {
                      setSelectedEvent(index);
                      setNewEvent(event);
                    }}>Edit</Button>
                    <Button onClick={() => {
                      const updatedEvents = events.filter((_, i) => i !== index);
                      setEvents(updatedEvents);
                      saveToLocalStorage('events', updatedEvents);
                    }}>Delete</Button>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
      {activeTab === 'teams' && (
        <div>
          <FormContainer>
            <FormTitle>Add New Team</FormTitle>
            <FormGroup>
              <Label>Event</Label>
              <Select value={newTeam.event} onChange={(e) => setNewTeam({ ...newTeam, event: e.target.value })}>
                <option value="">Select Event</option>
                {events.map((event, index) => (
                  <option key={index} value={event.name}>{event.name}</option>
                ))}
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>Name</Label>
              <Input type="text" value={newTeam.name} onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })} />
            </FormGroup>
            <FormGroup>
              <Label>Color</Label>
              <Input type="color" value={newTeam.color} onChange={(e) => setNewTeam({ ...newTeam, color: e.target.value })} />
            </FormGroup>
            
            {/* Team Leader */}
            <FormGroup>
              <Label>Team Leader Name</Label>
              <Input 
                type="text" 
                value={newTeam.teamLeader?.name || ''} 
                onChange={(e) => setNewTeam({ 
                  ...newTeam, 
                  teamLeader: { 
                    ...newTeam.teamLeader, 
                    name: e.target.value 
                  } 
                })} 
              />
              <Label>Team Leader Photo</Label>
              <Input 
                type="file" 
                accept="image/*" 
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setNewTeam({ 
                        ...newTeam, 
                        teamLeader: { 
                          ...newTeam.teamLeader, 
                          photo: event.target.result 
                        } 
                      });
                    };
                    reader.readAsDataURL(file);
                  }
                }} 
              />
              {newTeam.teamLeader?.photo && (
                <div style={{ marginTop: '10px' }}>
                  <img src={newTeam.teamLeader.photo} alt="Team Leader Preview" style={{ maxWidth: '100px', maxHeight: '100px', borderRadius: '50%' }} />
                </div>
              )}
            </FormGroup>
            
            {/* Assistant Leader */}
            <FormGroup>
              <Label>Assistant Leader Name</Label>
              <Input 
                type="text" 
                value={newTeam.assistantLeader?.name || ''} 
                onChange={(e) => setNewTeam({ 
                  ...newTeam, 
                  assistantLeader: { 
                    ...newTeam.assistantLeader, 
                    name: e.target.value 
                  } 
                })} 
              />
              <Label>Assistant Leader Photo</Label>
              <Input 
                type="file" 
                accept="image/*" 
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setNewTeam({ 
                        ...newTeam, 
                        assistantLeader: { 
                          ...newTeam.assistantLeader, 
                          photo: event.target.result 
                        } 
                      });
                    };
                    reader.readAsDataURL(file);
                  }
                }} 
              />
              {newTeam.assistantLeader?.photo && (
                <div style={{ marginTop: '10px' }}>
                  <img src={newTeam.assistantLeader.photo} alt="Assistant Leader Preview" style={{ maxWidth: '100px', maxHeight: '100px', borderRadius: '50%' }} />
                </div>
              )}
            </FormGroup>
            
            {/* Manager */}
            <FormGroup>
              <Label>Manager Name</Label>
              <Input 
                type="text" 
                value={newTeam.manager?.name || ''} 
                onChange={(e) => setNewTeam({ 
                  ...newTeam, 
                  manager: { 
                    ...newTeam.manager, 
                    name: e.target.value 
                  } 
                })} 
              />
              <Label>Manager Photo</Label>
              <Input 
                type="file" 
                accept="image/*" 
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setNewTeam({ 
                        ...newTeam, 
                        manager: { 
                          ...newTeam.manager, 
                          photo: event.target.result 
                        } 
                      });
                    };
                    reader.readAsDataURL(file);
                  }
                }} 
              />
              {newTeam.manager?.photo && (
                <div style={{ marginTop: '10px' }}>
                  <img src={newTeam.manager.photo} alt="Manager Preview" style={{ maxWidth: '100px', maxHeight: '100px', borderRadius: '50%' }} />
                </div>
              )}
            </FormGroup>
            
            <Button 
              onClick={() => {
                if (!newTeam.event) {
                  alert('Please select an event before adding a team');
                  return;
                }
                if (!newTeam.name.trim()) {
                  alert('Please enter a team name');
                  return;
                }
                setTeams([...teams, newTeam]);
                saveToLocalStorage('teams', [...teams, newTeam]);
                setNewTeam({ 
                  name: '', 
                  event: '',
                  color: '#FF5733',
                  teamLeader: { name: '', photo: null },
                  assistantLeader: { name: '', photo: null },
                  manager: { name: '', photo: null }
                });
              }}
              disabled={!newTeam.event}
            >
              Add Team
            </Button>
          </FormContainer>
          <Table>
            <thead>
              <tr>
                <Th>Event</Th>
                <Th>Name</Th>
                <Th>Color</Th>
                <Th>Team Leader</Th>
                <Th>Assistant Leader</Th>
                <Th>Manager</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team, index) => (
                <Tr key={index}>
                  <Td>{team.event || 'N/A'}</Td>
                  <Td>{team.name}</Td>
                  <Td><ColorPreview r={parseInt(team.color.slice(1, 3), 16)} g={parseInt(team.color.slice(3, 5), 16)} b={parseInt(team.color.slice(5, 7), 16)} /></Td>
                  <Td>
                    {team.teamLeader?.name && (
                      <div>
                        <div>{team.teamLeader.name}</div>
                        {team.teamLeader.photo && (
                          <img src={team.teamLeader.photo} alt={team.teamLeader.name} style={{ width: '30px', height: '30px', borderRadius: '50%', marginTop: '5px' }} />
                        )}
                      </div>
                    )}
                  </Td>
                  <Td>
                    {team.assistantLeader?.name && (
                      <div>
                        <div>{team.assistantLeader.name}</div>
                        {team.assistantLeader.photo && (
                          <img src={team.assistantLeader.photo} alt={team.assistantLeader.name} style={{ width: '30px', height: '30px', borderRadius: '50%', marginTop: '5px' }} />
                        )}
                      </div>
                    )}
                  </Td>
                  <Td>
                    {team.manager?.name && (
                      <div>
                        <div>{team.manager.name}</div>
                        {team.manager.photo && (
                          <img src={team.manager.photo} alt={team.manager.name} style={{ width: '30px', height: '30px', borderRadius: '50%', marginTop: '5px' }} />
                        )}
                      </div>
                    )}
                  </Td>
                  <Td>
                    <Button onClick={() => {
                      setSelectedEvent(index);
                      // Ensure the team object has all the required properties
                      const teamWithDefaults = {
                        name: team.name || '',
                        event: team.event || '',
                        color: team.color || '#FF5733',
                        teamLeader: team.teamLeader || { name: '', photo: null },
                        assistantLeader: team.assistantLeader || { name: '', photo: null },
                        manager: team.manager || { name: '', photo: null }
                      };
                      setNewTeam(teamWithDefaults);
                    }}>Edit</Button>
                    <Button onClick={() => {
                      const updatedTeams = teams.filter((_, i) => i !== index);
                      setTeams(updatedTeams);
                      saveToLocalStorage('teams', updatedTeams);
                    }}>Delete</Button>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {activeTab === 'students' && (
        <div>
          <FormContainer>
            <FormTitle>Add New Student</FormTitle>
            <FormGroup>
              <Label>Name</Label>
              <Input type="text" value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} />
            </FormGroup>
            <FormGroup>
              <Label>Chest Number</Label>
              <Input type="text" value={newStudent.chestNumber} onChange={(e) => setNewStudent({ ...newStudent, chestNumber: e.target.value })} />
            </FormGroup>
            <FormGroup>
              <Label>Event</Label>
              <Select value={newStudent.event} onChange={(e) => setNewStudent({ ...newStudent, event: e.target.value })}>
                <option value="">Select Event</option>
                {events.map((event, index) => (
                  <option key={index} value={event.name}>{event.name}</option>
                ))}
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>Team</Label>
              <Select value={newStudent.team} onChange={(e) => setNewStudent({ ...newStudent, team: e.target.value })}>
                <option value="">Select Team</option>
                {teams.map((team, index) => (
                  <option key={index} value={team.name}>{team.name}</option>
                ))}
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>Category</Label>
              <Select value={newStudent.category} onChange={(e) => setNewStudent({ ...newStudent, category: e.target.value })}>
                <option value="">Select Category</option>
                {/* Get categories from the selected event */}
                {newStudent.event && events.find(event => event.name === newStudent.event)?.categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>Photo</Label>
              <Input type="file" accept="image/*" onChange={handlePhotoUpload} />
              {newStudent.photo && (
                <div style={{ marginTop: '10px' }}>
                  <img src={newStudent.photo} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px' }} />
                </div>
              )}
            </FormGroup>
            <Button onClick={() => {
              if (newStudent.name.trim() === '' || newStudent.chestNumber.trim() === '') {
                alert('Please fill in all required fields');
                return;
              }
              
              const student = {
                id: students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1,
                name: newStudent.name,
                chestNumber: newStudent.chestNumber,
                team: newStudent.team,
                category: newStudent.category,
                photo: newStudent.photo || null
              };
              
              const updatedStudents = [...students, student];
              setStudents(updatedStudents);
              const saveResult = saveToLocalStorage('students', updatedStudents);
              console.log('Student creation save result:', saveResult);
              if (!saveResult) {
                console.error('Failed to save new student to localStorage');
              }
              
              setNewStudent({ name: '', chestNumber: '', team: '', category: '', photo: null });
            }}>Add Student</Button>
          </FormContainer>
          <Table>
            <thead>
              <tr>
                <Th>Name</Th>
                <Th>Chest Number</Th>
                <Th>Event</Th>
                <Th>Team</Th>
                <Th>Category</Th>
                <Th>Photo</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <Tr key={index}>
                  <Td>{student.name}</Td>
                  <Td>{student.chestNumber}</Td>
                  <Td>{student.event}</Td>
                  <Td>{student.team}</Td>
                  <Td>{student.category}</Td>
                  <Td>{student.photo ? <img src={student.photo} alt={student.name} style={{ width: '50px', height: '50px' }} /> : 'No Photo'}</Td>
                  <Td>
                    <Button onClick={() => {
                      setNewStudent({
                        name: student.name,
                        chestNumber: student.chestNumber,
                        team: student.team,
                        category: student.category,
                        photo: student.photo || null
                      });
                      setSelectedEvent(index);
                    }}>Edit</Button>
                    <Button onClick={() => {
                      const updatedStudents = students.filter((_, i) => i !== index);
                      setStudents(updatedStudents);
                      saveToLocalStorage('students', updatedStudents);
                    }}>Delete</Button>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
      {activeTab === 'programs' && (
        <div>
          <FormContainer>
            <FormTitle>Add New Program</FormTitle>
            <FormGroup>
              <Label>Event</Label>
              <Select value={newProgram.event} onChange={(e) => setNewProgram({ ...newProgram, event: e.target.value, category: '' })}>
                <option value="">Select Event</option>
                {events.map((event, index) => (
                  <option key={index} value={event.name}>{event.name}</option>
                ))}
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>Category</Label>
              <Select 
                value={newProgram.category} 
                onChange={(e) => setNewProgram({ ...newProgram, category: e.target.value })}
                disabled={!newProgram.event}
              >
                <option value="">Select Category</option>
                {newProgram.event && events.find(event => event.name === newProgram.event)?.categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>Name</Label>
              <Input type="text" value={newProgram.name} onChange={(e) => setNewProgram({ ...newProgram, name: e.target.value })} />
            </FormGroup>
            <FormGroup>
              <Label>Type</Label>
              <Select value={newProgram.type} onChange={(e) => setNewProgram({ ...newProgram, type: e.target.value })}>
                <option value="Individual">Individual</option>
                <option value="Team">Team</option>
              </Select>
            </FormGroup>
            <Button onClick={() => {
              if (newProgram.event.trim() === '' || newProgram.category.trim() === '' || newProgram.name.trim() === '') {
                alert('Please fill in all required fields');
                return;
              }
              setPrograms([...programs, newProgram]);
              saveToLocalStorage('programs', [...programs, newProgram]);
              setNewProgram({ name: '', event: '', category: '', type: 'Individual' });
            }}>Add Program</Button>
          </FormContainer>
          <Table>
            <thead>
              <tr>
                <Th>Event</Th>
                <Th>Category</Th>
                <Th>Name</Th>
                <Th>Type</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {programs.map((program, index) => (
                <Tr key={index}>
                  <Td>{program.event}</Td>
                  <Td>{program.category}</Td>
                  <Td>{program.name}</Td>
                  <Td>{program.type}</Td>
                  <Td>
                    <Button onClick={() => {
                      setSelectedEvent(index);
                      setNewProgram(program);
                    }}>Edit</Button>
                    <Button onClick={() => {
                      const updatedPrograms = programs.filter((_, i) => i !== index);
                      setPrograms(updatedPrograms);
                      saveToLocalStorage('programs', updatedPrograms);
                    }}>Delete</Button>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
      {activeTab === 'results' && (
        <div>
          <FormContainer>
            <FormTitle>Add New Result</FormTitle>
            <FormGroup>
              <Label>Event</Label>
              <Select value={newResult.event} onChange={(e) => setNewResult({ ...newResult, event: e.target.value, program: '', category: '', participants: [] })}>
                <option value="">Select Event</option>
                {events.map((event, index) => (
                  <option key={index} value={event.name}>{event.name}</option>
                ))}
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>Program</Label>
              <Select 
                value={newResult.program} 
                onChange={(e) => setNewResult({ ...newResult, program: e.target.value, category: '', participants: [] })}
                disabled={!newResult.event}
              >
                <option value="">Select Program</option>
                {newResult.event && programs.filter(program => program.event === newResult.event).map((program, index) => (
                  <option key={index} value={program.name}>{program.name}</option>
                ))}
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>Category</Label>
              <Select 
                value={newResult.category} 
                onChange={(e) => setNewResult({ ...newResult, category: e.target.value, participants: [] })}
                disabled={!newResult.program}
              >
                <option value="">Select Category</option>
                {newResult.program && events.find(event => event.name === newResult.event)?.categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>Participants</Label>
              <p>Add participants to this result:</p>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <Input 
                  type="text" 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  placeholder="Search by chest number"
                />
                <Button onClick={handleSearchByChestNumber}>Search</Button>
              </div>
              {searchResults.length > 0 && (
                <div>
                  <h4>Search Results:</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {searchResults.map((student, index) => (
                      <div key={index} style={{ background: 'rgba(255,215,0,0.2)', padding: '5px 10px', borderRadius: '15px', display: 'flex', alignItems: 'center' }}>
                        {student.name} ({student.chestNumber})
                        <Button onClick={() => handleAddStudentToParticipants(student)}>Add</Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {newResult.participants.length > 0 && (
                <div>
                  <h4>Current Participants:</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {newResult.participants.map((participant, index) => (
                      <div key={index} style={{ background: 'rgba(255,215,0,0.2)', padding: '5px 10px', borderRadius: '15px', display: 'flex', alignItems: 'center' }}>
                        {participant.name}
                        <Input 
                          type="text" 
                          value={participant.position} 
                          onChange={(e) => {
                            const updatedParticipants = [...newResult.participants];
                            updatedParticipants[index].position = e.target.value;
                            setNewResult({ ...newResult, participants: updatedParticipants });
                          }} 
                          placeholder="Position"
                        />
                        <Input 
                          type="text" 
                          value={participant.grade} 
                          onChange={(e) => {
                            const updatedParticipants = [...newResult.participants];
                            updatedParticipants[index].grade = e.target.value;
                            setNewResult({ ...newResult, participants: updatedParticipants });
                          }} 
                          placeholder="Grade"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </FormGroup>
            <Button onClick={() => {
              if (newResult.event.trim() === '' || newResult.program.trim() === '' || newResult.category.trim() === '' || newResult.participants.length === 0) {
                alert('Please fill in all required fields');
                return;
              }
              setResults([...results, newResult]);
              saveToLocalStorage('results', [...results, newResult]);
              setNewResult({ event: '', program: '', category: '', participants: [] });
              setSearchTerm('');
              setSearchResults([]);
            }}>Add Result</Button>
          </FormContainer>
          <Table>
            <thead>
              <tr>
                <Th>Event</Th>
                <Th>Program</Th>
                <Th>Category</Th>
                <Th>Participants</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <Tr key={index}>
                  <Td>{result.event}</Td>
                  <Td>{result.program}</Td>
                  <Td>{result.category}</Td>
                  <Td>
                    {result.participants.map((participant, partIndex) => (
                      <div key={partIndex} style={{ background: 'rgba(255,215,0,0.2)', padding: '5px 10px', borderRadius: '15px', display: 'flex', alignItems: 'center' }}>
                        {participant.name} - {getPositionText(participant.position)} - {participant.grade}
                      </div>
                    ))}
                  </Td>
                  <Td>
                    <Button onClick={() => {
                      setSelectedEvent(index);
                      setNewResult(result);
                    }}>Edit</Button>
                    <Button onClick={() => {
                      const updatedResults = results.filter((_, i) => i !== index);
                      setResults(updatedResults);
                      saveToLocalStorage('results', updatedResults);
                    }}>Delete</Button>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
      {activeTab === 'points' && (
        <div>
          <FormContainer>
            <FormTitle>Configure Points</FormTitle>
            <FormGroup>
              <Label>Default Points</Label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Input 
                  type="number" 
                  value={points.gold} 
                  onChange={(e) => setPoints({ ...points, gold: parseInt(e.target.value) })} 
                  placeholder="Gold"
                />
                <Input 
                  type="number" 
                  value={points.silver} 
                  onChange={(e) => setPoints({ ...points, silver: parseInt(e.target.value) })} 
                  placeholder="Silver"
                />
                <Input 
                  type="number" 
                  value={points.bronze} 
                  onChange={(e) => setPoints({ ...points, bronze: parseInt(e.target.value) })} 
                  placeholder="Bronze"
                />
              </div>
            </FormGroup>
            <FormGroup>
              <Label>Category-specific Points</Label>
              <p>Configure points for specific categories:</p>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <Select 
                  value={selectedCategoryForPoints} 
                  onChange={(e) => setSelectedCategoryForPoints(e.target.value)}
                >
                  <option value="">Select Category</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category.name}>{category.name}</option>
                  ))}
                </Select>
                <Input 
                  type="number" 
                  value={categoryPoints[selectedCategoryForPoints]?.gold || ''} 
                  onChange={(e) => {
                    const updatedCategoryPoints = { ...categoryPoints };
                    updatedCategoryPoints[selectedCategoryForPoints] = {
                      ...updatedCategoryPoints[selectedCategoryForPoints],
                      gold: parseInt(e.target.value)
                    };
                    setCategoryPoints(updatedCategoryPoints);
                  }} 
                  placeholder="Gold"
                />
                <Input 
                  type="number" 
                  value={categoryPoints[selectedCategoryForPoints]?.silver || ''} 
                  onChange={(e) => {
                    const updatedCategoryPoints = { ...categoryPoints };
                    updatedCategoryPoints[selectedCategoryForPoints] = {
                      ...updatedCategoryPoints[selectedCategoryForPoints],
                      silver: parseInt(e.target.value)
                    };
                    setCategoryPoints(updatedCategoryPoints);
                  }} 
                  placeholder="Silver"
                />
                <Input 
                  type="number" 
                  value={categoryPoints[selectedCategoryForPoints]?.bronze || ''} 
                  onChange={(e) => {
                    const updatedCategoryPoints = { ...categoryPoints };
                    updatedCategoryPoints[selectedCategoryForPoints] = {
                      ...updatedCategoryPoints[selectedCategoryForPoints],
                      bronze: parseInt(e.target.value)
                    };
                    setCategoryPoints(updatedCategoryPoints);
                  }} 
                  placeholder="Bronze"
                />
              </div>
            </FormGroup>
            <FormGroup>
              <Label>Grade-specific Points</Label>
              <p>Configure points for specific grades:</p>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <Select 
                  value={selectedGradeForPoints} 
                  onChange={(e) => setSelectedGradeForPoints(e.target.value)}
                >
                  <option value="">Select Grade</option>
                  {availableGrades.map((grade, index) => (
                    <option key={index} value={grade}>{grade}</option>
                  ))}
                </Select>
                <Input 
                  type="number" 
                  value={gradePoints[`${selectedCategoryForPoints}-${selectedGradeForPoints}`]?.gold || ''} 
                  onChange={(e) => {
                    const updatedGradePoints = { ...gradePoints };
                    updatedGradePoints[`${selectedCategoryForPoints}-${selectedGradeForPoints}`] = {
                      ...updatedGradePoints[`${selectedCategoryForPoints}-${selectedGradeForPoints}`],
                      gold: parseInt(e.target.value)
                    };
                    setGradePoints(updatedGradePoints);
                  }} 
                  placeholder="Gold"
                />
                <Input 
                  type="number" 
                  value={gradePoints[`${selectedCategoryForPoints}-${selectedGradeForPoints}`]?.silver || ''} 
                  onChange={(e) => {
                    const updatedGradePoints = { ...gradePoints };
                    updatedGradePoints[`${selectedCategoryForPoints}-${selectedGradeForPoints}`] = {
                      ...updatedGradePoints[`${selectedCategoryForPoints}-${selectedGradeForPoints}`],
                      silver: parseInt(e.target.value)
                    };
                    setGradePoints(updatedGradePoints);
                  }} 
                  placeholder="Silver"
                />
                <Input 
                  type="number" 
                  value={gradePoints[`${selectedCategoryForPoints}-${selectedGradeForPoints}`]?.bronze || ''} 
                  onChange={(e) => {
                    const updatedGradePoints = { ...gradePoints };
                    updatedGradePoints[`${selectedCategoryForPoints}-${selectedGradeForPoints}`] = {
                      ...updatedGradePoints[`${selectedCategoryForPoints}-${selectedGradeForPoints}`],
                      bronze: parseInt(e.target.value)
                    };
                    setGradePoints(updatedGradePoints);
                  }} 
                  placeholder="Bronze"
                />
              </div>
            </FormGroup>
            <FormGroup>
              <Label>Available Grades</Label>
              <p>Configure available grades:</p>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <Input 
                  type="text" 
                  value={newGrade} 
                  onChange={(e) => setNewGrade(e.target.value)} 
                  placeholder="Enter new grade"
                />
                <Button onClick={() => {
                  if (newGrade.trim() !== '') {
                    const updatedAvailableGrades = [...availableGrades, newGrade.trim()];
                    setAvailableGrades(updatedAvailableGrades);
                    saveToLocalStorage('availableGrades', updatedAvailableGrades);
                    setNewGrade('');
                  }
                }}>Add Grade</Button>
              </div>
              {availableGrades.length > 0 && (
                <div>
                  <h4>Current Grades:</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {availableGrades.map((grade, index) => (
                      <div key={index} style={{ background: 'rgba(255,215,0,0.2)', padding: '5px 10px', borderRadius: '15px', display: 'flex', alignItems: 'center' }}>
                        {grade}
                        <button 
                          onClick={() => {
                            const updatedAvailableGrades = availableGrades.filter((_, i) => i !== index);
                            setAvailableGrades(updatedAvailableGrades);
                            saveToLocalStorage('availableGrades', updatedAvailableGrades);
                          }}
                          style={{ 
                            background: 'none', 
                            border: 'none', 
                            color: 'white', 
                            marginLeft: '5px', 
                            cursor: 'pointer' 
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </FormGroup>
            <FormGroup>
              <Label>Pre-configure Points for New Grade</Label>
              <p>Set default points for a new grade across all categories:</p>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <Input 
                  type="text" 
                  value={newGrade} 
                  onChange={(e) => setNewGrade(e.target.value)} 
                  placeholder="Enter new grade"
                />
                <Input 
                  type="number" 
                  value={newGradePoints.gold} 
                  onChange={(e) => setNewGradePoints({ ...newGradePoints, gold: parseInt(e.target.value) })} 
                  placeholder="Gold"
                />
                <Input 
                  type="number" 
                  value={newGradePoints.silver} 
                  onChange={(e) => setNewGradePoints({ ...newGradePoints, silver: parseInt(e.target.value) })} 
                  placeholder="Silver"
                />
                <Input 
                  type="number" 
                  value={newGradePoints.bronze} 
                  onChange={(e) => setNewGradePoints({ ...newGradePoints, bronze: parseInt(e.target.value) })} 
                  placeholder="Bronze"
                />
                <Button onClick={() => {
                  if (newGrade.trim() !== '') {
                    preConfigureGradePoints(newGrade.trim(), newGradePoints);
                    setNewGrade('');
                    setNewGradePoints({ gold: 3, silver: 2, bronze: 1 });
                  }
                }}>Pre-configure</Button>
              </div>
            </FormGroup>
            <FormGroup>
              <Label>Batch Configure Points for Categories</Label>
              <p>Select categories to apply points configuration:</p>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <Select 
                  value={selectedCategoriesForBatch} 
                  onChange={(e) => setSelectedCategoriesForBatch(Array.from(e.target.selectedOptions, option => option.value))}
                  multiple
                >
                  {categories.map((category, index) => (
                    <option key={index} value={category.name}>{category.name}</option>
                  ))}
                </Select>
                <Input 
                  type="number" 
                  value={newGradePoints.gold} 
                  onChange={(e) => setNewGradePoints({ ...newGradePoints, gold: parseInt(e.target.value) })} 
                  placeholder="Gold"
                />
                <Input 
                  type="number" 
                  value={newGradePoints.silver} 
                  onChange={(e) => setNewGradePoints({ ...newGradePoints, silver: parseInt(e.target.value) })} 
                  placeholder="Silver"
                />
                <Input 
                  type="number" 
                  value={newGradePoints.bronze} 
                  onChange={(e) => setNewGradePoints({ ...newGradePoints, bronze: parseInt(e.target.value) })} 
                  placeholder="Bronze"
                />
                <Button onClick={() => {
                  if (selectedCategoriesForBatch.length > 0) {
                    preConfigureGradePoints(newGrade, newGradePoints);
                    setNewGrade('');
                    setNewGradePoints({ gold: 3, silver: 2, bronze: 1 });
                  }
                }}>Batch Configure</Button>
              </div>
            </FormGroup>
            <FormGroup>
              <Label>Reset All Points to New System</Label>
              <Button onClick={resetAllPointsToNewSystem}>Reset Points</Button>
            </FormGroup>
          </FormContainer>
        </div>
      )}
      {activeTab === 'teamManagers' && (
        <div>
          <FormContainer>
            <FormTitle>Manage Team Managers</FormTitle>
            <FormGroup>
              <Label>Username</Label>
              <Input type="text" value={newTeamManager.username} onChange={(e) => setNewTeamManager({ ...newTeamManager, username: e.target.value })} />
            </FormGroup>
            <FormGroup>
              <Label>Password</Label>
              <Input type="password" value={newTeamManager.password} onChange={(e) => setNewTeamManager({ ...newTeamManager, password: e.target.value })} />
            </FormGroup>
            <FormGroup>
              <Label>Event</Label>
              <Select value={newTeamManager.event} onChange={(e) => setNewTeamManager({ ...newTeamManager, event: e.target.value })}>
                <option value="">Select Event</option>
                {events.map((event, index) => (
                  <option key={index} value={event.name}>{event.name}</option>
                ))}
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>Team</Label>
              <Select value={newTeamManager.team} onChange={(e) => setNewTeamManager({ ...newTeamManager, team: e.target.value })}>
                <option value="">Select Team</option>
                {teams.map((team, index) => (
                  <option key={index} value={team.name}>{team.name}</option>
                ))}
              </Select>
            </FormGroup>
            <Button onClick={handleCreateTeamManager}>Create Team Manager</Button>
            <Button onClick={handleUpdateTeamManager}>Update Team Manager</Button>
          </FormContainer>
          <Table>
            <thead>
              <tr>
                <Th>Username</Th>
                <Th>Event</Th>
                <Th>Team</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {teamManagers.map((manager, index) => (
                <Tr key={index}>
                  <Td>{manager.username}</Td>
                  <Td>{manager.event}</Td>
                  <Td>{manager.team}</Td>
                  <Td>
                    <Button onClick={() => {
                      setEditingTeamManager(manager);
                      setNewTeamManager(manager);
                    }}>Edit</Button>
                    <Button onClick={() => handleDeleteTeamManager(manager.username)}>Delete</Button>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
      {activeTab === 'settings' && (
        <div>
          <FormContainer>
            <FormTitle>Settings</FormTitle>
            <FormGroup>
              <Label>App Title</Label>
              <Input type="text" value={appTitle} onChange={(e) => setAppTitle(e.target.value)} />
            </FormGroup>
            <FormGroup>
              <Label>Primary Color</Label>
              <Input type="color" value={appTheme.primary} onChange={(e) => setAppTheme({ ...appTheme, primary: e.target.value })} />
            </FormGroup>
            <FormGroup>
              <Label>Secondary Color</Label>
              <Input type="color" value={appTheme.secondary} onChange={(e) => setAppTheme({ ...appTheme, secondary: e.target.value })} />
            </FormGroup>
            <FormGroup>
              <Label>Accent Color</Label>
              <Input type="color" value={appTheme.accent} onChange={(e) => setAppTheme({ ...appTheme, accent: e.target.value })} />
            </FormGroup>
            <FormGroup>
              <Label>Logo Image</Label>
              <Input type="file" accept="image/*" onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    setLogoImage(event.target.result);
                  };
                  reader.readAsDataURL(file);
                }
              }} />
              {logoImage && (
                <div style={{ marginTop: '10px' }}>
                  <img src={logoImage} alt="Logo Preview" style={{ maxWidth: '200px', maxHeight: '200px' }} />
                </div>
              )}
            </FormGroup>
            <FormGroup>
              <Label>Admin Credentials</Label>
              <Input 
                type="password" 
                value={currentAdminPassword} 
                onChange={(e) => setCurrentAdminPassword(e.target.value)} 
                placeholder="Current Password"
              />
              <Input 
                type="password" 
                value={newAdminPassword} 
                onChange={(e) => setNewAdminPassword(e.target.value)} 
                placeholder="New Password"
              />
              <Input 
                type="password" 
                value={confirmAdminPassword} 
                onChange={(e) => setConfirmAdminPassword(e.target.value)} 
                placeholder="Confirm New Password"
              />
              <Button onClick={handleAdminCredentialsChange}>Change Credentials</Button>
            </FormGroup>
            
            {/* Gallery Management */}
            <FormGroup>
              <Label>Gallery Images</Label>
              <p>Add images to the public gallery (max 10 images)</p>
              
              {/* Upload new image */}
              <div style={{ marginBottom: '15px' }}>
                <Input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleGalleryImageUpload}
                />
              </div>
              
              {/* Display uploaded images */}
              {galleryImages.length > 0 && (
                <div>
                  <h4>Current Gallery Images:</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
                    {galleryImages.map((image, index) => (
                      <div key={index} style={{ position: 'relative', width: '100px', height: '100px' }}>
                        <img 
                          src={image} 
                          alt={`Gallery ${index + 1}`} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '5px' }} 
                        />
                        <button 
                          onClick={() => removeGalleryImage(index)}
                          style={{ 
                            position: 'absolute', 
                            top: '-8px', 
                            right: '-8px', 
                            background: '#ff4757', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '50%', 
                            width: '20px', 
                            height: '20px', 
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <Button 
                    onClick={saveGalleryImages}
                    style={{ marginTop: '10px' }}
                  >
                    Save Gallery Images
                  </Button>
                </div>
              )}
            </FormGroup>
            
            {/* Reset to Default Button */}
              </Select>
            </FormGroup>
            <Button 
              onClick={() => {
                if (!newProgram.event) {
                  alert('Please select an event before adding a program');
                  return;
                }
                if (!newProgram.category) {
                  alert('Please select a category for the program');
                  return;
                }
                if (!newProgram.name.trim()) {
                  alert('Please enter a program name');
                  return;
                }
                setPrograms([...programs, newProgram]);
                saveToLocalStorage('programs', [...programs, newProgram]);
                setNewProgram({ name: '', event: '', category: '', type: 'Individual' });
              }}
              disabled={!newProgram.event || !newProgram.category}
            >
              Add Program
            </Button>
          </FormContainer>
          <Table>
            <thead>
              <tr>
                <Th>Event</Th>
                <Th>Category</Th>
                <Th>Name</Th>
                <Th>Type</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {programs.map((program, index) => (
                <Tr key={index}>
                  <Td>{program.event || 'N/A'}</Td>
                  <Td>{program.category || 'N/A'}</Td>
                  <Td>{program.name}</Td>
                  <Td>{program.type}</Td>
                  <Td>
                    <Button onClick={() => {
                      setSelectedEvent(index);
                      // Ensure the program object has all the required properties
                      const programWithDefaults = {
                        name: program.name || '',
                        event: program.event || '',
                        category: program.category || '',
                        type: program.type || 'Individual'
                      };
                      setNewProgram(programWithDefaults);
                    }}>Edit</Button>
                    <Button onClick={() => {
                      const updatedPrograms = programs.filter((_, i) => i !== index);
                      setPrograms(updatedPrograms);
                      saveToLocalStorage('programs', updatedPrograms);
                    }}>Delete</Button>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
      {activeTab === 'results' && (
        <div>
          <FormContainer>
            <FormTitle>Add New Result</FormTitle>
            <FormGroup>
              <Label>Event</Label>
              <Select value={newResult.event} onChange={(e) => setNewResult({ ...newResult, event: e.target.value, category: '' })}>
                <option value="">Select Event</option>
                {events.map((event, index) => (
                  <option key={index} value={event.name}>{event.name}</option>
                ))}
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>Program</Label>
              <Select value={newResult.program} onChange={(e) => setNewResult({ ...newResult, program: e.target.value })}>
                <option value="">Select Program</option>
                {programs.map((program, index) => (
                  <option key={index} value={program.name}>{program.name}</option>
                ))}
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>Category</Label>
              <Select 
                value={newResult.category} 
                onChange={(e) => setNewResult({ ...newResult, category: e.target.value })}
                disabled={!newResult.event}
              >
                <option value="">Select Category</option>
                {newResult.event && events.find(event => event.name === newResult.event)?.categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>Participants</Label>
              <div>
                {newResult.participants.map((participant, index) => (
                  <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <Input 
                        type="text" 
                        value={participant.name} 
                        onChange={(e) => {
                          const updatedParticipants = [...newResult.participants];
                          updatedParticipants[index].name = e.target.value;
                          setNewResult({ ...newResult, participants: updatedParticipants });
                        }} 
                        placeholder="Participant name or chest number"
                      />
                      {/* Display student info if found by chest number */}
                      {participant.name && (
                        <div style={{ fontSize: '0.9em', color: 'gold', marginTop: '5px' }}>
                          {(() => {
                            const student = students.find(s => s.chestNumber === participant.name);
                            return student ? `${student.name} - ${student.team}` : '';
                          })()}
                        </div>
                      )}
                    </div>
                    <div>
                      <Select 
                        value={participant.position} 
                        onChange={(e) => {
                          const updatedParticipants = [...newResult.participants];
                          updatedParticipants[index].position = e.target.value;
                          setNewResult({ ...newResult, participants: updatedParticipants });
                        }}
                      >
                        <option value="">Select Place</option>
                        <option value="1">1st Place</option>
                        <option value="2">2nd Place</option>
                        <option value="3">3rd Place</option>
                      </Select>
                    </div>
                    <div>
                      <Select 
                        value={participant.grade || ''} 
                        onChange={(e) => {
                          const updatedParticipants = [...newResult.participants];
                          updatedParticipants[index].grade = e.target.value;
                          setNewResult({ ...newResult, participants: updatedParticipants });
                        }}
                      >
                        <option value="">Select Grade</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                      </Select>
                    </div>
                    <Button 
                      onClick={() => {
                        // Remove participant
                        const updatedParticipants = [...newResult.participants];
                        updatedParticipants.splice(index, 1);
                        setNewResult({ ...newResult, participants: updatedParticipants });
                      }}
                      style={{ background: '#ff4757', padding: '5px 10px' }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button onClick={() => setNewResult({ ...newResult, participants: [...newResult.participants, { name: '', position: '', grade: '' }] })}>
                  Add Participant
                </Button>
              </div>
            </FormGroup>
            <Button onClick={() => {
              setResults([...results, newResult]);
              saveToLocalStorage('results', [...results, newResult]);
              setNewResult({ event: '', program: '', category: '', participants: [{ name: '', position: '', grade: '' }] });
            }}>Add Result</Button>
          </FormContainer>
          
          {/* Search Participants by Chest Number */}
          <FormContainer>
            <FormTitle>Search Participants</FormTitle>
            <FormGroup>
              <Label>Search by Chest Number</Label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Input 
                  type="text" 
                  placeholder="Enter chest number" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button onClick={handleSearchByChestNumber}>Search</Button>
              </div>
            </FormGroup>
            
            {searchResults.length > 0 && (
              <div>
                <h4>Search Results:</h4>
                <Table>
                  <thead>
                    <tr>
                      <Th>Name</Th>
                      <Th>Chest Number</Th>
                      <Th>Event</Th>
                      <Th>Team</Th>
                      <Th>Category</Th>
                      <Th>Actions</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.map((student, index) => (
                      <Tr key={index}>
                        <Td>{student.name}</Td>
                        <Td>{student.chestNumber}</Td>
                        <Td>{student.event}</Td>
                        <Td>{student.team}</Td>
                        <Td>{student.category}</Td>
                        <Td>
                          <Button 
                            onClick={() => handleAddStudentToParticipants(student)}
                            style={{ padding: '5px 10px' }}
                          >
                            Add to Participants
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </FormContainer>
          
          <Table>
            <thead>
              <tr>
                <Th>Event</Th>
                <Th>Program</Th>
                <Th>Category</Th>
                <Th>Participants</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <Tr key={index}>
                  <Td>{result.event}</Td>
                  <Td>{result.program}</Td>
                  <Td>{result.category}</Td>
                  <Td>
                    {result.participants.map(participant => {
                      // Try to find student by chest number to get full name
                      const student = students.find(s => s.chestNumber === participant.name);
                      const displayName = student ? `${student.name} (${participant.name})` : participant.name;
                      
                      const gradeDisplay = participant.grade ? ` (${participant.grade})` : '';
                      return `${displayName}${gradeDisplay} - ${getPositionText(participant.position)}`;
                    }).join(', ')}
                  </Td>
                  <Td>
                    <Button onClick={() => {
                      setSelectedEvent(index);
                      setNewResult(result);
                    }}>Edit</Button>
                    <Button onClick={() => {
                      const updatedResults = results.filter((_, i) => i !== index);
                      setResults(updatedResults);
                      saveToLocalStorage('results', updatedResults);
                    }}>Delete</Button>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
      {activeTab === 'points' && (
        <div>
          <FormContainer>
            <FormTitle>Configure Default Points</FormTitle>
            <p>These are the default points for all categories and grades (1st: 3, 2nd: 2, 3rd: 1)</p>
            <FormGroup>
              <Label>1st Position (Gold)</Label>
              <Input type="number" value={points.gold} onChange={(e) => setPoints({ ...points, gold: parseInt(e.target.value) })} />
            </FormGroup>
            <FormGroup>
              <Label>2nd Position (Silver)</Label>
              <Input type="number" value={points.silver} onChange={(e) => setPoints({ ...points, silver: parseInt(e.target.value) })} />
            </FormGroup>
            <FormGroup>
              <Label>3rd Position (Bronze)</Label>
              <Input type="number" value={points.bronze} onChange={(e) => setPoints({ ...points, bronze: parseInt(e.target.value) })} />
            </FormGroup>
            <Button onClick={() => {
              saveToLocalStorage('points', points);
            }}>Save Default Points</Button>
            <Button 
              onClick={resetAllPointsToNewSystem}
              style={{ background: '#ff4757', marginLeft: '10px' }}
            >
              Reset All Points to New System
            </Button>
          </FormContainer>
          
          {/* Display current saved points configuration */}
          <FormContainer>
            <FormTitle>Current Saved Points Configuration</FormTitle>
            <h4>Default Points</h4>
            <p>1st: {points.gold}, 2nd: {points.silver}, 3rd: {points.bronze}</p>
            
            {Object.keys(categoryPoints).length > 0 && (
              <div>
                <h4>Category-Specific Points</h4>
                {Object.entries(categoryPoints).map(([category, pointsConfig]) => (
                  <p key={category}>{category}: 1st: {pointsConfig.gold}, 2nd: {pointsConfig.silver}, 3rd: {pointsConfig.bronze}</p>
                ))}
              </div>
            )}
            
            {Object.keys(gradePoints).length > 0 && (
              <div>
                <h4>Grade-Specific Points</h4>
                {Object.entries(gradePoints).map(([key, pointsConfig]) => {
                  const [category, grade] = key.split('-');
                  return (
                    <p key={key}>{category} - Grade {grade}: 1st: {pointsConfig.gold}, 2nd: {pointsConfig.silver}, 3rd: {pointsConfig.bronze}</p>
                  );
                })}
              </div>
            )}
            
            <Button onClick={refreshData} style={{ marginTop: '10px' }}>
              Refresh Points Data
            </Button>
          </FormContainer>
          <FormContainer>
            <FormTitle>Configure Category Points</FormTitle>
            <p>Set different points for specific categories (overrides default points)</p>
            <FormGroup>
              <Label>Category</Label>
              <Select value={selectedCategoryForPoints} onChange={(e) => setSelectedCategoryForPoints(e.target.value)}>
                <option value="">Select Category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category.name}>{category.name}</option>
                ))}
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>1st Position (Gold)</Label>
              <Input type="number" value={categoryPoints[selectedCategoryForPoints]?.gold || ''} onChange={(e) => {
                setCategoryPoints({
                  ...categoryPoints,
                  [selectedCategoryForPoints]: {
                    ...categoryPoints[selectedCategoryForPoints],
                    gold: parseInt(e.target.value)
                  }
                });
              }} />
            </FormGroup>
            <FormGroup>
              <Label>2nd Position (Silver)</Label>
              <Input type="number" value={categoryPoints[selectedCategoryForPoints]?.silver || ''} onChange={(e) => {
                setCategoryPoints({
                  ...categoryPoints,
                  [selectedCategoryForPoints]: {
                    ...categoryPoints[selectedCategoryForPoints],
                    silver: parseInt(e.target.value)
                  }
                });
              }} />
            </FormGroup>
            <FormGroup>
              <Label>3rd Position (Bronze)</Label>
              <Input type="number" value={categoryPoints[selectedCategoryForPoints]?.bronze || ''} onChange={(e) => {
                setCategoryPoints({
                  ...categoryPoints,
                  [selectedCategoryForPoints]: {
                    ...categoryPoints[selectedCategoryForPoints],
                    bronze: parseInt(e.target.value)
                  }
                });
              }} />
            </FormGroup>
            <Button onClick={() => {
              saveToLocalStorage('categoryPoints', categoryPoints);
            }}>Save Category Points</Button>
          </FormContainer>
          <FormContainer>
            <FormTitle>Configure Grade Points</FormTitle>
            <p>Set different points for specific grades (overrides category and default points)</p>
            <p><strong>Example:</strong> Grade A = 5 points, Grade B = 3 points</p>
            <FormGroup>
              <Label>Grade</Label>
              <Select value={selectedGradeForPoints} onChange={(e) => setSelectedGradeForPoints(e.target.value)}>
                <option value="">Select Grade</option>
                {availableGrades.map((grade, index) => (
                  <option key={index} value={grade}>{grade}</option>
                ))}
              </Select>
            </FormGroup>
            
            {/* Category Selection for Grade Points */}
            <FormGroup>
              <Label>Categories</Label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                <Button 
                  onClick={() => {
                    if (selectedCategoriesForBatch.length === categories.length) {
                      // Deselect all
                      setSelectedCategoriesForBatch([]);
                    } else {
                      // Select all
                      setSelectedCategoriesForBatch(categories.map(cat => cat.name));
                    }
                  }}
                  style={{
                    background: selectedCategoriesForBatch.length === categories.length ? 'gold' : 'rgba(255,255,255,0.2)',
                    color: selectedCategoriesForBatch.length === categories.length ? '#333' : 'white'
                  }}
                >
                  {selectedCategoriesForBatch.length === categories.length ? 'Deselect All' : 'Select All'}
                </Button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {categories.map((category) => (
                  <label key={category.name} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={selectedCategoriesForBatch.includes(category.name)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCategoriesForBatch([...selectedCategoriesForBatch, category.name]);
                        } else {
                          setSelectedCategoriesForBatch(selectedCategoriesForBatch.filter(cat => cat !== category.name));
                        }
                      }}
                      style={{ marginRight: '5px' }}
                    />
                    {category.name}
                  </label>
                ))}
              </div>
            </FormGroup>
            
            <FormGroup>
              <Label>1st Position (Gold)</Label>
              <Input type="number" value={gradePoints[selectedGradeForPoints]?.gold || ''} onChange={(e) => {
                setGradePoints({
                  ...gradePoints,
                  [selectedGradeForPoints]: {
                    ...gradePoints[selectedGradeForPoints],
                    gold: parseInt(e.target.value)
                  }
                });
              }} />
            </FormGroup>
            <FormGroup>
              <Label>2nd Position (Silver)</Label>
              <Input type="number" value={gradePoints[selectedGradeForPoints]?.silver || ''} onChange={(e) => {
                setGradePoints({
                  ...gradePoints,
                  [selectedGradeForPoints]: {
                    ...gradePoints[selectedGradeForPoints],
                    silver: parseInt(e.target.value)
                  }
                });
              }} />
            </FormGroup>
            <FormGroup>
              <Label>3rd Position (Bronze)</Label>
              <Input type="number" value={gradePoints[selectedGradeForPoints]?.bronze || ''} onChange={(e) => {
                setGradePoints({
                  ...gradePoints,
                  [selectedGradeForPoints]: {
                    ...gradePoints[selectedGradeForPoints],
                    bronze: parseInt(e.target.value)
                  }
                });
              }} />
            </FormGroup>
            <Button 
              onClick={() => {
                // Apply grade points to all selected categories
                const updatedGradePoints = { ...gradePoints };
                selectedCategoriesForBatch.forEach(categoryName => {
                  const key = `${categoryName}-${selectedGradeForPoints}`;
                  updatedGradePoints[key] = {
                    gold: gradePoints[selectedGradeForPoints]?.gold || 0,
                    silver: gradePoints[selectedGradeForPoints]?.silver || 0,
                    bronze: gradePoints[selectedGradeForPoints]?.bronze || 0
                  };
                });
                setGradePoints(updatedGradePoints);
                saveToLocalStorage('gradePoints', updatedGradePoints);
              }}
              disabled={!selectedGradeForPoints || selectedCategoriesForBatch.length === 0}
            >
              Save Grade Points for Selected Categories
            </Button>
          </FormContainer>
          <FormContainer>
            <FormTitle>Configure Available Grades</FormTitle>
            <FormGroup>
              <Label>Grades</Label>
              <Input type="text" value={availableGrades.join(', ')} onChange={(e) => setAvailableGrades(e.target.value.split(',').map(grade => grade.trim()))} />
            </FormGroup>
            <Button onClick={() => {
              saveToLocalStorage('availableGrades', availableGrades);
            }}>Save Grades</Button>
          </FormContainer>
          <FormContainer>
            <FormTitle>Quick Configure Grade Points</FormTitle>
            <p>Quickly set grade points for multiple categories at once</p>
            <p><strong>Example:</strong> Set Grade A to 5 points for selected categories</p>
            
            {/* Category Selection for Batch Grade Points */}
            <FormGroup>
              <Label>Apply to Categories</Label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                <Button 
                  onClick={() => {
                    if (selectedCategoriesForBatch.length === categories.length) {
                      // Deselect all
                      setSelectedCategoriesForBatch([]);
                    } else {
                      // Select all
                      setSelectedCategoriesForBatch(categories.map(cat => cat.name));
                    }
                  }}
                  style={{
                    background: selectedCategoriesForBatch.length === categories.length ? 'gold' : 'rgba(255,255,255,0.2)',
                    color: selectedCategoriesForBatch.length === categories.length ? '#333' : 'white'
                  }}
                >
                  {selectedCategoriesForBatch.length === categories.length ? 'Deselect All' : 'Select All'}
                </Button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {categories.map((category) => (
                  <label key={category.name} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={selectedCategoriesForBatch.includes(category.name)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCategoriesForBatch([...selectedCategoriesForBatch, category.name]);
                        } else {
                          setSelectedCategoriesForBatch(selectedCategoriesForBatch.filter(cat => cat !== category.name));
                        }
                      }}
                      style={{ marginRight: '5px' }}
                    />
                    {category.name}
                  </label>
                ))}
              </div>
            </FormGroup>
            
            <FormGroup>
              <Label>1st Position (Gold)</Label>
              <Input type="number" value={newGradePoints.gold} onChange={(e) => setNewGradePoints({ ...newGradePoints, gold: parseInt(e.target.value) })} />
            </FormGroup>
            <FormGroup>
              <Label>2nd Position (Silver)</Label>
              <Input type="number" value={newGradePoints.silver} onChange={(e) => setNewGradePoints({ ...newGradePoints, silver: parseInt(e.target.value) })} />
            </FormGroup>
            <FormGroup>
              <Label>3rd Position (Bronze)</Label>
              <Input type="number" value={newGradePoints.bronze} onChange={(e) => setNewGradePoints({ ...newGradePoints, bronze: parseInt(e.target.value) })} />
            </FormGroup>
            <Button 
              onClick={() => {
                // Apply new grade points to all selected categories
                const updatedGradePoints = { ...gradePoints };
                selectedCategoriesForBatch.forEach(categoryName => {
                  const key = `${categoryName}-${selectedGradeForPoints}`;
                  updatedGradePoints[key] = { ...newGradePoints };
                });
                setGradePoints(updatedGradePoints);
                saveToLocalStorage('gradePoints', updatedGradePoints);
              }}
              disabled={selectedCategoriesForBatch.length === 0}
            >
              Apply New Grade Points to Selected Categories
            </Button>
          </FormContainer>
        </div>
      )}
      {activeTab === 'teamManagers' && (
        <div>
          <FormContainer>
            <FormTitle>Add New Team Manager</FormTitle>
            <FormGroup>
              <Label>Event</Label>
              <Select value={newTeamManager.event} onChange={(e) => setNewTeamManager({ ...newTeamManager, event: e.target.value })}>
                <option value="">Select Event</option>
                {events.map((event, index) => (
                  <option key={index} value={event.name}>{event.name}</option>
                ))}
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>Username</Label>
              <Input type="text" value={newTeamManager.username} onChange={(e) => setNewTeamManager({ ...newTeamManager, username: e.target.value })} />
            </FormGroup>
            <FormGroup>
              <Label>Password</Label>
              <Input type="password" value={newTeamManager.password} onChange={(e) => setNewTeamManager({ ...newTeamManager, password: e.target.value })} />
            </FormGroup>
            <FormGroup>
              <Label>Team</Label>
              <Select value={newTeamManager.team} onChange={(e) => setNewTeamManager({ ...newTeamManager, team: e.target.value })}>
                <option value="">Select Team</option>
                {teams.map((team, index) => (
                  <option key={index} value={team.name}>{team.name}</option>
                ))}
              </Select>
            </FormGroup>
            <Button 
              onClick={() => {
                if (!newTeamManager.event) {
                  alert('Please select an event before adding a team manager');
                  return;
                }
                if (!newTeamManager.username.trim() || !newTeamManager.password.trim() || !newTeamManager.team.trim()) {
                  alert('Please fill in all required fields');
                  return;
                }
                setTeamManagers([...teamManagers, newTeamManager]);
                saveToLocalStorage('teamManagers', [...teamManagers, newTeamManager]);
                setNewTeamManager({ username: '', password: '', event: '', team: '' });
              }}
              disabled={!newTeamManager.event}
            >
              Add Team Manager
            </Button>
          </FormContainer>
          <Table>
            <thead>
              <tr>
                <Th>Event</Th>
                <Th>Username</Th>
                <Th>Team</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {teamManagers.map((manager, index) => (
                <Tr key={index}>
                  <Td>{manager.event || 'N/A'}</Td>
                  <Td>{manager.username}</Td>
                  <Td>{manager.team}</Td>
                  <Td>
                    <Button onClick={() => {
                      setSelectedEvent(index);
                      // Ensure the manager object has all the required properties
                      const managerWithDefaults = {
                        username: manager.username || '',
                        password: manager.password || '',
                        event: manager.event || '',
                        team: manager.team || ''
                      };
                      setNewTeamManager(managerWithDefaults);
                    }}>Edit</Button>
                    <Button onClick={() => {
                      const updatedTeamManagers = teamManagers.filter((_, i) => i !== index);
                      setTeamManagers(updatedTeamManagers);
                      saveToLocalStorage('teamManagers', updatedTeamManagers);
                    }}>Delete</Button>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
      {activeTab === 'settings' && (
        <div>
          <FormContainer>
            <FormTitle>Application Settings</FormTitle>
            
            {/* Admin Credentials */}
            <FormGroup>
              <Label>Admin Credentials</Label>
              <div style={{ marginBottom: '15px' }}>
                <Label>Current Username</Label>
                <Input 
                  type="text" 
                  value="admin" 
                  disabled 
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <Label>New Username</Label>
                <Input 
                  type="text" 
                  value={newAdminUsername} 
                  onChange={(e) => setNewAdminUsername(e.target.value)} 
                  placeholder="Enter new username"
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <Label>Current Password</Label>
                <Input 
                  type="password" 
                  value={currentAdminPassword} 
                  onChange={(e) => setCurrentAdminPassword(e.target.value)} 
                  placeholder="Enter current password"
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <Label>New Password</Label>
                <Input 
                  type="password" 
                  value={newAdminPassword} 
                  onChange={(e) => setNewAdminPassword(e.target.value)} 
                  placeholder="Enter new password"
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <Label>Confirm New Password</Label>
                <Input 
                  type="password" 
                  value={confirmAdminPassword} 
                  onChange={(e) => setConfirmAdminPassword(e.target.value)} 
                  placeholder="Confirm new password"
                />
              </div>
              <Button 
                onClick={handleAdminCredentialsChange}
                style={{ marginTop: '10px' }}
              >
                Update Admin Credentials
              </Button>
            </FormGroup>
            
            {/* App Title Configuration */}
            <FormGroup>
              <Label>Application Title</Label>
              <Input 
                type="text" 
                value={appTitle} 
                onChange={(e) => setAppTitle(e.target.value)} 
                placeholder="Enter application title"
              />
              <Button 
                onClick={() => {
                  saveToLocalStorage('appTitle', appTitle);
                  alert('Application title saved successfully!');
                }}
                style={{ marginTop: '10px' }}
              >
                Save Title
              </Button>
            </FormGroup>
            
            {/* Logo Upload */}
            <FormGroup>
              <Label>Application Logo</Label>
              <Input 
                type="file" 
                accept="image/*" 
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setLogoImage(event.target.result);
                    };
                    reader.readAsDataURL(file);
                  }
                }} 
              />
              {logoImage && (
                <div style={{ marginTop: '10px' }}>
                  <img 
                    src={logoImage} 
                    alt="Preview" 
                    style={{ maxWidth: '200px', maxHeight: '100px' }} 
                  />
                  <Button 
                    onClick={() => {
                      saveToLocalStorage('logoImage', logoImage);
                      alert('Logo saved successfully!');
                    }}
                    style={{ marginTop: '10px', display: 'block' }}
                  >
                    Save Logo
                  </Button>
                </div>
              )}
            </FormGroup>
            
            {/* Theme Configuration */}
            <FormGroup>
              <Label>Theme Colors</Label>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <div>
                  <Label>Primary Color</Label>
                  <Input 
                    type="color" 
                    value={appTheme.primary} 
                    onChange={(e) => setAppTheme({ ...appTheme, primary: e.target.value })} 
                  />
                </div>
                <div>
                  <Label>Secondary Color</Label>
                  <Input 
                    type="color" 
                    value={appTheme.secondary} 
                    onChange={(e) => setAppTheme({ ...appTheme, secondary: e.target.value })} 
                  />
                </div>
                <div>
                  <Label>Accent Color</Label>
                  <Input 
                    type="color" 
                    value={appTheme.accent} 
                    onChange={(e) => setAppTheme({ ...appTheme, accent: e.target.value })} 
                  />
                </div>
              </div>
              <Button 
                onClick={() => {
                  saveToLocalStorage('appTheme', appTheme);
                  alert('Theme saved successfully!');
                }}
                style={{ marginTop: '10px' }}
              >
                Save Theme
              </Button>
            </FormGroup>
            
            {/* Reset to Default Button */}
            <Button 
              onClick={() => {
                if (window.confirm('Are you sure you want to reset all settings to default?')) {
                  setAppTitle('Mehfil Artsfest Leaderboard');
                  setAppTheme({
                    primary: '#6a11cb',
                    secondary: '#2575fc',
                    accent: 'gold'
                  });
                  setLogoImage(null);
                  localStorage.removeItem('appTitle');
                  localStorage.removeItem('appTheme');
                  localStorage.removeItem('logoImage');
                  alert('Settings reset to default!');
                }
              }}
              style={{ background: '#ff4757', marginTop: '20px' }}
            >
              Reset to Default
            </Button>
          </FormContainer>
        </div>
      )}
    </DashboardContainer>
  );
};

export default AdminDashboard;