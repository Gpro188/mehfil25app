// Hybrid data storage utility that works with both localStorage and Firebase
// This allows for gradual migration from localStorage to Firebase

import { loadFromFirestore, saveToFirestore, loadFromFirestoreWithQuery } from '../firebase/dataStorage';
import { loadFromLocalStorage, saveToLocalStorage } from './dataStorage';

// Configuration flag to determine which storage to use
// Set to true to use Firebase, false to use localStorage
const USE_FIREBASE = false;

// Save data - uses Firebase if enabled, otherwise localStorage
export const saveData = async (key, data, docId = null) => {
  if (USE_FIREBASE) {
    try {
      return await saveToFirestore(key, data, docId);
    } catch (error) {
      console.error('Firebase save failed, falling back to localStorage:', error);
      saveToLocalStorage(key, data);
      return null;
    }
  } else {
    return saveToLocalStorage(key, data);
  }
};

// Load data - uses Firebase if enabled, otherwise localStorage
export const loadData = async (key, defaultValue = null, docId = null) => {
  if (USE_FIREBASE) {
    try {
      if (docId) {
        return await loadFromFirestore(key, docId);
      } else {
        return await loadFromFirestore(key);
      }
    } catch (error) {
      console.error('Firebase load failed, falling back to localStorage:', error);
      return loadFromLocalStorage(key, defaultValue);
    }
  } else {
    return loadFromLocalStorage(key, defaultValue);
  }
};

// Load data with query - Firebase only feature
export const loadDataWithQuery = async (collectionName, field, value, defaultValue = []) => {
  if (USE_FIREBASE) {
    try {
      return await loadFromFirestoreWithQuery(collectionName, field, value);
    } catch (error) {
      console.error('Firebase query failed:', error);
      return defaultValue;
    }
  } else {
    // For localStorage, we need to filter manually
    const allData = loadFromLocalStorage(collectionName, []);
    return allData.filter(item => item[field] === value);
  }
};

// Test Firebase connectivity
export const testFirebaseConnection = async () => {
  if (!USE_FIREBASE) {
    console.log('Firebase not enabled, skipping test');
    return { success: false, message: 'Firebase not enabled' };
  }

  try {
    // Test writing to Firestore
    const testDoc = {
      test: 'Firebase connection test',
      timestamp: new Date().toISOString()
    };
    
    const docId = await saveToFirestore('test', testDoc);
    console.log('Successfully wrote to Firestore. Document ID:', docId);
    
    // Test reading from Firestore
    const data = await loadFromFirestore('test');
    console.log(`Found ${data.length} documents in test collection`);
    
    console.log('✅ Firebase configuration is working correctly!');
    return { success: true, message: 'Firebase configuration is working correctly!' };
  } catch (error) {
    console.error('❌ Firebase configuration error:', error);
    return { success: false, message: `Firebase configuration error: ${error.message}` };
  }
};

// Check if Firebase is properly configured
export const checkFirebaseConfiguration = () => {
  if (!USE_FIREBASE) {
    return { configured: false, message: 'Firebase is not enabled in hybridDataStorage.js' };
  }
  
  // Check if Firebase config has placeholder values
  try {
    // This is just for demonstration - in reality, we can't easily check the config values
    // from this file without importing them, but we can check the flag
    return { configured: true, message: 'Firebase is enabled' };
  } catch (error) {
    return { configured: false, message: 'Error checking Firebase configuration' };
  }
};

// Migration function to move data from localStorage to Firebase
export const migrateDataToFirebase = async () => {
  if (!USE_FIREBASE) {
    console.log('Firebase not enabled, skipping migration');
    return;
  }

  try {
    // List of collections to migrate
    const collections = [
      'events',
      'teams',
      'categories',
      'students',
      'programs',
      'results',
      'points',
      'categoryPoints',
      'gradePoints',
      'teamManagers',
      'availableGrades'
    ];

    for (const collectionName of collections) {
      const localData = loadFromLocalStorage(collectionName, []);
      
      // If data exists in localStorage, migrate it to Firebase
      if (Array.isArray(localData) && localData.length > 0) {
        console.log(`Migrating ${collectionName} (${localData.length} items)`);
        
        for (const item of localData) {
          try {
            await saveToFirestore(collectionName, item);
          } catch (error) {
            console.error(`Error migrating item in ${collectionName}:`, error);
          }
        }
      } else if (localData && typeof localData === 'object' && Object.keys(localData).length > 0) {
        // For objects (like points configuration)
        console.log(`Migrating ${collectionName} (object)`);
        try {
          await saveToFirestore(collectionName, localData, 'config');
        } catch (error) {
          console.error(`Error migrating ${collectionName} object:`, error);
        }
      }
    }

    console.log('Data migration completed');
  } catch (error) {
    console.error('Data migration failed:', error);
  }
};

// Initialize hybrid storage
export const initializeHybridStorage = async () => {
  if (USE_FIREBASE) {
    // Check Firebase configuration
    const configCheck = checkFirebaseConfiguration();
    if (!configCheck.configured) {
      console.warn('Firebase configuration issue:', configCheck.message);
    }
    
    // Migrate existing data to Firebase on first run
    await migrateDataToFirebase();
  }
};