(() => {
  const form = document.getElementById("timeline-filters");
  const input = document.getElementById("timeline-search");
  const festivalFilter = document.getElementById("festival-filter");
  const decadeFilter = document.getElementById("decade-filter");
  const entries = Array.from(document.querySelectorAll(".timeline-list .searchable-item"));
  const status = document.getElementById("timeline-search-status");
  const emptyMessage = document.getElementById("timeline-empty");
  const timelineList = document.querySelector(".timeline-list");
  if (!form || !input || !festivalFilter || !decadeFilter || entries.length === 0 || !status || !emptyMessage || !timelineList) return;

  const normalize = (value) => value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("it");

  const updateResults = () => {
    const query = normalize(input.value.trim());
    const festival = festivalFilter.value;
    const decade = decadeFilter.value;
    let visibleCount = 0;
    const visibleEntries = [];

    entries.forEach((entry) => {
      const matches = normalize(entry.textContent).includes(query)
        && (!festival || entry.dataset.festival === festival)
        && (!decade || entry.dataset.decade === decade);
      entry.hidden = !matches;
      if (matches) {
        visibleCount += 1;
        visibleEntries.push(entry);
      }
    });

    const baseHeight = parseFloat(getComputedStyle(timelineList).getPropertyValue("--timeline-base-height")) || 112;
    visibleEntries.forEach((entry, index) => {
      const nextEntry = visibleEntries[index + 1];
      const yearGap = nextEntry ? Math.max(0, Number(entry.dataset.year) - Number(nextEntry.dataset.year)) : 0;
      entry.style.setProperty("--entry-height", `${Math.round(baseHeight + yearGap * 10)}px`);
    });

    status.textContent = `${visibleCount} ${visibleCount === 1 ? "commedia" : "commedie"}`;
    emptyMessage.hidden = visibleCount !== 0;
  };

  form.addEventListener("submit", (event) => event.preventDefault());
  input.addEventListener("input", updateResults);
  festivalFilter.addEventListener("change", updateResults);
  decadeFilter.addEventListener("change", updateResults);
  form.addEventListener("reset", () => requestAnimationFrame(updateResults));
  updateResults();
})();
