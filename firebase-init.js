
initializeApp({
  apiKey: "AIzaSyDePtfAKouNDGoNY27_mIfSG096hRJ9U1U",
  authDomain: "adrix-1.firebaseapp.com",
  projectId: "adrix-1",
  storageBucket: "adrix-1.firebasestorage.app",
  messagingSenderId: "633957470456",
  appId: "1:633957470456:web:0865dfe89f5e9f6df2ab0d"
});

// initialize once
if (!window.firebase) {
  console.error("Firebase library not loaded.");
} else {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  } else {
    firebase.app();
  }
  // expose auth globally
  window.auth = firebase.auth();
  console.log("Firebase initialized");
}

<!-- Custom Script -->
<script type="module">"auth.js"</script>



