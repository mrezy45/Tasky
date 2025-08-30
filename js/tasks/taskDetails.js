import { db } from '../firebase-config.js';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

// References to DOM elements
const titleEl = document.getElementById("task-title");
const descEl = document.getElementById("task-description");
const dueDateEl = document.getElementById("task-due-date");
const assignedToEl = document.getElementById("task-assigned-to");
const assignedByEl = document.getElementById("task-assigned-by");
const statusEl = document.getElementById("task-status");
const progressEl = document.getElementById("progress-value");
const progressSlider = document.getElementById("progress-slider");
const statusButtons = document.querySelectorAll(".status-btn");

let currentTaskId = null; // will hold the ID after fetching

// Fetch all tasks and pick one to load
async function fetchAndLoadFirstTask() {
  try {
    const tasksCol = collection(db, "tasks");
    const taskSnapshot = await getDocs(tasksCol);

    if (taskSnapshot.empty) {
      alert("No tasks found in the database.");
      return;
    }

    // Pick the first task's ID
    currentTaskId = taskSnapshot.docs[0].id;

    // Load details of this task
    await loadTaskDetails(currentTaskId);
  } catch (err) {
    console.error("Error fetching tasks:", err);
  }
}

// Fetch and display the task details by ID
async function loadTaskDetails(taskId) {
  try {
    const taskRef = doc(db, "tasks", taskId);
    const taskSnap = await getDoc(taskRef);

    if (!taskSnap.exists()) {
      alert("Task not found");
      return;
    }

    const task = taskSnap.data();

    // Display task info
    titleEl.textContent = task.title;
    descEl.textContent = task.description;
    dueDateEl.textContent = task.dueDate || "--";
    assignedToEl.textContent = task.assignedTo || "--";
    assignedByEl.textContent = task.assignedBy || "--";
    statusEl.textContent = task.status || "Pending";
    progressSlider.value = task.progress || 0;
    progressEl.textContent = `${task.progress || 0}%`;
  } catch (err) {
    console.error("Error loading task details:", err);
  }
}

// Update task status
statusButtons.forEach(button => {
  button.addEventListener("click", async () => {
    if (!currentTaskId) return alert("No task selected");

    const newStatus = button.getAttribute("data-status");
    try {
      const taskRef = doc(db, "tasks", currentTaskId);
      await updateDoc(taskRef, { status: newStatus });
      statusEl.textContent = newStatus;
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  });
});

// Update task progress
progressSlider.addEventListener("progress-slider", async () => {
  if (!currentTaskId) return;

  const value = progressSlider.value;
  progressEl.textContent = `${value}%`;

  try {
    const taskRef = doc(db, "tasks", currentTaskId);
    await updateDoc(taskRef, { progress: parseInt(value) });
  } catch (err) {
    console.error("Failed to update progress:", err);
  }
});

// Initial load: fetch tasks and display the first one
fetchAndLoadFirstTask();
