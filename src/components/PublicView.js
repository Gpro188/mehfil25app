import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { loadFromLocalStorage, calculateTeamStandings, calculateTopPerformers } from '../utils/dataStorage';
import Logo from './Logo';

// Add a simple console log to verify the component is loading
console.log('PublicView component loading');

// Welcome animation keyframes
const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-50px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const PublicViewContainer = styled.div`
  padding: 20px;
  color: white;
  min-height: 100vh;
  
  // Add a simple visual indicator that the component is rendering
  &:before {
    content: "PublicView Component Loaded";
    position: fixed;
    top: 10px;
    right: 10px;
    background: red;
    color: white;
    padding: 5px;
    font-size: 12px;
    z-index: 9999;
  }
`;

const WelcomeOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${fadeIn} 0.5s ease-out;
`;

const WelcomeContent = styled.div`
  text-align: center;
  animation: ${slideIn} 0.8s ease-out;
`;

const WelcomeLogo = styled.div`
  margin-bottom: 30px;
  animation: ${pulse} 2s infinite;
  display: flex;
  justify-content: center;
`;

const WelcomeTitle = styled.h1`
  font-size: 3.5rem;
  color: gold;
  margin-bottom: 20px;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
  text-align: center;
`;

const WelcomeSubtitle = styled.p`
  font-size: 1.5rem;
  color: white;
  margin-bottom: 30px;
  max-width: 600px;
  line-height: 1.6;
  text-align: center;
`;

const WelcomeButton = styled.button`
  padding: 15px 40px;
  background: gold;
  color: #333;
  border: none;
  border-radius: 30px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);

  &:hover {
    background: #ffd700;
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.3);
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const Navigation = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const NavLink = styled.a`
  color: gold;
  text-decoration: none;
  font-weight: bold;
  padding: 8px 16px;
  border-radius: 20px;
  background: rgba(0,0,0,0.2);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0,0,0,0.4);
    transform: translateY(-2px);
  }
`;

const RoleSwitcher = styled.div`
  display: flex;
  justify-content: center;
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

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 10px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
`;

const EventSwitcher = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  gap: 10px;
  flex-wrap: wrap;
`;

const EventButton = styled.button`
  padding: 10px 20px;
  background: ${props => props.active ? 'gold' : 'rgba(255,255,255,0.2)'};
  color: ${props => props.active ? '#333' : 'white'};
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.active ? 'gold' : 'rgba(255,255,255,0.3)'};
  }
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
`;

const SearchInput = styled.input`
  padding: 12px 20px;
  width: 300px;
  border-radius: 30px;
  border: none;
  outline: none;
  font-size: 1rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
`;

const LeaderboardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const TeamCard = styled.div`
  background: rgba(255,255,255,0.1);
  border-radius: 15px;
  padding: 20px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const TeamHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255,255,255,0.2);
`;

const TeamName = styled.h2`
  margin: 0;
  font-size: 1.5rem;
`;

const MedalCount = styled.div`
  display: flex;
  gap: 10px;
`;

const Medal = styled.span`
  display: flex;
  align-items: center;
  gap: 3px;
  font-weight: bold;
`;

const GoldMedal = styled(Medal)`
  color: gold;
`;

const SilverMedal = styled(Medal)`
  color: silver;
`;

const BronzeMedal = styled(Medal)`
  color: #cd7f32;
`;

const Ranking = styled.div`
  font-size: 3rem;
  font-weight: bold;
  text-align: center;
  margin: 20px 0;
  color: gold;
`;

const TopPerformers = styled.div`
  background: rgba(255,255,255,0.1);
  border-radius: 15px;
  padding: 20px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
`;

const SectionTitle = styled.h2`
  text-align: center;
  margin-top: 0;
  margin-bottom: 20px;
  color: gold;
`;

const PerformerList = styled.ul`
  list-style: none;
  padding: 0;
`;

const PerformerItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  margin-bottom: 10px;
  background: rgba(255,255,255,0.05);
  border-radius: 10px;
  animation: slideIn 0.5s ease;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const PerformerName = styled.span`
  font-weight: bold;
`;

const PerformerPoints = styled.span`
  color: gold;
`;

const ResultsFeed = styled.div`
  background: rgba(255,255,255,0.1);
  border-radius: 15px;
  padding: 20px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  margin-top: 30px;
`;

const ResultItem = styled.div`
  padding: 15px;
  margin-bottom: 10px;
  background: rgba(255,255,255,0.05);
  border-radius: 10px;
  border-left: 4px solid gold;
`;

const ResultHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const ResultTitle = styled.h3`
  margin: 0;
  color: gold;
`;

const ResultDetails = styled.div`
  display: flex;
  justify-content: space-between;
`;

// Gallery Slider Styles
const GallerySlider = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 30px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
`;

const Slide = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: ${props => props.active ? 1 : 0};
  transition: opacity 1s ease-in-out;
`;

const SlideImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const SlideIndicator = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
`;

const IndicatorDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.active ? 'gold' : 'rgba(255,255,255,0.5)'};
  cursor: pointer;
  transition: background 0.3s ease;
