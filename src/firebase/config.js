import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA_lU6B3teMAf5GrnOCxr-ZWhw760tC1zI",
  authDomain: "expensetracker-d9a86.firebaseapp.com",
  databaseURL: "https://expensetracker-d9a86-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "expensetracker-d9a86",
  storageBucket: "expensetracker-d9a86.appspot.com",
  messagingSenderId: "912320588107",
  appId: "1:912320588107:web:5ec21ee4929f0ee17b60ce"
};

initializeApp(firebaseConfig);

const db = getFirestore();

export default db;