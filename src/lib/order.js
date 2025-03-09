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
    orderBy,
    where,
    increment
} from "firebase/firestore";




// Orders
export const addOrder = async (customerId, orderData) => {
  const docRef = await addDoc(collection(db, 'orders'), {
    ...orderData,
    customerId,
    createdAt: new Date()
  });
  
  // Update customer's total amount
  await updateDoc(doc(db, 'customers', customerId), {
    totalAmount: increment(orderData.amount)
  });
  
  return { id: docRef.id, ...orderData};
};

export const updateOrder = async (id, orderData) => {
  const docRef = doc(db, 'orders', id);
  await updateDoc(docRef, orderData);
};

export const getCustomerOrders = async (customerId) => {
  const ordersRef = collection(db, 'orders');
  const q = query(ordersRef, where('customerId', '==', customerId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Companies
export const addCompany = async (name) => {
  const docRef = await addDoc(collection(db, 'companies'), { name });
  return { id: docRef.id, name };
};

export const getCompanies = async () => {
  const snapshot = await getDocs(collection(db, 'companies'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};


export const TILE_SIZES = [
  '12x18',
  '16x16',
  '600x600',
  '600x1200',
  '800x1600',
  '1200x1800',
];

export const GRADES = [
    'PER',
    'STD'
];
