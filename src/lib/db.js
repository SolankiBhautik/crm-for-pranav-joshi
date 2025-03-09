import { db } from './firebase';
import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  increment
} from "firebase/firestore";



// References
export const addReference = async (referenceData) => {
  const docRef = await addDoc(collection(db, 'references'), referenceData);
  return { id: docRef.id, ...referenceData };
};

export const getReferences = async () => {
  const snapshot = await getDocs(collection(db, 'references'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};


// Reminders
export const addReminder = async (reminderData) => {
  const docRef = await addDoc(collection(db, 'reminders'), {
    ...reminderData,
    createdAt: new Date().toISOString()
  });
  return { id: docRef.id, ...reminderData };
};

export const getCustomerReminders = async (customerId) => {
  const remindersRef = collection(db, 'reminders');
  const q = query(remindersRef, where('customerId', '==', customerId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
