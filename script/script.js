// DICHIARAZIONI GENERALI
const terms = document.querySelectorAll(".term");
const filterButtons = document.querySelectorAll(".dropdown-item[data-filter]");
const clearFiltersButton = document.getElementById("clear-vocabulary-filters");
const searchBar = document.getElementById("search-bar");
const modalElement = document.getElementById("filter-modal"); // Modale per i filtri
const modalOverlay = document.querySelector(".modal-overlay");
const accordions = document.querySelectorAll(".accordion");
const searchInput = document.querySelector(".searchInput");
const searchInputs = document.querySelectorAll(".searchInput");
const searchableItems = document.querySelectorAll(".searchable-item");
const sectionTitles = document.querySelectorAll(".section-title");
const termLinks = document.querySelectorAll(".termgl");
const cards = document.querySelectorAll(".col[data-category]");
const radioButtons = document.querySelectorAll(".btn-check");


// PAGINA VOCABOLI
document.addEventListener("DOMContentLoaded", () => {
    const terms = document.querySelectorAll(".term");
    const filterButtons = document.querySelectorAll(".dropdown-item[data-filter]");
    const clearFiltersButtons = document.querySelectorAll(".clear-vocabulary-filters");
    const searchBars = document.querySelectorAll(".search-bar");
    const activeFilters = {};
    const modalElement = document.getElementById("filter-modal");
     const sidebar = document.getElementById("filterSidebar");
    const toggleFiltersButton = document.getElementById("toggleFilters");
    const closeSidebarButton = document.getElementById("closeFilterSidebar");
    const transliterationMap = {
        "A": ["Α", "α", "Ἀ", "ἄ", "ἂ", "ἆ", "ἀ", "ά", "ὰ", "ᾶ", "ᾳ", "ᾴ", "ᾲ", "ᾷ"],
        "B": ["Β", "β"],
        "G": ["Γ", "γ"],
        "D": ["Δ", "δ"],
        "E": ["Ε", "ε", "Ἐ", "ἔ", "ἒ", "ἐ", "έ", "ὲ"],
        "Z": ["Ζ", "ζ"],
        "H": ["Η", "η", "Ἠ", "ἤ", "ἢ", "ἦ", "ἠ", "ή", "ὴ", "ῆ", "ῃ", "ῄ", "ῂ", "ῇ"],
        "Q": ["Θ", "θ"],
        "I": ["Ι", "ι", "Ἰ", "ἴ", "ἲ", "ἶ", "ἰ", "ί", "ὶ", "ῖ", "ϊ", "ΐ", "ῒ", "ῗ"],
        "K": ["Κ", "κ"],
        "L": ["Λ", "λ"],
        "M": ["Μ", "μ"],
        "N": ["Ν", "ν"],
        "C": ["Ξ", "ξ"],
        "O": ["Ο", "ο", "Ὀ", "ὄ", "ὂ", "ὀ", "ό", "ὸ"],
        "P": ["Π", "π"],
        "R": ["Ρ", "ρ", "Ῥ"],
        "S": ["Σ", "σ", "ς"],
        "T": ["Τ", "τ"],
        "U": ["Υ", "υ", "Ὑ", "Ὕ", "Ὓ", "Ὗ", "ύ", "ὺ", "ῦ", "ϋ", "ΰ", "ῢ", "ῧ"],
        "F": ["Φ", "φ"],
        "X": ["Χ", "χ"],
        "Y": ["Ψ", "ψ"],
        "W": ["Ω", "ω", "Ὠ", "ὤ", "ὢ", "ὦ", "ὠ", "ώ", "ὼ", "ῶ", "ῳ", "ῴ", "ῲ", "ῷ"]
    };

    // Funzione principale per applicare filtri e ricerca
    function applyFiltersAndSearch() {
        const searchQuery = Array.from(searchBars)
            .map(searchBar => searchBar.value.trim().toLowerCase())
            .find(query => query) || "";

        terms.forEach(term => {
            const boldTextElement = term.querySelector("b");
            const boldText = boldTextElement ? boldTextElement.textContent.trim() : "";
            const normalizedBoldText = boldText.normalize("NFC").toLowerCase();
            const categories = term.getAttribute("data-category").split(" ");

            let matchesSearch = true;
            let matchesFilters = true;

            // Ricerca
            if (searchQuery) {
                let queryRegexString = "";
                for (const char of searchQuery) {
                    const variants = transliterationMap[char.toUpperCase()] || [char];
                    queryRegexString += `(${variants.join("|")})`;
                }
                const searchRegex = new RegExp(queryRegexString, "i");
                const transliteratedText = Array.from(normalizedBoldText).map(char => {
                    for (const [key, values] of Object.entries(transliterationMap)) {
                        if (values.includes(char.toUpperCase())) return key.toLowerCase();
                    }
                    return char;
                }).join("");

                matchesSearch =
                    searchRegex.test(normalizedBoldText) || searchRegex.test(transliteratedText);
            }

            // Filtri
            Object.keys(activeFilters).forEach(filterType => {
                const filterValues = activeFilters[filterType];
                if (filterType === "Filtra per iniziale") {
                    if (!filterValues.some(initial => {
                        const possibleVariants = transliterationMap[initial.toUpperCase()] || [initial];
                        return possibleVariants.some(variant => normalizedBoldText.startsWith(variant));
                    })) {
                        matchesFilters = false;
                    }
                } else {
                    if (!filterValues.some(value => categories.includes(value))) {
                        matchesFilters = false;
                    }
                }
            });

            term.style.display = matchesSearch && matchesFilters ? "block" : "none";
        });
    }
     function applyFiltersFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        let hasFilters = false;

        urlParams.forEach((value, key) => {
            filterButtons.forEach(button => {
                if (button.getAttribute("data-filter") === value) {
                    let filterType;

                    // Cerca il tipo di filtro
                    const btnGroup = button.closest(".btn-group");
                    if (btnGroup) {
                        const parentButton = btnGroup.querySelector(".dropdown-toggle");
                        if (parentButton) {
                            filterType = parentButton.textContent.trim();
                        }
                    }

                    // Inizializza il filtro e applica la classe
                    if (filterType) {
                        if (!activeFilters[filterType]) {
                            activeFilters[filterType] = [];
                        }

                        if (!activeFilters[filterType].includes(value)) {
                            activeFilters[filterType].push(value);
                            button.classList.add("paginacorrente");
                            hasFilters = true;
                        }
                    }
                }
            });
        });

        if (hasFilters && modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        }

        applyFiltersAndSearch(); // Applica i filtri
    }

    // Chiama la funzione per applicare i filtri dall'URL
    applyFiltersFromURL();

    // Eventi per i filtri
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            let filterType;

            const btnGroup = button.closest(".btn-group");
            if (btnGroup) {
                const parentButton = btnGroup.querySelector(".dropdown-toggle");
                if (parentButton) {
                    filterType = parentButton.textContent.trim();
                }
            }

            if (!filterType) {
                const sidebarFilter = button.closest(".filter-sidebar");
                if (sidebarFilter) {
                    const parentButton = button.closest(".dropdown");
                    if (parentButton) {
                        filterType = parentButton.querySelector(".dropdown-toggle").textContent.trim();
                    }
                }
            }

            if (!filterType) return;

            const filterValue = button.getAttribute("data-filter");
            if (!activeFilters[filterType]) activeFilters[filterType] = [];

            const currentFilterValues = activeFilters[filterType];
            if (currentFilterValues.includes(filterValue)) {
                activeFilters[filterType] = currentFilterValues.filter(value => value !== filterValue);
                button.classList.remove("paginacorrente");
            } else {
                currentFilterValues.push(filterValue);
                button.classList.add("paginacorrente");
            }

            if (activeFilters[filterType].length === 0) delete activeFilters[filterType];

            applyFiltersAndSearch();
        });
    });

    // Eventi per la barra di ricerca
    searchBars.forEach(searchBar => {
        searchBar.addEventListener("input", () => {
            applyFiltersAndSearch();
        });
    });

    // Eventi per il reset dei filtri
    clearFiltersButtons.forEach(button => {
    button.addEventListener("click", () => {
        // Resetta i filtri attivi
        Object.keys(activeFilters).forEach(key => delete activeFilters[key]);

        // Rimuovi la classe "paginacorrente" da tutti i pulsanti di filtro
        filterButtons.forEach(filterButton => filterButton.classList.remove("paginacorrente"));

        // Resetta il valore delle barre di ricerca
        searchBars.forEach(searchBar => searchBar.value = "");

        // Mostra tutti i termini
        terms.forEach(term => term.style.display = "block");

        console.log("Tutti i filtri e la ricerca sono stati rimossi.");
    });
});


    // Inizializza i tooltip
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    if (toggleFiltersButton) {
        toggleFiltersButton.addEventListener("click", () => {
            sidebar.classList.add("open");
            toggleFiltersButton.style.display = "none"; // Nasconde il pulsante
        });
    }

    // Chiude la sidebar e mostra di nuovo il pulsante "Filtri"
    if (closeSidebarButton) {
        closeSidebarButton.addEventListener("click", () => {
            closeSidebar();
        });
    }

    // Chiude la sidebar quando si clicca fuori
  document.addEventListener("click", (event) => {
    if (sidebar && toggleFiltersButton) {
        const isClickInsideSidebar = sidebar.contains(event.target);
        const isClickOnToggleButton = toggleFiltersButton.contains(event.target);

        if (!isClickInsideSidebar && !isClickOnToggleButton && sidebar.classList.contains("open")) {
            closeSidebar();
        }
    }
});

    // Funzione per chiudere la sidebar
    function closeSidebar() {
        sidebar.classList.remove("open");
        toggleFiltersButton.style.display = "block"; // Mostra il pulsante
    }
});

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

            // Nasconde il pulsante se la sidebar è aperta
            if (sidebar.classList.contains("paginacorrente")) {
                toggleButton.style.display = "none";
            } else {
                toggleButton.style.display = "block";
            }
        });

        // Chiudi la sidebar cliccando fuori da essa
        document.addEventListener("click", function (event) {
            if (!sidebar.contains(event.target) && !toggleButton.contains(event.target)) {
                sidebar.classList.remove("paginacorrente");
                toggleButton.style.display = "block"; // Mostra il pulsante
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
function convertDate(dateStr) {
    if (dateStr.includes("a.C.")) {
        return -parseInt(dateStr.replace(/\D/g, ""));
    }
    return parseInt(dateStr.replace(/\D/g, ""));
}


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
function sortCards(sortType, order) {
    const cardContainer = document.querySelector(".row");

    if (!cardContainer) {
        console.error("Contenitore delle card non trovato!");
        return;
    }

    const sortedCards = Array.from(cards).sort((a, b) => {
        if (sortType === "date") {
            const dateA = convertDate(a.getAttribute("data-date"));
            const dateB = convertDate(b.getAttribute("data-date"));
            return order === "asc" ? dateA - dateB : dateB - dateA;
        } else if (sortType === "alpha") {
            const titleA = a.querySelector(".card-title").textContent.toLowerCase();
            const titleB = b.querySelector(".card-title").textContent.toLowerCase();
            return order === "asc" ? titleA.localeCompare(titleB) : titleB.localeCompare(titleA);
        }
    });

    cardContainer.innerHTML = ""; // Ripulisce il contenitore
    sortedCards.forEach(card => cardContainer.appendChild(card)); // Aggiunge le card ordinate
}


radioButtons.forEach(radio => {
    radio.addEventListener("change", () => {
        const filterType = radio.getAttribute("data-filter");
        const sortType = radio.getAttribute("data-sort");
        const order = radio.getAttribute("data-order");

        if (filterType) {
            filterCards(filterType);

            // Se "Mostra tutti" è selezionato, svuota tutte le barre di ricerca
            if (filterType === "all") {
                searchInputs.forEach(searchInput => {
                    searchInput.value = ""; // Svuota il campo di ricerca
                });

                // Mostra tutte le card
                cards.forEach(card => {
                    card.style.display = "block";
                });
            }
        } else if (sortType) {
            sortCards(sortType, order);
        }
    });
});

if (searchInputs.length > 0) {
    searchInputs.forEach(searchInput => {
        searchInput.addEventListener("input", () => {
            const query = searchInput.value.toLowerCase().trim();

            cards.forEach(card => {
                const titleElement = card.querySelector(".card-title");
                const descriptionElement = card.querySelector(".card-text");

                const title = titleElement ? titleElement.textContent.toLowerCase() : "";
                const description = descriptionElement ? descriptionElement.textContent.toLowerCase() : "";

                const matchesQuery = title.includes(query) || description.includes(query);
                card.style.display = matchesQuery ? "block" : "none";
            });
        });
    });
} else {
    console.warn("Nessuna barra di ricerca trovata con la classe .searchInput.");
}


searchInputs.forEach(searchInput => {
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase().trim();

        cards.forEach(card => {
            const titleElement = card.querySelector(".card-title");
            const descriptionElement = card.querySelector(".card-text");

            // Usa un valore vuoto se l'elemento non esiste
            const title = titleElement ? titleElement.textContent.toLowerCase() : "";
            const description = descriptionElement ? descriptionElement.textContent.toLowerCase() : "";

            const matchesQuery = title.includes(query) || description.includes(query);

            // Mostra o nasconde le card in base alla query
            card.style.display = matchesQuery ? "block" : "none";
        });
    });
});

// PAGINA CAMPO SEMANTICO/BOLLE
    const bubbles = document.querySelectorAll(".bolla");
    const modals = document.querySelectorAll(".modalebolla");
    const modalCloseButtons = document.querySelectorAll(".modalebolla-close"); 
    const overlay = document.querySelector(".modal-overlay"); 

    // Funzione per aprire un modale
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal && overlay) {
            modal.classList.add("show"); // Mostra il modale
            overlay.classList.add("show"); // Mostra l'overlay
        } else {
            console.error(`Modale con id "${modalId}" non trovato.`);
        }
    }

    // Funzione per chiudere un modale
    function closeModal(modal) {
        if (modal && overlay) {
            modal.classList.remove("show"); // Nasconde il modale
            overlay.classList.remove("show"); // Nasconde l'overlay
        }
    }

    // Event listener per aprire i modali cliccando sulle bolle
    bubbles.forEach(bubble => {
        bubble.addEventListener("click", () => {
            const modalId = bubble.getAttribute("data-modal"); // Ottieni l'id del modale
            if (modalId) {
                openModal(modalId);
            } else {
                console.error(`Attributo data-modal non trovato per la bolla:`, bubble);
            }
        });
    });

    // Event listener per chiudere i modali cliccando sulla "X"
    modalCloseButtons.forEach(closeButton => {
        closeButton.addEventListener("click", () => {
            const modal = closeButton.closest(".modalebolla");
            if (modal) {
                closeModal(modal);
            }
        });
    });

    // Event listener per chiudere i modali cliccando sull'overlay
    if (overlay) {
        overlay.addEventListener("click", () => {
            modals.forEach(modal => closeModal(modal)); // Chiude tutti i modali aperti
        });
    }


