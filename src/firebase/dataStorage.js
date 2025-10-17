// Firebase data storage utilities
import { db } from './config';
import { 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  serverTimestamp
} from 'firebase/firestore';

// Save data to Firestore
export const saveToFirestore = async (collectionName, data, docId = null) => {
  try {
    if (docId) {
      // Update existing document
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } else {
      // Create new document
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    }
  } catch (error) {
    console.error('Error saving to Firestore:', error);
    throw error;
  }
};

// Load data from Firestore
export const loadFromFirestore = async (collectionName, docId = null) => {
  try {
    if (docId) {
      // Load specific document
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    } else {
      // Load all documents in collection
      const querySnapshot = await getDocs(collection(db, collectionName));
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      return data;
    }
  } catch (error) {
    console.error('Error loading from Firestore:', error);
    throw error;
  }
};

// Delete data from Firestore
export const deleteFromFirestore = async (collectionName, docId) => {
  try {
    await deleteDoc(doc(db, collectionName, docId));
    return true;
  } catch (error) {
    console.error('Error deleting from Firestore:', error);
    throw error;
  }
};

// Load data with query
export const loadFromFirestoreWithQuery = async (collectionName, field, value) => {
  try {
    const q = query(collection(db, collectionName), where(field, '==', value));
    const querySnapshot = await getDocs(q);
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    return data;
  } catch (error) {
    console.error('Error loading from Firestore with query:', error);
    throw error;
  }
};

// Load data with multiple conditions
export const loadFromFirestoreWithMultipleQueries = async (collectionName, conditions) => {
  try {
    let q = collection(db, collectionName);
    
    conditions.forEach(condition => {
      q = query(q, where(condition.field, condition.operator, condition.value));
    });
    
    const querySnapshot = await getDocs(q);
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    return data;
  } catch (error) {
    console.error('Error loading from Firestore with multiple queries:', error);
    throw error;
  }
};