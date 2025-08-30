// taskUtils.js
export function getTaskFormData() {
  return {
    title: document.getElementById('task-title').value.trim(),
    description: document.getElementById('task-desc').value.trim(),
    dueDate: document.getElementById('task-date').value,
    assignedTo: document.getElementById('task-assign').value.trim(),
    createdAt: new Date().toISOString()
  };
}
