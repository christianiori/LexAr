// DICHIARAZIONI GENERALI
// Seleziona tutti i termini e i bottoni dei filtri
const terms = document.querySelectorAll(".term");
const filterButtons = document.querySelectorAll(".dropdown-item[data-filter]");
const clearFiltersButton = document.getElementById("clear-vocabulary-filters");
const searchBar = document.getElementById("search-bar");
const modalElement = document.getElementById("filter-modal"); // Modale per i filtri
const modalOverlay = document.querySelector(".modal-overlay");
const accordions = document.querySelectorAll(".accordion");
const searchInput = document.getElementById("searchInput");
const searchableItems = document.querySelectorAll(".searchable-item");
const sectionTitles = document.querySelectorAll(".section-title");
const termLinks = document.querySelectorAll(".termgl");
const cards = document.querySelectorAll(".col[data-category]");
const radioButtons = document.querySelectorAll(".btn-check");

// PAGINA VOCABOLI

// Mantiene i filtri attivi
let activeFilters = {
    initials: new Set(),
    texts: new Set(),
    categories: new Set(),
    themes: new Set(),
    searchQuery: ""
};

// Mappa per traslitterazione greco-latino
const transliterationMap = {
    "α": "a", "ἀ": "a", "ἄ": "a", "ἆ": "a", "ἁ": "a", "ἅ": "a", "ἇ": "a", "β": "b", "γ": "g", "δ": "d", "ε": "e", "ζ": "z", "η": "h", "θ": "th", "ι": "i", "κ": "k", "λ": "l", "μ": "m", "ν": "n", "ξ": "x", "ο": "o", "π": "p", "ρ": "r", "σ": "s", "ς": "s", "τ": "t", "υ": "y", "φ": "ph", "χ": "ch", "ψ": "ps", "ω": "w", "Α": "a", "Ἀ": "a", "Ἄ": "a", "Ἆ": "a", "Ἁ": "a", "Ἅ": "a", "Ἇ": "a", "Β": "b", "Γ": "g", "Δ": "d", "Ε": "e", "Ζ": "z", "Η": "h", "Θ": "th", "Ι": "i", "Κ": "k", "Λ": "l", "Μ": "m", "Ν": "n", "Ξ": "x", "Ο": "o", "Π": "p", "Ρ": "r", "Σ": "s", "Τ": "t", "Υ": "y", "Φ": "ph", "Χ": "ch", "Ψ": "ps", "Ω": "w"
};

// Funzione per traslitterare il testo dal greco al latino
function transliterate(text) {
    return text
        .normalize("NFD") // Normalizza i caratteri con diacritici
        .split("")
        .map(char => transliterationMap[char] || char) // Applica la mappa di traslitterazione
        .join("")
        .toLowerCase(); // Converte tutto in minuscolo
}

