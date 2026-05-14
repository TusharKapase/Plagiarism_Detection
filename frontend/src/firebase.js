import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAmfC8FekJwMtVTtJ9W1_LeQUvZ339guCs",
  authDomain: "plagiarism-detection-4cd78.firebaseapp.com",
  projectId: "plagiarism-detection-4cd78",
  storageBucket: "plagiarism-detection-4cd78.firebasestorage.app",
  messagingSenderId: "351691486240",
  appId: "1:351691486240:web:736002847d907e002fb845"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);