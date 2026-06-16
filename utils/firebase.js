// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "loginvirtualcourses-12445.firebaseapp.com",
    projectId: "loginvirtualcourses-12445",
    storageBucket: "loginvirtualcourses-12445.firebasestorage.app",
    messagingSenderId: "910734770667",
    appId: "1:910734770667:web:56024dafbdcf1b693319ae",
    measurementId: "G-8BGYTXRBJJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export { auth, provider };

// rpovider opens up the prompt for glogin
// auth helps us authenticate