// Funzione per normalizzare caratteri con diacritici
function normalizeString(str) {
    return str.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

// Funzione per aggiornare la visibilità dei termini
function updateFilters() {
    const normalizedSearchQuery = normalizeString(transliterate(activeFilters.searchQuery));

    terms.forEach(term => {
        const categories = term.getAttribute("data-category").split(" ");

        const initial = normalizeString(transliterate(term.querySelector("b").textContent.trim()[0]));
        console.log(`Iniziale trovata: ${initial}`); // Mostra l'iniziale trovata

        const termTextOriginal = term.querySelector("b").textContent;
        const termText = normalizeString(transliterate(termTextOriginal));

        const matchesInitials = activeFilters.initials.size === 0 || Array.from(activeFilters.initials).some(filter => filter === initial);

        const matchesTexts = activeFilters.texts.size === 0 || Array.from(activeFilters.texts).some(filter => categories.some(cat => normalizeString(cat) === filter));

        const matchesCategories = activeFilters.categories.size === 0 || Array.from(activeFilters.categories).some(filter => categories.some(cat => normalizeString(cat) === filter));

        const matchesThemes = activeFilters.themes.size === 0 || Array.from(activeFilters.themes).some(filter => categories.some(cat => normalizeString(cat) === filter));

        const matchesSearch = !activeFilters.searchQuery || termText.includes(normalizedSearchQuery);

        if (matchesInitials && matchesTexts && matchesCategories && matchesThemes && matchesSearch) {
            term.style.display = "block";
        } else {
            term.style.display = "none";
        }
    });

    // Aggiorna la classe 'paginacorrente' per i filtri attivi
    filterButtons.forEach(button => {
        const filterValue = normalizeString(transliterate(button.getAttribute("data-filter")));
        if (
            activeFilters.initials.has(filterValue) ||
            activeFilters.texts.has(filterValue) ||
            activeFilters.categories.has(filterValue) ||
            activeFilters.themes.has(filterValue)
        ) {
            button.classList.add("paginacorrente");
        } else {
            button.classList.remove("paginacorrente");
        }
    });
}

// Funzione per aggiungere o rimuovere filtri
function toggleFilter(filterSet, filterValue) {
    const normalizedFilter = normalizeString(transliterate(filterValue));
    if (filterSet.has(normalizedFilter)) {
        filterSet.delete(normalizedFilter);
    } else {
        filterSet.add(normalizedFilter);
    }
    updateFilters();
}

// Funzione per applicare filtri dall'URL e mostrare il modale
function applyFiltersFromURL() {
    const params = new URLSearchParams(window.location.search);
    let filtersApplied = false;

    params.forEach((value, key) => {
        const normalizedValue = normalizeString(transliterate(value)); // Normalizzazione del valore

        switch (key) {
            case "initial":
                activeFilters.initials.add(normalizedValue);
                filtersApplied = true;
                break;
            case "text":
                activeFilters.texts.add(normalizedValue);
                filtersApplied = true;
                break;
            case "category":
                activeFilters.categories.add(normalizedValue);
                filtersApplied = true;
                break;
            case "theme":
                activeFilters.themes.add(normalizedValue);
                filtersApplied = true;
                break;
            case "filter": // Gestione del filtro dall'URL
                activeFilters.categories.add(normalizedValue);
                filtersApplied = true;
                break;
            case "search":
                activeFilters.searchQuery = normalizedValue;
                filtersApplied = true;
                break;
        }
    });

    if (filtersApplied) {
        console.log("Filtri applicati. Mostro il modale.");
        updateFilters(); // Aggiorna i filtri attivi
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    } else {
        console.log("Nessun filtro applicato.");
    }
}

// Event listener per i bottoni dei filtri
filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        const filterValue = button.getAttribute("data-filter");
        const filterType = button.closest("[aria-label]").getAttribute("aria-label");

        switch (filterType) {
            case "Filtra per iniziale":
                toggleFilter(activeFilters.initials, filterValue);
                break;
            case "Filtra per testo":
                toggleFilter(activeFilters.texts, filterValue);
                break;
            case "Filtra per categoria grammaticale":
                toggleFilter(activeFilters.categories, filterValue);
                break;
            case "Filtra per campo semantico":
                toggleFilter(activeFilters.themes, filterValue);
                break;
        }
    });

    // Inizializza tooltip Bootstrap
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
});

// Event listener per il campo di ricerca
if (searchBar) {
    searchBar.addEventListener("input", () => {
        activeFilters.searchQuery = searchBar.value;
        updateFilters();
    });
} else {
    console.log("Elemento search-bar non presente in questa pagina.");
}

// Event listener per il pulsante di rimozione filtri
if (clearFiltersButton) {
    clearFiltersButton.addEventListener("click", () => {
        activeFilters.initials.clear();
        activeFilters.texts.clear();
        activeFilters.categories.clear();
        activeFilters.themes.clear();
        activeFilters.searchQuery = "";

        if (searchBar) {
            searchBar.value = "";
        }
        updateFilters();
    });
} else {
    console.log("Elemento clear-vocabulary-filters non trovato nel DOM.");
}

// Applica i filtri dall'URL al caricamento della pagina
window.addEventListener("DOMContentLoaded", () => {
    applyFiltersFromURL();
    setupBubblesModal();
});

