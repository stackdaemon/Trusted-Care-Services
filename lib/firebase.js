import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Hardcoded for immediate debugging/stability
const firebaseConfig = {
  apiKey: "AIzaSyBpf5uHI-jhh8ANdUAe37sK5-_QN_LRyL4",
  authDomain: "trusted-care-services.firebaseapp.com",
  projectId: "trusted-care-services",
  storageBucket: "trusted-care-services.firebasestorage.app",
  messagingSenderId: "978014450082",
  appId: "1:978014450082:web:651bc1d3f7a7bc54bd42fb"
};

console.log("Firebase Config:", firebaseConfig); // Debugging

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = getAuth(app);

export { auth };
