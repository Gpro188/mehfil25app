// Utility functions for data storage and retrieval

export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

export const loadFromLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
};

// Data migration function for categories
export const migrateCategories = () => {
  console.log('Migrating categories...');
  const existingCategories = loadFromLocalStorage('categories');
  
  if (!existingCategories || existingCategories.length === 0) {
    console.log('Creating default categories...');
    // Create default categories if none exist
    const defaultCategories = [
      { id: 1, name: 'Sub Junior', order: 1 },
      { id: 2, name: 'Junior', order: 2 },
      { id: 3, name: 'Senior', order: 3 }
    ];
    
    saveToLocalStorage('categories', defaultCategories);
    return defaultCategories;
  }
  
  return existingCategories;
};

// Calculate team standings based on results
export const calculateTeamStandings = (teams, results, pointsConfig, categoryPointsConfig = {}, gradePointsConfig = {}) => {
  // Initialize medal counts for each team
  const teamStandings = teams.map(team => ({
    ...team,
    gold: 0,
    silver: 0,
    bronze: 0,
    totalPoints: 0
  }));
  
  // Process results to count medals and points
  results.forEach(result => {
    result.participants.forEach(participant => {
      // Find the student to get their team
      const students = loadFromLocalStorage('students', []);
      const student = students.find(s => 
        s.chestNumber === participant.name || 
        s.name === participant.name
      );
      
      if (student) {
        // Find the team in standings
        const teamIndex = teamStandings.findIndex(t => t.name === student.team);
        if (teamIndex !== -1) {
          // Extract grade from participant name if it exists
          let grade = participant.grade || ''; // Use grade from participant if available
          let participantName = participant.name;
          
          // If grade wasn't provided in participant, try to extract from name
          if (!grade) {
            const gradeMatch = participant.name.match(/\(([A-D])\)$/);
            if (gradeMatch) {
              grade = gradeMatch[1];
              participantName = participant.name.replace(/\s*\([A-D]\)$/, '');
            }
          }
          
          // Use grade-specific points if available
          let categoryPointConfig = pointsConfig; // default
          
          if (grade && result.category) {
            const gradeKey = `${result.category}-${grade}`;
            if (gradePointsConfig[gradeKey]) {
              categoryPointConfig = gradePointsConfig[gradeKey];
            } else if (categoryPointsConfig[result.category]) {
              // Fall back to category-specific points
              categoryPointConfig = categoryPointsConfig[result.category];
            }
          } else if (categoryPointsConfig[result.category]) {
            // Use category-specific points if no grade specified
            categoryPointConfig = categoryPointsConfig[result.category];
          }
          
          // Increment medal count based on position
          switch (participant.position) {
            case '1':
              teamStandings[teamIndex].gold += 1;
              teamStandings[teamIndex].totalPoints += categoryPointConfig.gold || pointsConfig.gold || 3;
              break;
            case '2':
              teamStandings[teamIndex].silver += 1;
              teamStandings[teamIndex].totalPoints += categoryPointConfig.silver || pointsConfig.silver || 2;
              break;
            case '3':
              teamStandings[teamIndex].bronze += 1;
              teamStandings[teamIndex].totalPoints += categoryPointConfig.bronze || pointsConfig.bronze || 1;
              break;
          }
        }
      }
    });
  });
  
  // Sort teams by total points (descending)
  teamStandings.sort((a, b) => b.totalPoints - a.totalPoints);
  
  // Add rank to each team
  teamStandings.forEach((team, index) => {
    team.rank = index + 1;
  });
  
  return teamStandings;
};

// Calculate top performers based on points
export const calculateTopPerformers = (results) => {
  const performerPoints = {};
  
  // Aggregate points for each performer
  results.forEach(result => {
    result.participants.forEach(participant => {
      if (!performerPoints[participant.name]) {
        performerPoints[participant.name] = {
          name: participant.name,
          totalPoints: 0,
          programs: []
        };
      }
      
      performerPoints[participant.name].totalPoints += participant.points || 0;
      performerPoints[participant.name].programs.push({
        program: result.program,
        position: participant.position,
        points: participant.points || 0
      });
    });
  });
  
  // Convert to array and sort by points
  const performers = Object.values(performerPoints);
  performers.sort((a, b) => b.totalPoints - a.totalPoints);
  
  // Format for display (top 10)
  return performers.slice(0, 10).map((performer, index) => ({
    id: index + 1,
    name: performer.name,
    program: performer.programs[0]?.program || 'Various',
    points: performer.totalPoints
  }));
};

// Initialize default data if not present
export const initializeDefaultData = () => {
  console.log('Initializing default data...');
  // Check if we have initialized data already
  const isInitialized = loadFromLocalStorage('initialized', false);
  
  if (!isInitialized) {
    console.log('Data not initialized, setting up default data...');
    // Initialize categories
    migrateCategories();
    
    // Initialize other default data
    const defaultEvents = [
      { id: 1, name: 'Dance Competition', categories: ['Sub Junior', 'Junior', 'Senior'], color: { r: 106, g: 17, b: 203 } }
    ];
    
    const defaultTeams = [
      { 
        id: 1, 
        name: 'Team Alpha', 
        event: '',
        color: '#FF5733',
        teamLeader: { name: '', photo: null },
        assistantLeader: { name: '', photo: null },
        manager: { name: '', photo: null }
      }
    ];
    
    const defaultPrograms = [
      { id: 1, name: 'Classical Dance', event: '', category: '', type: 'Individual' }
    ];
    
    const defaultPoints = {
      gold: 3,
      silver: 2,
      bronze: 1
    };
    
    // Set default admin password
    const defaultAdminPassword = 'admin123';
    
    // Initialize empty team managers array
    const defaultTeamManagers = [
      { username: '', password: '', event: '', team: '' }
    ];
    
    console.log('Saving default data to localStorage...');
    saveToLocalStorage('events', defaultEvents);
    saveToLocalStorage('teams', defaultTeams);
    saveToLocalStorage('programs', defaultPrograms);
    saveToLocalStorage('points', defaultPoints);
    saveToLocalStorage('adminPassword', defaultAdminPassword);
    saveToLocalStorage('categoryPoints', {}); // Initialize empty category points
    saveToLocalStorage('gradePoints', {}); // Initialize empty grade points
    saveToLocalStorage('teamManagers', defaultTeamManagers); // Initialize empty team managers
    saveToLocalStorage('availableGrades', ['A', 'B', 'C', 'D']);
    saveToLocalStorage('initialized', true);
    console.log('Default data initialization complete.');
  } else {
    console.log('Data already initialized.');
  }
};
