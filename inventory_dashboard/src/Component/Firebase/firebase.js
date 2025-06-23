import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAFQMoN80iuQkGBLLtNeVY7hOJpPCh3e5A",
  authDomain: "ndss-inventory-dashboard.firebaseapp.com",
  projectId: "ndss-inventory-dashboard",
  storageBucket: "ndss-inventory-dashboard.firebasestorage.app",
  messagingSenderId: "518437922787",
  appId: "1:518437922787:web:db0432cf24cdb8c2cee2d6"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider }