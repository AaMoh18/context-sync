import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBJBUKRJxNW6PqobrB7SvXcxQ8XBzeqfXY",
  authDomain: "context-sync-bee6f.firebaseapp.com",
  projectId: "context-sync-bee6f",
  storageBucket: "context-sync-bee6f.firebasestorage.app",
  messagingSenderId: "619651237177",
  appId: "1:619651237177:web:d4d285d076a5d61c8294e8",
  measurementId: "G-EJGGBY8SKF"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);