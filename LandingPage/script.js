import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js'
import { getAuth, createUserWithEmailAndPassword, RecaptchaVerifier, signInWithEmailAndPassword, updateProfile, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js'

const firebaseConfig = {
    apiKey: "AIzaSyAblmFhlC8NcUbtPEM71f9y5Yegi9oRY18",
    authDomain: "test-3dd11.firebaseapp.com",
    projectId: "test-3dd11",
    storageBucket: "test-3dd11.appspot.com",
    messagingSenderId: "425308473760",
    appId: "1:425308473760:web:031c5ab167d638b6e67cc5",
    measurementId: "G-5R87RZJ8G0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
    if(user){
        console.log("welcome " + user.displayName);
        document.getElementById('user-name').textContent = user.displayName;
        const logOutBtn = document.getElementById('log-out');
        logOutBtn.addEventListener("click", () => {
            signOut(auth);
            window.location.href = '../index.html';
        })
    }
    else{
        window.location.href = '../index.html';
    }
})