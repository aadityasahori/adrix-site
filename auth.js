import { auth } from "../../scripts/firebase-init.js";
import {
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  RecaptchaVerifier
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// 📧 Email/Password Login
window.loginWithEmail = function() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, pass)
    .then(user => alert("Login Successful: " + user.user.email))
    .catch(err => alert(err.message));
};

// 🌐 Google Login
window.loginWithGoogle = function() {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then(res => alert("Welcome " + res.user.displayName))
    .catch(err => alert(err.message));
};

// 🍎 Apple Login
window.loginWithApple = function() {
  const provider = new OAuthProvider('apple.com');
  signInWithPopup(auth, provider)
    .then(res => alert("Welcome " + res.user.displayName))
    .catch(err => alert(err.message));
};

// 🪟 Microsoft Login
window.loginWithMicrosoft = function() {
  const provider = new OAuthProvider('microsoft.com');
  signInWithPopup(auth, provider)
    .then(res => alert("Welcome " + res.user.displayName))
    .catch(err => alert(err.message));
};

// 📱 Phone Number Login
window.loginWithPhone = function() {
  const phoneNumber = prompt("Enter your phone number with country code:");
  window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {}, auth);

  signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier)
    .then(confirmationResult => {
      const code = prompt("Enter OTP sent to your phone:");
      return confirmationResult.confirm(code);
    })
    .then(res => alert("Phone Login Success: " + res.user.phoneNumber))
    .catch(err => alert(err.message));
};
