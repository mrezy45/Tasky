import { getTaskFormData } from './tasks/taskUtils.js';
import { saveTaskToDB, getTasksForUser, getUserByEmail, getTasksSummary } from './tasks/taskService.js';
import { renderTask } from './tasks/taskUI.js';
import { collection, query, where, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { db } from './firebase-config.js';

document.addEventListener("DOMContentLoaded", async function () {
  // Modal open/close logic
  const openBtn = document.getElementById("open-task-form");
  const closeBtn = document.getElementById("close-task-form");
  const modal = document.getElementById("task-modal");
  const form = document.getElementById('task-form');

  if (openBtn && modal) {
    openBtn.addEventListener("click", function () {
      console.log("New Task button clicked");
      modal.classList.remove("hidden");
    });
  } else {
    console.warn("openBtn or modal not found", openBtn, modal);
  }
  if (closeBtn && modal) {
    closeBtn.addEventListener("click", function () {
      modal.classList.add("hidden");
    });
  }

  // Task form submission
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const task = getTaskFormData();
      const storedUser = JSON.parse(localStorage.getItem("taskyUser"));
      const userInfo = await getUserByEmail(storedUser.email);
      task.assignedBy = userInfo?.username;
      const result = await saveTaskToDB(task);
      if (result.success) {
        renderTask(task);
        form.reset();
        modal.classList.add('hidden');
      } else {
        alert('Failed to save task. See console for details.');
      }
    });
  }

  // Set user info in dashboard topbar (wait for DOM)
   try {
      // 🔹 3. Get user document
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();

        // 🔹 4. Update DOM
        document.querySelectorAll(".username").forEach(el => el.textContent = data.username || "Unknown");
        document.querySelectorAll(".email").forEach(el => el.textContent = data.email || "No email");
      } else {
        console.log("No such user in Firestore");
      }
    } catch (err) {
      console.error("Error loading user data:", err);
    }
  });


// Fetch and display tasks for the logged-in user
document.addEventListener('DOMContentLoaded', async () => {
  const storedUser = JSON.parse(localStorage.getItem("taskyUser"));
  const email = storedUser.email;

  if (!email) {
    console.error("User email not found in localStorage.");
    window.location.href = 'login.html';
    return;
  }
  

  //Fetch tasks assigned to the user
  const tasks = await getTasksForUser(email);

  //Render each task
  tasks.forEach(task => renderTask(task));
  tasks.assignedBy = storedUser.email;
});

// Reminder functionality
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('reminder-modal');
  const openBtn = document.querySelector('.reminder-card button'); // "Set Reminder"
  const closeBtn = document.getElementById('close-reminder-modal');
  const reminderForm = document.getElementById('reminder-form');
  const remindersContainer = document.getElementById('reminders-container');

  // Open modal
  openBtn.addEventListener('click', () => {
    modal.classList.remove('hidden');
    loadReminders();
  });

  // Close modal
  closeBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  // Save Reminder
  reminderForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('reminder-title-input').value.trim();
    const start = document.getElementById('reminder-start').value;
    const stop = document.getElementById('reminder-stop').value;

    if (!title || !start || !stop) {
      alert("Please fill all fields.");
      return;
    }

    const reminder = {
      title,
      startTime: start,
      stopTime: stop,
      createdAt: new Date().toISOString()
    };

    // Save to localStorage (simulate DB)
    const reminders = JSON.parse(localStorage.getItem('taskyReminders')) || [];
    reminders.unshift(reminder); // newest first
    localStorage.setItem('taskyReminders', JSON.stringify(reminders));

    // Refresh UI
    reminderForm.reset();
    loadReminders();
  });

  // Load & Render Reminders
  function loadReminders() {
    remindersContainer.innerHTML = '';

    const reminders = JSON.parse(localStorage.getItem('taskyReminders')) || [];

    if (reminders.length === 0) {
      remindersContainer.innerHTML = '<li>No reminders yet.</li>';
      return;
    }

    reminders.forEach(reminder => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${reminder.title}</strong><br>
                      Start: ${reminder.startTime} | Stop: ${reminder.stopTime}`;
      remindersContainer.appendChild(li);
    });
  }

  // Optional: preload if modal opens automatically on load
  // loadReminders();
});

// Fetch and display dynamic summary cards and latest tasks
document.addEventListener("DOMContentLoaded", async () => {
  // Dynamic summary cards
  const user = JSON.parse(localStorage.getItem("taskyUser"));
  if (user && user.email) {
    const summary = await getTasksSummary(user.email);
    document.querySelector("#total-projects span").textContent = summary.total;
    document.querySelector("#ended-projects span").textContent = summary.ended;
    document.querySelector("#running-projects span").textContent = summary.running;
    document.querySelector("#pending-projects span").textContent = summary.pending;

    // Latest tasks
    const tasksRef = collection(db, "tasks");
    const q = query(tasksRef, where("assignedTo", "==", user.email), orderBy("dueDate", "desc"), limit(3));
    const snapshot = await getDocs(q);
    const tasksList = document.getElementById("tasks-list");
    tasksList.innerHTML = "";
    snapshot.forEach(doc => {
      const li = document.createElement("li");
      li.textContent = doc.data().title;
      tasksList.appendChild(li);
    });
  }
});
