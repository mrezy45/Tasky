import { saveUser } from './auth.js';

document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const fullName = document.getElementById('fullname').value.trim();
  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  const result = await saveUser({ fullName, username, email, password });

  if (result.success) {
    window.location.href = 'dashboard.html';
  } else {
    alert(`Error: ${result.error}`);
  }
});
