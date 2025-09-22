// dashboard-timer.js

document.addEventListener("DOMContentLoaded", () => {
  const timerDisplay = document.getElementById("timer-display");
  const playBtn = document.querySelector(".time-tracker button:nth-of-type(1)");

  let timer = null;
  let elapsed = 0;
  let running = false;
  let lastStart = null;

  function updateDisplay() {
    const hours = String(Math.floor(elapsed / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
    const seconds = String(elapsed % 60).padStart(2, '0');
    timerDisplay.textContent = `${hours}:${minutes}:${seconds}`;
  }

  function startTimer() {
    running = true;
    lastStart = Date.now();
    playBtn.textContent = '⏸';
    timer = setInterval(() => {
      elapsed += Math.floor((Date.now() - lastStart) / 1000);
      lastStart = Date.now();
      updateDisplay();
    }, 1000);
  }

  function stopTimer() {
    running = false;
    clearInterval(timer);
    elapsed += Math.floor((Date.now() - lastStart) / 1000);
    playBtn.textContent = '▶';
    updateDisplay();
  }

  playBtn.addEventListener("click", () => {
    if (!running) {
      startTimer();
    } else {
      stopTimer();
    }
  });

  // Optional: Reset on page load
  elapsed = 0;
  updateDisplay();
});
