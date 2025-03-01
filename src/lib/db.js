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
  where
} from "firebase/firestore";


export const addCustomer = async (customerData) => {
  try {
    const { city, state } = customerData;

    // Add new customer
    const docRef = await addDoc(collection(db, 'customers'), {
      ...customerData,
      date: new Date().toISOString(),
    });

    // Ensure city exists in 'cities' collection
    if (city) {
      const cityRef = doc(db, "cities", city);
      const cityDoc = await getDoc(cityRef);
      if (!cityDoc.exists()) {
        await setDoc(cityRef, { name: city });
      }
    }

    // Ensure state exists in 'states' collection
    if (state) {
      const stateRef = doc(db, "states", state);
      const stateDoc = await getDoc(stateRef);
      if (!stateDoc.exists()) {
        await setDoc(stateRef, { name: state });
      }
    }

    return { id: docRef.id, ...customerData };

  } catch (error) {
    console.error("Error adding customer:", error);
    return null;
  }
};

export const updateCustomer = async (id, updatedData) => {
  try {
    const customerRef = doc(db, 'customers', id);
    const customerSnap = await getDoc(customerRef);

    if (!customerSnap.exists()) {
      console.error("Customer not found");
      return;
    }

    const oldData = customerSnap.data();
    const { city: oldCity, state: oldState } = oldData;
    const { city: newCity, state: newState } = updatedData;

    // Update customer document
    await updateDoc(customerRef, updatedData);

    // Handle city change
    if (oldCity !== newCity) {
      if (newCity) {
        const newCityRef = doc(db, "cities", newCity);
        const newCityDoc = await getDoc(newCityRef);
        if (!newCityDoc.exists()) {
          await setDoc(newCityRef, { name: newCity });
        }
      }
      await removeCityIfUnused(oldCity);
    }

    // Handle state change
    if (oldState !== newState) {
      if (newState) {
        const newStateRef = doc(db, "states", newState);
        const newStateDoc = await getDoc(newStateRef);
        if (!newStateDoc.exists()) {
          await setDoc(newStateRef, { name: newState });
        }
      }
      await removeStateIfUnused(oldState);
    }

  } catch (error) {
    console.error("Error updating customer:", error);
  }
};

export const deleteCustomer = async (id) => {
  try {
    const customerRef = doc(db, 'customers', id);
    const customerSnap = await getDoc(customerRef);

    if (!customerSnap.exists()) {
      console.error("Customer not found");
      return;
    }

    const { city, state } = customerSnap.data();

    // Delete customer document
    await deleteDoc(customerRef);

    // Cleanup unused cities and states
    await removeCityIfUnused(city);
    await removeStateIfUnused(state);

  } catch (error) {
    console.error("Error deleting customer:", error);
  }
};

const removeCityIfUnused = async (city) => {
  if (!city) return;
  const cityQuery = query(collection(db, 'customers'), where('city', '==', city));
  const citySnapshot = await getDocs(cityQuery);

  if (citySnapshot.empty) {
    await deleteDoc(doc(db, 'cities', city));
  }
};

const removeStateIfUnused = async (state) => {
  if (!state) return;
  const stateQuery = query(collection(db, 'customers'), where('state', '==', state));
  const stateSnapshot = await getDocs(stateQuery);

  if (stateSnapshot.empty) {
    await deleteDoc(doc(db, 'states', state));
  }
};


// export const getCustomers = async (params = []) => {
//   if(params.length > 0) {
//     const snapshot = await getDocs(collection(db, 'customers'), where(...params));
//     return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//   } else {
//     const snapshot = await getDocs(collection(db, 'customers'));
//     return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//   }
// };

export const getCustomers = async (filterOptions = {}) => {
  try {
    const { searchTerm, type, city, state, dateRange, sortBy, sortDirection } = filterOptions;

    // Start with a base query
    let customersQuery = collection(db, 'customers');
    let constraints = [];

    // Add filters if they exist
    if (type) {
      constraints.push(where('type', '==', type));
    }

    if (city) {
      constraints.push(where('city', '==', city));
    }

    if (state) {
      constraints.push(where('state', '==', state));
    }
    
    if (searchTerm) {
      constraints.push(where('name', '==', searchTerm));
    }

    // Date filtering will be handled after getting the data
    // as Firestore doesn't easily support range queries combined with other filters

    // Apply sorting if specified
    if (sortBy) {
      customersQuery = query(customersQuery, orderBy(sortBy, sortDirection || 'asc'));
    }

    // Apply filters if there are any
    if (constraints.length > 0) {
      // Firestore has a limitation: we can only use one composite query at a time
      // So we'll apply one filter in the query and others client-side
      customersQuery = query(customersQuery, constraints[0]);
    }

    const snapshot = await getDocs(customersQuery);
    let customers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Apply additional filters client-side if necessary
    if (constraints.length > 1) {
      constraints.slice(1).forEach(constraint => {
        const [field, operator, value] = constraint._field.segments.concat([constraint._op, constraint._value]);
        customers = customers.filter(customer => {
          if (operator === '==') return customer[field] === value;
          return true;
        });
      });
    }

    // Filter by date range if provided
    if (dateRange.start || dateRange.end) {
      customers = customers.filter(customer => {
        if (!customer.date) return false;

        const customerDate = customer.date.toDate ? customer.date.toDate() : new Date(customer.date);

        if (dateRange.start && dateRange.end) {
          return customerDate >= new Date(dateRange.start) && customerDate <= new Date(dateRange.end);
        } else if (dateRange.start) {
          return customerDate >= new Date(dateRange.start);
        } else if (dateRange.end) {
          return customerDate <= new Date(dateRange.end);
        }
        return true;
      });
    }

    return customers;
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
};

export const getCities = async () => {
  try {
    const snapshot = await getDocs(collection(db, "cities"));
    return snapshot.docs.map(doc => doc.id); // Return city names
  } catch (error) {
    console.error("Error fetching cities:", error);
    return [];
  }
};

export const getStates = async () => {
  try {
    const snapshot = await getDocs(collection(db, "states"));
    return snapshot.docs.map(doc => doc.id); // Return state names
  } catch (error) {
    console.error("Error fetching states:", error);
    return [];
  }
};

export const getCustomerById = async (id) => {
  const docRef = doc(db, 'customers', id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
}

// References
export const addReference = async (referenceData) => {
  const docRef = await addDoc(collection(db, 'references'), referenceData);
  return { id: docRef.id, ...referenceData };
};

export const getReferences = async () => {
  const snapshot = await getDocs(collection(db, 'references'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Orders
export const addOrder = async (orderData) => {
  const docRef = await addDoc(collection(db, 'orders'), {
    ...orderData,
    status: 'pending',
    createdAt: new Date().toISOString()
  });
  return { id: docRef.id, ...orderData };
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
