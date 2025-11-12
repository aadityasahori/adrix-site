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
    }
  });
});
