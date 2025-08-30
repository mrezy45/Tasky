import { getTaskFormData } from './tasks/taskUtils.js';
import { saveTaskToDB, getTasksForUser, getUserByEmail } from './tasks/taskService.js';
import { renderTask } from './tasks/taskUI.js';

document.addEventListener("DOMContentLoaded", function () {
  const openBtn = document.getElementById("open-task-form");
  const closeBtn = document.getElementById("close-task-form");
  const modal = document.getElementById("task-modal");

  openBtn.addEventListener("click", function () {
    modal.classList.remove("hidden");
  });

  closeBtn.addEventListener("click", function () {
    modal.classList.add("hidden");
  });
});


// Logout functionality
document.getElementById('logout-btn').addEventListener('click', () => {
  // Remove user info from localStorage (or sessionStorage if you used that)
  localStorage.removeItem('taskyUser');

  // Redirect back to login page
  window.location.href = 'login.html';
});

//TASK FORM SUBMISSION
// main.js


document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('task-form');
  const modal = document.getElementById('task-modal');

  form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const task = getTaskFormData();
  const storedUser = JSON.parse(localStorage.getItem("taskyUser"));
  
  // 🔍 Get user info to access username
  const userInfo = await getUserByEmail(storedUser.email);

  // ✅ Set assignedBy to username
  task.assignedBy = userInfo?.username;

  // Save to Firestore
  const result = await saveTaskToDB(task);

  if (result.success) {
    renderTask(task);
    form.reset();
    modal.style.display = 'none';
  } else {
    alert('Failed to save task. See console for details.');
  }
});

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
