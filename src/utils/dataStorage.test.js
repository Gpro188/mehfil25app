import { saveToLocalStorage, loadFromLocalStorage, initializeDefaultData } from './dataStorage';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

describe('dataStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('saveToLocalStorage saves data correctly', () => {
    const testData = { name: 'test', value: 123 };
    const result = saveToLocalStorage('testKey', testData);
    
    expect(localStorage.setItem).toHaveBeenCalledWith('testKey', JSON.stringify(testData));
    expect(result).toBe(true);
  });

  test('saveToLocalStorage handles errors gracefully', () => {
    localStorage.setItem.mockImplementationOnce(() => {
      throw new Error('Storage error');
    });
    
    const result = saveToLocalStorage('testKey', { test: 'data' });
    expect(result).toBe(false);
  });

  test('loadFromLocalStorage loads data correctly', () => {
    const testData = { name: 'test', value: 123 };
    localStorage.getItem.mockReturnValue(JSON.stringify(testData));
    
    const result = loadFromLocalStorage('testKey');
    expect(result).toEqual(testData);
  });

  test('loadFromLocalStorage returns default value when key not found', () => {
    localStorage.getItem.mockReturnValue(null);
    
    const result = loadFromLocalStorage('testKey', 'defaultValue');
    expect(result).toBe('defaultValue');
  });

  test('loadFromLocalStorage handles errors gracefully', () => {
    localStorage.getItem.mockImplementationOnce(() => {
      throw new Error('Storage error');
    });
    
    const result = loadFromLocalStorage('testKey', 'defaultValue');
    expect(result).toBe('defaultValue');
  });

  test('initializeDefaultData sets default values when not initialized', () => {
    localStorage.getItem.mockReturnValue(null); // Not initialized
    
    initializeDefaultData();
    
    expect(localStorage.setItem).toHaveBeenCalledWith('categories', JSON.stringify([
      { id: 1, name: 'Sub Junior', order: 1 },
      { id: 2, name: 'Junior', order: 2 },
      { id: 3, name: 'Senior', order: 3 }
    ]));
    
    expect(localStorage.setItem).toHaveBeenCalledWith('adminPassword', JSON.stringify('admin123'));
    expect(localStorage.setItem).toHaveBeenCalledWith('initialized', JSON.stringify(true));
  });

  test('initializeDefaultData does not overwrite existing data', () => {
    localStorage.getItem.mockReturnValue(JSON.stringify(true)); // Already initialized
    
    initializeDefaultData();
    
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });
});