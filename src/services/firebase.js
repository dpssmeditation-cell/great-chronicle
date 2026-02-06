import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// TODO: Replace with your actual Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBDSq3H2gBfJZO68s3_my3inQSUUQ75rV0",
    authDomain: "chronicle-f5861.firebaseapp.com",
    projectId: "chronicle-f5861",
    storageBucket: "chronicle-f5861.firebasestorage.app",
    messagingSenderId: "40318576589",
    appId: "1:40318576589:web:e8d2f0d18f9ad12d7bc684"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);
