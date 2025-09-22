// dashboard-modal.js

document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("open-task-form");
  const closeBtn = document.getElementById("close-task-form");
  const modal = document.getElementById("task-modal");

  if (openBtn && closeBtn && modal) {
    openBtn.addEventListener("click", () => {
      modal.classList.remove("hidden");
    });
    closeBtn.addEventListener("click", () => {
      modal.classList.add("hidden");
    });
  }
});
