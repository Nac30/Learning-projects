"use strict";

/* === Element References === */
const searchInput = document.querySelector(".search-text");
const refreshBtn = document.querySelector(".search-btn");
let videoCards = Array.from(document.querySelectorAll(".card"));
const noResults = document.getElementById("no-results");
const filterBtns = Array.from(document.querySelectorAll(".filter"));

/* === Utility Helpers === */

// Normalize string: safe lowercase comparison
const norm = (s) => String(s || "").trim().toLowerCase();

// Get currently active filter text
function getActiveFilterText() {
  const active = document.querySelector(".filter.active");
  return active ? active.textContent.trim() : "All";
}

// Parse categories from a card into an array
function parseCardCategories(card) {
  const raw = card.dataset.category || "";
  return raw
    .split(",") // support "Music, Animation" or "Music,Animation"
    .map((c) => norm(c))
    .filter(Boolean);
}

/* === Core Filtering Logic === */
function applyFilters() {
  const q = norm(searchInput.value); // search query
  const selected = norm(getActiveFilterText()); // current category
  let visibleCount = 0;

  videoCards.forEach((card) => {
    const title = norm(card.dataset.title);
    const uploader = norm(card.dataset.uploader);
    const cats = parseCardCategories(card);

    // Search: passes if no query OR title/uploader contains query
    const matchesSearch = !q || title.includes(q) || uploader.includes(q);

    // Category: passes if "all" OR selected category is in card’s categories
    const matchesCategory = selected === "all" || cats.includes(selected);

    if (matchesSearch && matchesCategory) {
      card.style.display = ""; // restore CSS default (let grid work)
      visibleCount++;
    } else {
      card.style.display = "none";
    }
  });

  // Show/hide "No results" after loop
  noResults.classList.toggle("hidden", visibleCount > 0);
}

/* === Event Wiring === */

// Real-time search
searchInput.addEventListener("input", applyFilters);

// Refresh button clears BOTH search & filter
refreshBtn.addEventListener("click", () => {
  // Clear search text
  searchInput.value = "";

  // Reset filter to "All"
  filterBtns.forEach((b) => b.classList.remove("active"));
  const allBtn = filterBtns.find((b) => b.textContent.trim() === "All");
  if (allBtn) {
    allBtn.classList.add("active");
  }

  // Re-apply filters
  applyFilters();
});

// Filter buttons
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Remove active from all
    filterBtns.forEach((b) => b.classList.remove("active"));

    // Add active to clicked button
    btn.classList.add("active");

    applyFilters();
  });
});

/* === Initialize on Page Load === */
applyFilters();
