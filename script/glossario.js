(() => {
  const form = document.getElementById("glossary-controls");
  const search = document.getElementById("glossary-search");
  const reset = document.getElementById("glossary-reset");
  const count = document.getElementById("glossary-result-count");
  const empty = document.getElementById("glossary-empty");
  const entries = [...document.querySelectorAll(".glossary-item")];
  const filters = [...document.querySelectorAll(".glossary-filter")];

  if (!form || !search || !count || !empty || entries.length === 0) return;

  let activeCategory = "all";
  const normalize = (value) => value
    .toLocaleLowerCase("it")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ς/g, "σ")
    .trim();

  const updateResults = () => {
    const query = normalize(search.value);
    let visibleCount = 0;

    entries.forEach((entry) => {
      const searchableText = normalize(`${entry.textContent} ${entry.dataset.keywords || ""}`);
      const matchesCategory = activeCategory === "all" || entry.dataset.category === activeCategory;
      const matchesQuery = !query || searchableText.includes(query);
      const isVisible = matchesCategory && matchesQuery;
      entry.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    count.textContent = visibleCount === 1 ? "1 voce" : `${visibleCount} voci`;
    empty.hidden = visibleCount !== 0;
  };

  form.addEventListener("submit", (event) => event.preventDefault());
  search.addEventListener("input", updateResults);

  filters.forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category || "all";
      filters.forEach((filter) => {
        const isActive = filter === button;
        filter.classList.toggle("is-active", isActive);
        filter.setAttribute("aria-pressed", String(isActive));
      });
      updateResults();
    });
  });

  reset?.addEventListener("click", () => {
    search.value = "";
    activeCategory = "all";
    filters.forEach((filter) => {
      const isActive = filter.dataset.category === "all";
      filter.classList.toggle("is-active", isActive);
      filter.setAttribute("aria-pressed", String(isActive));
    });
    entries.forEach((entry) => {
      const details = entry.querySelector("details");
      if (details) details.open = false;
    });
    updateResults();
    search.focus();
  });

  updateResults();
})();
