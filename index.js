import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js'
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js'
import { 
        getAuth, 
        createUserWithEmailAndPassword, 
        RecaptchaVerifier, 
        signInWithEmailAndPassword, 
        updateProfile, 
        onAuthStateChanged, 
        signOut,
        sendEmailVerification,
        signInAnonymously,
        linkWithCredential 
    } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js'
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js'
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app-check.js';

const firebaseConfig = {
    apiKey: "AIzaSyAblmFhlC8NcUbtPEM71f9y5Yegi9oRY18",
    authDomain: "test-3dd11.firebaseapp.com",
    projectId: "test-3dd11",
    storageBucket: "test-3dd11.appspot.com",
    messagingSenderId: "425308473760",
    appId: "1:425308473760:web:031c5ab167d638b6e67cc5",
    measurementId: "G-5R87RZJ8G0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider('6Le2WTspAAAAAJv0rpVp88cR2n2lA7m44t1Wgm1M'),
    isTokenAutoRefreshEnabled: true
});
const auth = getAuth(app, appCheck);
const firestore = getFirestore(app, appCheck);

const analytics = getAnalytics(app);
const recaptchaContainer = document.getElementById('recaptcha-container');
const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
  size: 'invisible'
});

verifier.render().then((widgetId) => {
    try{   
        window.recaptchaWidgetId = widgetId;
    }
    catch(error){
        console.log('error appending child : ', error);
        displayError(error);
    }
});

//error popup
const displayError = (error) => {
    const msgbox = document.getElementById('msgbox');
    const errorMsg = document.getElementById('errorText');
    errorMsg.textContent = error.message;
    msgbox.style.display = 'flex';
    msgbox.classList.add('SlideIn');
    setTimeout(() => {
        msgbox.classList.remove('SlideIn');
        msgbox.classList.add('SlideOut');   
        msgbox.style.display = 'none';
        msgbox.classList.remove('SlideOut');
    }, 5000);
}

const userDetails = document.getElementById('user-details');
const signUpForm = document.getElementById('signup-form');
const signUpBtn = document.getElementById('signupbutton');
signUpBtn.addEventListener('click', (event) => {
    event.preventDefault();
    signUpBtn.disabled = 'true';
    const email = signUpForm.email.value;
    const password = signUpForm.password.value;
    
    verifier.verify()
    .then((response) => {
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const username = document.getElementById('Username').value;
            updateProfile(user, {
                displayName: username,
            })
            .then(() => {
                console.log('welcome ' + user.displayName);
                userDetails.textContent = userCredential.user.displayName;
                
            })
            const verificationModal = document.getElementById('modal');
            verificationModal.style.display = 'flex';
            sendEmailVerification(userCredential.user)
                .then(() => {
                    console.log('email sent successfully!');
                })
                .catch((error) => {
                    console.log("error sending email : ", error);
                    displayError(error);
                })
            console.log('please wait while email is being verified');
            setTimeout(() => {
                if(!user.emailVerified){
                    alert('email Verification Failed!');
                    user.delete()
                    .then(() => {
                        window.location.reload();
                    })
                    .catch((error) => {
                        displayError(error);
                    })
                }
                else{
                    console.log('email verification was successful!');
                }
            },60000);

            const checkVerificationStatus = setInterval(() => {
                auth.currentUser.reload();
                if(user && user.emailVerified){
                    clearInterval(checkVerificationStatus);
                    console.log('email verified successfully');
                    document.getElementById('checkIcon').style.display = 'block';
                    verificationModal.style.display = 'none';
                    setTimeout(()=>{
                        console.log('you are being redirected to landing page');
                        window.location.href = 'LandingPage/index.html';
                    }, 2000)
                }
            }, 3000);

            const cancelVerification = document.getElementById('cancel-verification');
            cancelVerification.addEventListener("click", (e) => {
                e.preventDefault();
                cancelVerification.disabled = 'true';
                clearInterval(checkVerificationStatus);
                // verificationModal.style.display = 'none';
                user.delete()
                    .then(() => {
                        window.location.reload();
                    })
                    .catch((error) => {
                        console.log('cancellation failed with error : ', error);
                        displayError(error);
                    })
            })
        })
        .catch((error) => {
            console.log('Registration Failed : ', error);
            alert('Registration Failed!');
            displayError(error);
        })   
    })
    .catch((error) => {
        console.log('captcha verification failed : ', error);
        displayError(error);
    })
})

onAuthStateChanged(auth, (user) => {
    if(user){
        const logoutButton = document.getElementById('logout');
        logoutButton.style.display = 'block';
        logoutButton.addEventListener("click", () => {
            signOut(auth);
            window.location.reload();
            alert('user logged out successfully');
            logoutButton.style.display = 'none';
        })
    }
    else{
        console.log("Please sign in");
    }
})
const signInForm = document.getElementById('signin-form');
const signInBtn = document.getElementById('signinbutton');
signInForm.addEventListener("submit", (event) =>{
    event.preventDefault();
    signInBtn.disabled = 'true';
    const signinEmail = document.getElementById('signin-email').value;
    const signinPassword = document.getElementById('signin-password').value;
    signInWithEmailAndPassword(auth, signinEmail,signinPassword)
    .then((userCredential) => {
        console.log('user signed in successfully!');
        console.log('Welcome '+ userCredential.user.displayName)
        userDetails.textContent = userCredential.user.displayName;
        window.location.href = 'LandingPage/index.html';
    })
    .catch((error) => {
        console.log('sign in failed with error : ', error);
        // alert('Incorrect Email or Password! Please try again!');
        displayError(error);
    })
})
