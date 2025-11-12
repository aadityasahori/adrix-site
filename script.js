// Replace this with your actual backend URL from Render
const BACKEND_URL = "https://adrix-backend-dhpw.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("searchForm");
  const input = document.getElementById("searchInput");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const query = input.value.trim();
    if (!query) {
      alert("Please type something to search.");
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Network response was not ok");

      const data = await res.json();
      alert(data.message); // simple display for now
    } catch (err) {
      console.error("Search error:", err);
      alert("Search failed. Check console for details.");

      loginBtn.addEventListener("click", async () => {
  try {
    const userCredential = await firebase.auth().signInWithEmailAndPassword(
      emailInput.value,
      passwordInput.value
    );
    statusText.textContent = `Logged in as ${userCredential.user.email}`;
  } catch (error) {
    statusText.textContent = error.message;
  }
});

// LOGOUT
logoutBtn.addEventListener("click", async () => {
  await firebase.auth().signOut();
});

// Listen for auth changes
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    statusText.textContent = `Logged in as ${user.email}`;
    logoutBtn.style.display = "inline-block";
    loginBtn.style.display = "none";
    signupBtn.style.display = "none";
  } else {
    statusText.textContent = "Not logged in";
    logoutBtn.style.display = "none";
    loginBtn.style.display = "inline-block";
    signupBtn.style.display = "inline-block";
    }
  });
});
