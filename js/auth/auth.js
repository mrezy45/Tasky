import { db } from '../firebase-config.js';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Save a new user
export async function saveUser(userData) {
  try {
    const usersRef = collection(db, 'users');

    // Check for duplicates
    const usernameQuery = query(usersRef, where('username', '==', userData.username));
    const emailQuery = query(usersRef, where('email', '==', userData.email));

    const [usernameSnap, emailSnap] = await Promise.all([
      getDocs(usernameQuery),
      getDocs(emailQuery)
    ]);

    if (!usernameSnap.empty) {
      return { success: false, error: 'Username already taken' };
    }
    if (!emailSnap.empty) {
      return { success: false, error: 'Email already registered' };
    }

    await addDoc(usersRef, {
      fullName: userData.fullName,
      username: userData.username,
      email: userData.email,
      password: userData.password, // ⚠️ Insecure: for demo purposes only
      createdAt: new Date()
    });

    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// Log in an existing user
export async function loginUser(email, password) {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email), where('password', '==', password));
    const querySnap = await getDocs(q);

    if (querySnap.empty) {
      return { success: false, error: 'Invalid email or password' };
    }

    const userDoc = querySnap.docs[0];
    const user = { id: userDoc.id, ...userDoc.data() };

    return { success: true, user };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