// TESTI IN TEI

    async function loadTEIContent(teiFilePath) {
    const teiContainer = document.getElementById("tei-content");

    try {
        // Carica il file TEI dal percorso specificato
        const response = await fetch(teiFilePath);
        if (!response.ok) throw new Error("Errore nel caricamento del file TEI.");
        
        const teiText = await response.text();

        // Parsing del file TEI come XML
        const parser = new DOMParser();
        const teiXML = parser.parseFromString(teiText, "application/xml");

        // Controlla se il file TEI contiene un <body>
        const body = teiXML.querySelector("body");
        if (!body) {
            teiContainer.innerHTML = "<p>Impossibile trovare il contenuto del file TEI.</p>";
            return;
        }

        // Estrazione del testo e degli speaker
        const paragraphs = [];
        let currentSpeaker = "";

        body.querySelectorAll("sp, p, l, div").forEach((node) => {
            if (node.tagName.toLowerCase() === "sp") {
                // Gli <sp> contengono sia speaker che battute
                const speakerElement = node.querySelector("speaker");
                if (speakerElement) {
                    currentSpeaker = `<strong class="tei-speaker">${speakerElement.textContent.trim()}</strong>: `;
                }
            } 
            
            if (node.tagName.toLowerCase() === "p" || node.tagName.toLowerCase() === "l" || node.tagName.toLowerCase() === "div") {
                // Se il paragrafo ha uno speaker associato, lo include
                paragraphs.push(`<p>${currentSpeaker}${node.textContent.trim()}</p>`);
                currentSpeaker = ""; // Reset dello speaker dopo la riga
            }
        });

        // Inserisce il contenuto elaborato nel container
        teiContainer.innerHTML = paragraphs.join("");
    } catch (error) {
        console.error("Errore durante il caricamento del file TEI:", error);
        teiContainer.innerHTML = "<p>Errore nel caricamento del file TEI.</p>";
    }
}

// Aggiungi l'evento al pulsante per caricare un file TEI specifico
document.addEventListener("DOMContentLoaded", () => {
    const acarnesiButton = document.querySelector('[data-bs-target="#testo-Acarnesi"]');
    if (acarnesiButton) {
        acarnesiButton.addEventListener("click", () => {
            loadTEIContent("../xml/ach.xml");  // Qui puoi cambiare il file da caricare dinamicamente
        });
    } else {
        console.log('Elemento con data-bs-target="#testo-Acarnesi" non trovato.');
    }
});


