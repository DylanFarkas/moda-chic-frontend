import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyA3KelBZFnCB_t-kca_J3rGXgUYfHQXF8c",
    authDomain: "ms-frontend-autentication.firebaseapp.com",
    projectId: "ms-frontend-autentication",
    storageBucket: "ms-frontend-autentication.firebasestorage.app",
    messagingSenderId: "1062414969754",
    appId: "1:1062414969754:web:d1f411996182cfc294a823",
    measurementId: "G-BSEV80X1SZ"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
