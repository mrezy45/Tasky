import { db } from '../firebase-config.js';
import {
  collection,
  query,
  where,
  orderBy,
  addDoc,
  getDocs,
  limit,
  startAfter,
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const tasksCollection = collection(db, 'tasks');

export async function getTasksForUser(email) {
  const q = query(tasksCollection, where("assignedTo", "==", email));

  try {
    const querySnapshot = await getDocs(q);
    const tasks = [];
    querySnapshot.forEach((doc) => {
      tasks.push({ id: doc.id, ...doc.data() });
    });
    return tasks;
  } catch (err) {
    console.error("Error fetching tasks:", err);
    return [];
  }
}

export async function saveTaskToDB(taskData) {
  try {
    const docRef = await addDoc(tasksCollection, taskData);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error saving task:', error);
    return { success: false, error };
  }
}

export async function getUserByEmail(email) {
  const usersCollection = collection(db, 'users');
  const q = query(usersCollection, where("email", "==", email));

  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data();
    }
    return null;
  } catch (err) {
    console.error("Error fetching user:", err);
    return null;
  }
}

// ✅ NEW: Get paginated tasks
export async function getPaginatedTasksForUser(email, pageSize = 3, lastVisibleDoc = null) {
  try {
    let q = query(
      tasksCollection,
      where("assignedTo", "==", email),
      orderBy("createdAt", "desc"),
      limit(pageSize)
    );

    if (lastVisibleDoc) {
      q = query(
        tasksCollection,
        where("assignedTo", "==", email),
        orderBy("createdAt", "desc"),
        startAfter(lastVisibleDoc),
        limit(pageSize)
      );
    }

    const snapshot = await getDocs(q);
    const tasks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    const lastDoc = snapshot.docs[snapshot.docs.length - 1] || null;

    return {
      tasks,
      lastVisible: lastDoc
    };
  } catch (error) {
    console.error("Error fetching paginated tasks:", error);
    return {
      tasks: [],
      lastVisible: null
    };
  }
}

// Fetch summary counts for the dashboard
export async function getTasksSummary(email) {
  const tasksRef = collection(db, "tasks");
  const q = query(tasksRef, where("assignedTo", "==", email));
  const snapshot = await getDocs(q);

  let total = 0, ended = 0, running = 0, pending = 0;
  snapshot.forEach(doc => {
    total++;
    const status = doc.data().status;
    if (status === "Ended") ended++;
    else if (status === "Running") running++;
    else pending++;
  });

  return { total, ended, running, pending };
}
