import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdminLogin from './AdminLogin';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock loadFromLocalStorage
jest.mock('../utils/dataStorage', () => ({
  loadFromLocalStorage: jest.fn(),
}));

describe('AdminLogin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form', () => {
    require('../utils/dataStorage').loadFromLocalStorage.mockReturnValue('admin123');
    
    render(
      <BrowserRouter>
        <AdminLogin />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Admin Login')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter admin username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter admin password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  test('shows error for empty fields', () => {
    require('../utils/dataStorage').loadFromLocalStorage.mockReturnValue('admin123');
    
    render(
      <BrowserRouter>
        <AdminLogin />
      </BrowserRouter>
    );
    
    const loginButton = screen.getByRole('button', { name: 'Login' });
    fireEvent.click(loginButton);
    
    expect(screen.getByText('Please enter both username and password')).toBeInTheDocument();
  });

  test('shows error for invalid credentials', () => {
    require('../utils/dataStorage').loadFromLocalStorage.mockReturnValue('admin123');
    
    render(
      <BrowserRouter>
        <AdminLogin />
      </BrowserRouter>
    );
    
    const usernameInput = screen.getByPlaceholderText('Enter admin username');
    const passwordInput = screen.getByPlaceholderText('Enter admin password');
    const loginButton = screen.getByRole('button', { name: 'Login' });
    
    fireEvent.change(usernameInput, { target: { value: 'admin' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(loginButton);
    
    expect(screen.getByText('Invalid username or password')).toBeInTheDocument();
  });

  test('navigates to admin dashboard for valid credentials', () => {
    require('../utils/dataStorage').loadFromLocalStorage.mockReturnValue('admin123');
    
    render(
      <BrowserRouter>
        <AdminLogin />
      </BrowserRouter>
    );
    
    const usernameInput = screen.getByPlaceholderText('Enter admin username');
    const passwordInput = screen.getByPlaceholderText('Enter admin password');
    const loginButton = screen.getByRole('button', { name: 'Login' });
    
    fireEvent.change(usernameInput, { target: { value: 'admin' } });
    fireEvent.change(passwordInput, { target: { value: 'admin123' } });
    fireEvent.click(loginButton);
    
    expect(localStorage.setItem).toHaveBeenCalledWith('isAdminLoggedIn', 'true');
    expect(mockNavigate).toHaveBeenCalledWith('/admin');
  });
});