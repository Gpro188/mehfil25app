import React from 'react';
import { render, screen } from '@testing-library/react';
import PublicView from './PublicView';

// Mock the localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock the loadFromLocalStorage function
jest.mock('../utils/dataStorage', () => ({
  loadFromLocalStorage: jest.fn(),
  calculateTeamStandings: jest.fn(),
  calculateTopPerformers: jest.fn(),
}));

describe('PublicView', () => {
  test('renders Mehfil Artsfest Leaderboard title', () => {
    require('../utils/dataStorage').loadFromLocalStorage.mockReturnValue([]);
    require('../utils/dataStorage').calculateTeamStandings.mockReturnValue([]);
    require('../utils/dataStorage').calculateTopPerformers.mockReturnValue([]);
    
    render(<PublicView />);
    const titleElement = screen.getByText(/Mehfil Artsfest Leaderboard/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders event switcher buttons', () => {
    require('../utils/dataStorage').loadFromLocalStorage.mockReturnValue([
      { id: 1, name: 'Dance Competition', active: true },
      { id: 2, name: 'Music Fest', active: false }
    ]);
    require('../utils/dataStorage').calculateTeamStandings.mockReturnValue([]);
    require('../utils/dataStorage').calculateTopPerformers.mockReturnValue([]);
    
    render(<PublicView />);
    const danceButton = screen.getByText(/Dance Competition/i);
    const musicButton = screen.getByText(/Music Fest/i);
    expect(danceButton).toBeInTheDocument();
    expect(musicButton).toBeInTheDocument();
  });
});