document.addEventListener("DOMContentLoaded", () => {
  const filterSidebar = document.getElementById("filterSidebar");
  const toggleFiltersButton = document.getElementById("toggleFilters");
  const closeFilterSidebarButton = document.getElementById("closeFilterSidebar");
  const clearFiltersButton = document.getElementById("clearFilters");
  const filterButtons = document.querySelectorAll(".dropdown-item[data-filter]");

  // Apri la sidebar
  toggleFiltersButton.addEventListener("click", () => {
    filterSidebar.classList.add("open");
  });

  // Chiudi la sidebar
  closeFilterSidebarButton.addEventListener("click", () => {
    filterSidebar.classList.remove("open");
  });

  // Chiudi la sidebar cliccando fuori
  document.addEventListener("click", (event) => {
    if (!filterSidebar.contains(event.target) && event.target !== toggleFiltersButton) {
      filterSidebar.classList.remove("open");
    }
  });

  // Aggiungi comportamento ai filtri
if (filterButtons.length > 0) {
  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const filterValue = button.getAttribute("data-filter");
      if (filterValue) {
        console.log(`Filtro applicato: ${filterValue}`);
        toggleFilter(activeFilters.categories, filterValue);
      } else {
        console.warn("Il pulsante non ha un valore di filtro valido.");
      }
    });
  });
} else {
  console.warn("Nessun pulsante di filtro trovato nel DOM.");
}

  // Rimuovi tutti i filtri
  clearFiltersButton.addEventListener("click", () => {
    activeFilters.initials.clear();
    activeFilters.texts.clear();
    activeFilters.categories.clear();
    activeFilters.themes.clear();
    activeFilters.searchQuery = "";
    updateFilters(); // Funzione esistente
    filterSidebar.classList.remove("open");
  });
});


// PAGINA LESAMB

function setupBubblesModal() {
    const bubbles = document.querySelectorAll(".bolla");
    const modalOverlay = document.querySelector(".modal-overlay");

    if (!modalOverlay) {
        console.log("Elemento modal-overlay non trovato nel DOM. La funzione setupBubblesModal non verrà eseguita.");
        return; // Esce dalla funzione se l'overlay non esiste
    }

    console.log("Bolle trovate:", bubbles); // Debug: verifica le bolle trovate

    bubbles.forEach(bolla => {
        bolla.addEventListener("click", () => {
            const targetModalId = bolla.getAttribute("data-modal");
            console.log("Modal da aprire:", targetModalId); // Debug: id del modale

            const targetModal = document.getElementById(targetModalId);
            if (!targetModal) {
                console.error("Modale non trovato:", targetModalId);
                return;
            }

            console.log("Modal trovato:", targetModal); // Debug: modale trovato
            targetModal.classList.add("show");
            modalOverlay.classList.add("show"); // Mostra l'overlay

            const closeModalButton = targetModal.querySelector(".modalebolla-close");
            if (!closeModalButton) {
                console.error(`Elemento .modalebolla-close non trovato in ${targetModalId}`);
                return;
            }

            console.log("Elemento closeModal trovato:", closeModalButton); // Debug: bottone di chiusura
            closeModalButton.addEventListener("click", () => {
                targetModal.classList.remove("show");
                modalOverlay.classList.remove("show"); // Nascondi l'overlay
            }, { once: true });

            modalOverlay.addEventListener("click", () => {
                targetModal.classList.remove("show");
                modalOverlay.classList.remove("show"); // Nascondi l'overlay
            }, { once: true });
        });
    });
}

// PAGINA INDEX

    if (accordions.length > 0) {
        console.log(`Trovati ${accordions.length} accordion nella pagina.`);

        // Aggiungi il comportamento a ogni accordion
        accordions.forEach(accordion => {
            accordion.addEventListener("click", function () {
                // Alterna la classe "active" per cambiare lo stile
                this.classList.toggle("active");

                // Mostra o nasconde il pannello associato
                const panel = this.nextElementSibling;
                if (panel.style.display === "block") {
                    panel.style.display = "none";
                } else {
                    panel.style.display = "block";
                }
            });
        });

        console.log("Accordion configurati.");
    } else {
        console.log("Nessun elemento accordion trovato nella pagina.");
    }

    document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.getElementById("toggleMenu");
    const sidebar = document.getElementById("mobileSidebar");

    // Aggiungi l'evento al pulsante di apertura
    if (toggleButton && sidebar) {
        toggleButton.addEventListener("click", function () {
            sidebar.classList.toggle("paginacorrente");
        });

        // Chiudi la sidebar cliccando fuori da essa
        document.addEventListener("click", function (event) {
            if (!sidebar.contains(event.target) && !toggleButton.contains(event.target)) {
                sidebar.classList.remove("paginacorrente");
            }
        });
    } else {
        console.error("Elemento toggleMenu o mobileSidebar non trovato.");
    }
});

// PAGINA TIMELINE

if (searchInput && searchableItems.length > 0) {
        console.log("Barra di ricerca configurata per la timeline.");

        searchInput.addEventListener("input", () => {
            const query = searchInput.value.toLowerCase().trim();

            searchableItems.forEach(item => {
                const itemText = item.textContent.toLowerCase();
                if (itemText.includes(query)) {
                    item.style.display = "block";
                } else {
                    item.style.display = "none";
                }
            });
        });
    } else {
        console.log("Barra di ricerca o elementi filtrabili non trovati in questa pagina.");
    }

