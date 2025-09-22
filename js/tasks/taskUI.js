import { getPaginatedTasksForUser } from './taskService.js';

// Pagination state
let currentPage = 1;
const tasksPerPage = 3;
let lastVisibleDocs = []; // To keep track of Firestore document cursors

async function loadTasks(page) {
  const storedUser = JSON.parse(localStorage.getItem("taskyUser"));
  if (!storedUser) return;

  const lastDoc = lastVisibleDocs[page - 2] || null;
  const { tasks, lastVisible } = await getPaginatedTasksForUser(storedUser.email, tasksPerPage, lastDoc);

  // Store cursor for next pagination step
  if (lastVisible && !lastVisibleDocs[page - 1]) {
    lastVisibleDocs[page - 1] = lastVisible;
  }

  renderTaskList(tasks);
  renderPaginationControls(page);
}

function renderTaskList(tasks) {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";

  tasks.forEach(task => {
    const taskCard = document.createElement('div');
    taskCard.classList.add('task-card');
    taskCard.setAttribute('data-task-id', task.id); // Add data-task-id for modal
    taskCard.innerHTML = `
      <h3>${task.title}</h3>
      <p>${task.description}</p>
      <p><strong>Due:</strong> ${task.dueDate}</p>
      <p><strong>Assigned to:</strong> ${task.assignedTo}</p>
      <a href="#" class="view-task-link">View Details</a>
    `;
    // Only open modal, do not navigate
    taskCard.addEventListener('click', (e) => {
      e.preventDefault();
      // Modal logic handled by tasks-details-modal.js
    });
    taskList.appendChild(taskCard);
  });
}

function renderPaginationControls(activePage) {
  const paginationNumbers = document.getElementById("pagination-numbers");
  const prevBtn = document.getElementById("prev-page");
  const nextBtn = document.getElementById("next-page");

  paginationNumbers.innerHTML = `<span class="active">${activePage}</span>`;
  prevBtn.disabled = activePage === 1;
  nextBtn.disabled = !lastVisibleDocs[activePage - 1];
}

document.getElementById("prev-page").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    loadTasks(currentPage);
  }
});

document.getElementById("next-page").addEventListener("click", () => {
  if (lastVisibleDocs[currentPage - 1]) {
    currentPage++;
    loadTasks(currentPage);
  }
});

// 🔁 Initial load
document.addEventListener("DOMContentLoaded", () => {
  loadTasks(currentPage);
});