`;

const PublicView = () => {
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(true);
  const [events, setEvents] = useState([]);
  const [teams, setTeams] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [results, setResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  
  // App settings
  const [appTitle, setAppTitle] = useState('Mehfil Artsfest Leaderboard');
  const [logoImage, setLogoImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  
  // Gallery slider state
  const [currentSlide, setCurrentSlide] = useState(0);

  // Handle welcome screen dismissal
  const dismissWelcome = () => {
    setShowWelcome(false);
  };

  // Auto-dismiss welcome screen after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  // Auto-slide gallery
  useEffect(() => {
    if (galleryImages.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % galleryImages.length);
    }, 3000); // Change slide every 3 seconds
    
    return () => clearInterval(interval);
  }, [galleryImages.length]);

  // Load data from localStorage
  useEffect(() => {
    // Load app settings
    const savedAppTitle = loadFromLocalStorage('appTitle', 'Mehfil Artsfest Leaderboard');
    const savedLogoImage = loadFromLocalStorage('logoImage', null);
    const savedGalleryImages = loadFromLocalStorage('galleryImages', []);
    
    setAppTitle(savedAppTitle);
    setLogoImage(savedLogoImage);
    setGalleryImages(savedGalleryImages);
    
    const savedEvents = loadFromLocalStorage('events', [
      { id: 1, name: 'Dance Competition', active: true },
      { id: 2, name: 'Music Fest', active: false },
      { id: 3, name: 'Drama Show', active: false }
    ]);
    
    const savedTeams = loadFromLocalStorage('teams', [
      { id: 1, name: 'Team Alpha', gold: 5, silver: 3, bronze: 2, rank: 1 },
      { id: 2, name: 'Team Beta', gold: 4, silver: 5, bronze: 1, rank: 2 },
      { id: 3, name: 'Team Gamma', gold: 3, silver: 2, bronze: 4, rank: 3 }
    ]);
    
    const savedResults = loadFromLocalStorage('results', []);
    const savedPoints = loadFromLocalStorage('points', { gold: 10, silver: 7, bronze: 5 });
    const savedCategoryPoints = loadFromLocalStorage('categoryPoints', {});
    const savedGradePoints = loadFromLocalStorage('gradePoints', {});
    const savedAvailableGrades = loadFromLocalStorage('availableGrades', ['A', 'B', 'C', 'D']);
    
    // Get the active event
    const activeEvent = savedEvents.find(event => event.active);
    
    // Filter results for the active event
    const eventResults = activeEvent 
      ? savedResults.filter(result => result.event === activeEvent.name)
      : savedResults;
    
    // Calculate team standings based on active event results
    const updatedTeams = calculateTeamStandings(
      savedTeams, 
      eventResults, 
      savedPoints, 
      savedCategoryPoints, 
      savedGradePoints
    );
    
    // Calculate top performers based on active event results
    const performers = calculateTopPerformers(eventResults);
    
    setEvents(savedEvents);
    setTeams(updatedTeams);
    setResults(savedResults);
    setFilteredResults(eventResults);
    setTopPerformers(performers);
  }, []);

  // Filter results based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredResults(results);
      return;
    }
    
    const filtered = results.filter(result => {
      // Check if any participant matches the search term
      return result.participants.some(participant => 
        participant.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    
    setFilteredResults(filtered);
  }, [searchTerm, results]);

  const switchEvent = (eventId) => {
    const updatedEvents = events.map(event => ({
      ...event,
      active: event.id === eventId
    }));
    
    setEvents(updatedEvents);
    
    // Get the active event
    const activeEvent = updatedEvents.find(event => event.active);
    
    // Filter results for the active event
    const eventResults = activeEvent 
      ? results.filter(result => result.event === activeEvent.name)
      : results;
    
    // Recalculate team standings based on active event results
    const savedTeams = loadFromLocalStorage('teams', []);
    const savedPoints = loadFromLocalStorage('points', { gold: 10, silver: 7, bronze: 5 });
    const savedCategoryPoints = loadFromLocalStorage('categoryPoints', {});
    const savedGradePoints = loadFromLocalStorage('gradePoints', {});
    
    const updatedTeams = calculateTeamStandings(
      savedTeams, 
      eventResults, 
      savedPoints, 
      savedCategoryPoints, 
      savedGradePoints
    );
    
    // Recalculate top performers based on active event results
    const performers = calculateTopPerformers(eventResults);
    
    setTeams(updatedTeams);
    setFilteredResults(eventResults);
    setTopPerformers(performers);
  };

  // Handle slide indicator click
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <PublicViewContainer>
      {showWelcome && (
        <WelcomeOverlay>
          <WelcomeContent>
            <WelcomeLogo>
              <Logo imageSrc={logoImage} showText={false} />
            </WelcomeLogo>
            <WelcomeTitle>Welcome to {appTitle}</WelcomeTitle>
            <WelcomeSubtitle>
              Experience the excitement of our annual arts competition with real-time scoring and leaderboards
            </WelcomeSubtitle>
            <WelcomeButton onClick={dismissWelcome}>
              Enter Competition
            </WelcomeButton>
          </WelcomeContent>
        </WelcomeOverlay>
      )}
      
      <Header>
        <Navigation>
          <NavLink href="/admin/login">Admin Login</NavLink>
          <NavLink href="/team-manager-login">Team Manager Login</NavLink>
        </Navigation>
        <Logo imageSrc={logoImage} showText={false} />
        <Title>{appTitle}</Title>
      </Header>
      
      {/* Gallery Slider - Moved to top */}
      {galleryImages.length > 0 && (
        <GallerySlider>
          {galleryImages.map((image, index) => (
            <Slide key={index} active={index === currentSlide}>
              <SlideImage src={image} alt={`Gallery ${index + 1}`} />
            </Slide>
          ))}
          {galleryImages.length > 1 && (
            <SlideIndicator>
              {galleryImages.map((_, index) => (
                <IndicatorDot 
                  key={index} 
                  active={index === currentSlide} 
                  onClick={() => goToSlide(index)}
                />
              ))}
            </SlideIndicator>
          )}
        </GallerySlider>
      )}
      
      <RoleSwitcher>
        <RoleButton 
          active={true}
          onClick={() => {}}
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
          active={false}
          onClick={() => navigate('/team-manager-login')}
        >
          Team Manager
        </RoleButton>
      </RoleSwitcher>
      
      <div style={{ 
        background: 'rgba(255,255,255,0.1)', 
        padding: '15px', 
        borderRadius: '10px', 
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <p style={{ margin: '0', color: 'gold' }}>
          <strong>Note:</strong> Participants with grades (e.g., "John Doe (A)") receive grade-specific points
        </p>
      </div>
      
      <EventSwitcher>
        {events.map(event => (
          <EventButton 
            key={event.id} 
            active={event.active}
            onClick={() => switchEvent(event.id)}
          >
            {event.name}
            {event.active && (
              <span style={{ marginLeft: '5px', fontSize: '0.8em' }}>★</span>
            )}
          </EventButton>
        ))}
      </EventSwitcher>
      
      {events.some(event => event.active) && (
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '20px',
          color: 'gold',
          fontWeight: 'bold'
        }}>
          Currently viewing: {events.find(event => event.active)?.name}
        </div>
      )}
      
      <SearchContainer>
        <SearchInput 
          type="text" 
          placeholder="Search by chest number, name or program..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchContainer>
      
      <LeaderboardContainer>
        {teams.map(team => (
          <TeamCard key={team.id}>
            <TeamHeader>
              <TeamName>{team.name}</TeamName>
              <MedalCount>
                <GoldMedal>🥇 {team.gold || 0}</GoldMedal>
                <SilverMedal>🥈 {team.silver || 0}</SilverMedal>
                <BronzeMedal>🥉 {team.bronze || 0}</BronzeMedal>
              </MedalCount>
            </TeamHeader>
            <div style={{ textAlign: 'center', marginBottom: '15px', padding: '10px', background: 'rgba(255, 215, 0, 0.1)', borderRadius: '10px' }}>
              <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'gold' }}>
                Total Points: {team.totalPoints || 0}
              </span>
            </div>
            <Ranking>#{team.rank || '-'}</Ranking>
          </TeamCard>
        ))}
      </LeaderboardContainer>
      
      <TopPerformers>
        <SectionTitle>Top Performers</SectionTitle>
        {topPerformers.length === 0 ? (
          <p>No performers data available.</p>
        ) : (
          <PerformerList>
            {topPerformers.map((performer, index) => (
              <PerformerItem key={performer.id}>
                <PerformerName>{index + 1}. {performer.name} - {performer.program}</PerformerName>
                <PerformerPoints>{performer.points} pts</PerformerPoints>
              </PerformerItem>
            ))}
          </PerformerList>
        )}
      </TopPerformers>
      
      <ResultsFeed>
        <SectionTitle>Recent Results</SectionTitle>
        {filteredResults.length === 0 ? (
          <p>No results found.</p>
        ) : (
          filteredResults
            .filter(result => {
              // Only show results from the active event
              const activeEvent = events.find(event => event.active);
              return activeEvent ? result.event === activeEvent.name : true;
            })
            .slice(0, 5)
            .map(result => (
              <ResultItem key={result.id}>
                <ResultHeader>
                  <ResultTitle>{result.program}</ResultTitle>
                  <span>{new Date(result.timestamp).toLocaleDateString()}</span>
                </ResultHeader>
                <ResultDetails>
                  <div>
                    <strong>Event:</strong> {result.event}
                  </div>
                  <div>
                    <strong>Category:</strong> {result.category}
                  </div>
                </ResultDetails>
                <div style={{ marginTop: '10px' }}>
                  <strong>Winners:</strong>
                  <ul style={{ paddingLeft: '20px', margin: '5px 0 0' }}>
                    {result.participants.map((participant, index) => (
                      <li key={index}>
                        {participant.name} - {participant.position} ({participant.points} points)
                      </li>
                    ))}
                  </ul>
                </div>
              </ResultItem>
            ))
        )}
      </ResultsFeed>
    </PublicViewContainer>
  );
};

export default PublicView;