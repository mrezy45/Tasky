// tasks-details-modal.js
import { db } from '../firebase-config.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const taskList = document.getElementById("task-list");
  if (!taskList) return;

  // Create modal
  let modal = document.getElementById("task-details-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "task-details-modal";
    modal.className = "task-modal hidden";
    modal.innerHTML = `
      <div class="task-modal-content">
        <span id="close-task-details-modal" class="close-icon">&times;</span>
        <h2 id="modal-task-title">Task Details</h2>
        <p id="modal-task-description"></p>
        <dl class="task-meta">
          <dt><strong>Task ID:</strong></dt><dd id="modal-task-id">--</dd>
          <dt><strong>Due Date:</strong></dt><dd id="modal-task-due-date">--</dd>
          <dt><strong>Assigned To:</strong></dt><dd id="modal-task-assigned-to">--</dd>
          <dt><strong>Assigned By:</strong></dt><dd id="modal-task-assigned-by">--</dd>
          <dt><strong>Status:</strong></dt><dd id="modal-task-status">Pending</dd>
        </dl>
        <div class="task-progress">
          <p><strong>Progress:</strong> <span id="modal-progress-value">0%</span></p>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  // Close modal
  modal.querySelector("#close-task-details-modal").onclick = () => {
    modal.classList.add("hidden");
  };

  // Delegate click event to task cards
  taskList.addEventListener("click", async (e) => {
    let card = e.target.closest(".task-card");
    if (!card) return;
    const taskId = card.getAttribute("data-task-id");
    if (!taskId) return;

    // Fetch task details
    const taskRef = doc(db, "tasks", taskId);
    const taskSnap = await getDoc(taskRef);
    if (!taskSnap.exists()) return;
    const task = taskSnap.data();

    // Fill modal
    document.getElementById("modal-task-title").textContent = task.title || '--';
    document.getElementById("modal-task-description").textContent = task.description || '--';
    document.getElementById("modal-task-id").textContent = taskId;
    document.getElementById("modal-task-due-date").textContent = task.dueDate || '--';
    document.getElementById("modal-task-assigned-to").textContent = task.assignedTo || '--';
    document.getElementById("modal-task-assigned-by").textContent = task.assignedBy || '--';
    document.getElementById("modal-task-status").textContent = task.status || 'Pending';
    document.getElementById("modal-progress-value").textContent = `${task.progress || 0}%`;

    // Show modal
    modal.classList.remove("hidden");
  });
});
