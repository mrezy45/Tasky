import { db } from './firebase-config.js';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* ========== USER STORAGE ========== */

// Save a new user (during registration)
export async function saveUser(userData) {
  try {
    // Check if username or email already exists
    const usersRef = collection(db, 'users');

    const usernameQuery = query(usersRef, where('username', '==', userData.username));
    const emailQuery = query(usersRef, where('email', '==', userData.email));

    const [usernameSnapshot, emailSnapshot] = await Promise.all([
      getDocs(usernameQuery),
      getDocs(emailQuery)
    ]);

    if (!usernameSnapshot.empty) {
      throw new Error("Username already exists");
    }

    if (!emailSnapshot.empty) {
      throw new Error("Email already registered");
    }

    // Save new user
    const docRef = await addDoc(usersRef, {
      fullName: userData.fullName,
      username: userData.username,
      email: userData.email,
      password: userData.password, // ⚠️ In production, hash the password
      createdAt: new Date()
    });

    return { success: true, id: docRef.id };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// Get user by username and password (for login)
export async function loginUser(username, password) {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username), where('password', '==', password));

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { success: false, error: "Invalid username or password" };
    }

    const userDoc = querySnapshot.docs[0];
    return { success: true, data: { id: userDoc.id, ...userDoc.data() } };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/* ========== TASK STORAGE ========== */

// Save a task
export async function saveTask(taskData) {
  try {
    const tasksRef = collection(db, 'tasks');
    const docRef = await addDoc(tasksRef, {
      title: taskData.title,
      description: taskData.description,
      dueDate: taskData.dueDate,
      createdBy: taskData.createdBy,
      assignedBy: taskData.assignedBy,
      assignedTo: taskData.assignedTo,
      status: taskData.status || "Pending",
      progress: taskData.progress || 0,
      createdAt: new Date()
      // Don't add taskId yet – we need docRef.id first
    });

    // Now update the task with its own ID
    await updateDoc(doc(db, 'tasks', docRef.id), {
      taskId: docRef.id
    });

    return { success: true, id: docRef.id };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// Fetch tasks by email
export async function getTasksByUser(email) {
  try {
    const tasksRef = collection(db, 'tasks');
    const q = query(tasksRef, where('createdBy', '==', email));
    const snapshot = await getDocs(q);

    const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return { success: true, data: tasks };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