// PAGINA GLOSSARIO
if (document.querySelector(".section-container")) {
    console.log("Pagina Glossario rilevata. Configurazione funzionalità specifiche.");

    // Funzionalità per il toggle delle sezioni
    sectionTitles.forEach(title => {
        title.addEventListener("click", () => {
            const sectionContent = title.nextElementSibling;
            if (sectionContent) {
                sectionContent.style.display = sectionContent.style.display === "block" ? "none" : "block";
            } else {
                console.error("Contenuto della sezione non trovato:", title);
            }
            sectionTitles.forEach(t => t.classList.remove("section-title-selected")); // Rimuovi classe attiva da tutti
            title.classList.add("section-title-selected");
        });
    });

    // Funzionalità per il toggle dei termini
    termLinks.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const termId = link.getAttribute("href").replace("#", "");
            const termDescription = document.getElementById(termId);
            if (termDescription) {
                termDescription.style.display = termDescription.style.display === "block" ? "none" : "block";
            } else {
                console.error("Descrizione del termine non trovata per:", termId);
            }
            termLinks.forEach(l => l.classList.remove("termgl-selected")); // Rimuovi classe attiva da tutti
                link.classList.add("termgl-selected");
        });
    });

    console.log("Funzionalità per il glossario configurate.");
} else {
    console.log("Pagina Glossario non rilevata.");
}

// PAGINE CATALOGO
// Funzione per filtrare le card
    function filterCards(filterType) {
        cards.forEach(card => {
            const categories = card.getAttribute("data-category").split(" ");
            if (filterType === "all" || categories.includes(filterType)) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    }

    // Funzione per ordinare le card
    function sortCards(sortType, order) {
        const cardContainer = document.querySelector(".row-cols-1");
        const sortedCards = Array.from(cards).sort((a, b) => {
            if (sortType === "date") {
                const dateA = parseInt(a.getAttribute("data-date").replace(/\D/g, ""));
                const dateB = parseInt(b.getAttribute("data-date").replace(/\D/g, ""));
                return order === "asc" ? dateA - dateB : dateB - dateA;
            } else if (sortType === "alpha") {
                const titleA = a.querySelector(".card-title").textContent.toLowerCase();
                const titleB = b.querySelector(".card-title").textContent.toLowerCase();
                return order === "asc" ? titleA.localeCompare(titleB) : titleB.localeCompare(titleA);
            }
        });
        cardContainer.innerHTML = "";
        sortedCards.forEach(card => cardContainer.appendChild(card));
    }

    // Listener per i radio button
    radioButtons.forEach(radio => {
        radio.addEventListener("change", () => {
            const filterType = radio.getAttribute("data-filter");
            const sortType = radio.getAttribute("data-sort");
            const order = radio.getAttribute("data-order");

            if (filterType) {
                filterCards(filterType);
            } else if (sortType) {
                sortCards(sortType, order);
            }
        });
    });

// ACARNESI

    async function loadTEIContent() {
    const teiContainer = document.getElementById("tei-content");

    try {
        // Carica il file TEI
        const response = await fetch("../xml/ach.xml");
        const teiText = await response.text();

        // Parsing del file TEI come XML
        const parser = new DOMParser();
        const teiXML = parser.parseFromString(teiText, "application/xml");

        // Trasformazione di base per estrarre il contenuto del corpo del testo
        const body = teiXML.querySelector("body");
        if (body) {
            const paragraphs = Array.from(body.querySelectorAll("p, l")).map(
                (node) => `<p>${node.textContent}</p>`
            );
            teiContainer.innerHTML = paragraphs.join("");
        } else {
            teiContainer.innerHTML = "<p>Impossibile trovare il contenuto del file TEI.</p>";
        }
    } catch (error) {
        console.error("Errore durante il caricamento del file TEI:", error);
        teiContainer.innerHTML = "<p>Errore nel caricamento del file TEI.</p>";
    }
}

// Aggiungi l'evento al pulsante
document.addEventListener("DOMContentLoaded", () => {
    const acarnesiButton = document.querySelector('[data-bs-target="#testo-Acarnesi"]');
    if (acarnesiButton) {
        acarnesiButton.addEventListener("click", () => {
            loadTEIContent();
        });
    } else {
        console.log('Elemento con data-bs-target="#testo-Acarnesi" non trovato.');
    }
});

