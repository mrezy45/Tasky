// Import Firebase core and Firestore
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDLgmcdF5-CPlhnHijcgl8HokmBqFxv7Gw",
  authDomain: "tasky-c3172.firebaseapp.com",
  projectId: "tasky-c3172",
  storageBucket: "tasky-c3172.firebasestorage.app",
  messagingSenderId: "597305604558",
  appId: "1:597305604558:web:88e7b8b1dec2e04476d39f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore instance
export const db = getFirestore(app);