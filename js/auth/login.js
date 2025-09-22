import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import { db } from "../firebase-config.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const usersCollection = collection(db, "users");
    const q = query(usersCollection, where("email", "==", email), where("password", "==", password));

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      localStorage.setItem("taskyUser", JSON.stringify({
        fullName: userData.fullName,
        username: userData.username,
        email: userData.email
      }));
      window.location.href = "dashboard.html";
    } else {
      alert("Invalid username or password");
    }
  });
});
