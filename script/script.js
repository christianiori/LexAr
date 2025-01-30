// DICHIARAZIONI GENERALI
const terms = document.querySelectorAll(".term");
const filterButtons = document.querySelectorAll(".dropdown-item[data-filter]");
const clearFiltersButton = document.getElementById("clear-vocabulary-filters");
const searchBar = document.getElementById("search-bar");
const modalElement = document.getElementById("filter-modal"); // Modale per i filtri
const modalOverlay = document.querySelector(".modal-overlay");
const accordions = document.querySelectorAll(".accordion");
const searchInput = document.querySelector(".searchInput");
const searchInputs = document.querySelectorAll(".search-bar, .searchInput");
const searchableItems = document.querySelectorAll(".searchable-item");
const sectionTitles = document.querySelectorAll(".section-title");
const termLinks = document.querySelectorAll(".termgl");
const cards = document.querySelectorAll(".col[data-category]");
const radioButtons = document.querySelectorAll(".btn-check");
const showAllButton = document.querySelector('[data-filter="all"]');
const toggleFiltersButton = document.getElementById("toggleFilters");
const container = document.querySelector(".row.row-cols-1.row-cols-md-3.g-4");
const sortButtons = document.querySelectorAll(".btn-check[data-sort]");
const searchButton = document.getElementById("searchButton");

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
    const filterSidebar = document.getElementById("filterSidebar");
    const closeSidebarButton = document.getElementById("closeFilterSidebar");
    const searchButton = document.getElementById("searchButton");
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

        // Estrai il significato italiano rimuovendo il vocabolo in greco
        const meaningText = term.innerHTML.replace(/<b>.*?<\/b>/, "").replace(/[^=]*=\s*/, "").trim().toLowerCase();

        const categories = term.getAttribute("data-category").split(" ");

        let matchesSearch = true;
        let matchesFilters = true;

        // Ricerca nei vocaboli greci o nei significati italiani
        if (searchQuery) {
            let queryRegexString = "";
            for (const char of searchQuery) {
                const variants = transliterationMap[char.toUpperCase()] || [char];
                queryRegexString += `(${variants.join("|")})`;
            }
            const searchRegex = new RegExp(queryRegexString, "i");

            // Normalizza la traslitterazione per il greco
            const transliteratedText = Array.from(normalizedBoldText).map(char => {
                for (const [key, values] of Object.entries(transliterationMap)) {
                    if (values.includes(char.toUpperCase())) return key.toLowerCase();
                }
                return char;
            }).join("");

            const exactSearchRegex = new RegExp(`\\b${searchQuery}\\b`, "i"); // Cerca solo parole intere
            matchesSearch = searchRegex.test(normalizedBoldText) ||
            searchRegex.test(transliteratedText) ||
            exactSearchRegex.test(meaningText);

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

    // Funzione per chiudere la sidebar e per il bottone cerca
    function closeSidebar() {
        sidebar.classList.remove("open");
        toggleFiltersButton.style.display = "block"; // Mostra il pulsante
    }

    function closeFilterSidebar() {
    if (filterSidebar) {
        filterSidebar.classList.remove("open"); // Chiude la sidebar
    }
    if (toggleFiltersButton) {
        toggleFiltersButton.style.display = "block"; // Riappare il pulsante "Filtri"
    }
}

    if (searchButton) {
        searchButton.addEventListener("click", () => {
            applyFiltersAndSearch(); // Avvia la ricerca
            closeFilterSidebar(); // Chiude la sidebar dei filtri
        });
    }

    if (searchInput) {
        searchInput.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                applyFiltersAndSearch(); // Avvia la ricerca
                closeFilterSidebar(); // Chiude la sidebar dei filtri
            }
        });
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
    if (!dateStr) return 0;
    if (dateStr.includes("a.C.")) {
        return -parseInt(dateStr.replace(/\D/g, ""));
    }
    return parseInt(dateStr.replace(/\D/g, ""));
}

function SortCards() {
    let items = Array.from(container.children);

    const selectedFilters = Array.from(document.querySelectorAll(".btn-check[data-filter]:checked"))
                                .map(btn => btn.getAttribute("data-filter"));

    if (selectedFilters.length > 0) {
        items.forEach(item => {
            const categoryAttr = item.getAttribute("data-category");
            const categories = categoryAttr ? categoryAttr.split(" ") : [];
            const matchesFilter = selectedFilters.some(filter => categories.includes(filter));
            item.style.display = matchesFilter ? "block" : "none";
        });
    } else {
        items.forEach(item => item.style.display = "block");
    }

    const sortButton = document.querySelector(".btn-check[data-sort]:checked");
    if (!sortButton) return;

    const criteria = sortButton.getAttribute("data-sort");
    const order = sortButton.getAttribute("data-order");

    let visibleItems = items.filter(item => item.style.display !== "none");

    visibleItems.sort((a, b) => {
        let valueA, valueB;

        if (criteria === "date") {
            valueA = convertDate(a.getAttribute("data-date"));
            valueB = convertDate(b.getAttribute("data-date"));
            return order === "asc" ? valueA - valueB : valueB - valueA;
        }

        if (criteria === "alpha") {
            valueA = a.querySelector(".card-title").textContent.trim().toLowerCase();
            valueB = b.querySelector(".card-title").textContent.trim().toLowerCase();
            return order === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        }
    });

    visibleItems.forEach(item => container.appendChild(item));
}

document.querySelectorAll(".btn-check[data-filter]").forEach(button => {
    button.addEventListener("change", () => {
        SortCards();
    });
});

    function applySearch() {
        let query = searchInputs[0].value.trim().toLowerCase();
        const terms = document.querySelectorAll(".col[data-category]");

        terms.forEach(term => {
            const title = term.querySelector(".card-title")?.textContent.trim().toLowerCase() || "";
            term.style.display = title.includes(query) ? "block" : "none";
        });

        if (filterSidebar) filterSidebar.classList.remove("open");
        if (toggleFiltersButton) toggleFiltersButton.style.display = "block";
    }

    function showAllItems() {
        document.querySelectorAll(".col[data-category]").forEach(term => {
            term.style.display = "block";
        });
        searchInputs.forEach(input => input.value = "");
    }

    filterButtons.forEach(button => button.addEventListener("change", SortCards));

    // ✅ Eventi per ORDINAMENTO
    sortButtons.forEach(button => button.addEventListener("change", SortCards));

    // ✅ Eventi per la RICERCA
    if (searchButton) {
        searchButton.addEventListener("click", applySearch);
    } else {
        console.warn("⚠️ searchButton non esiste in questa pagina.");
    }

    searchInputs.forEach(input => {
        input.addEventListener("keypress", event => {
            if (event.key === "Enter") {
                applySearch();
            }
        });
    });

    if (showAllButton) {
        showAllButton.addEventListener("change", showAllItems);
    }

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

    if (!teiContainer) {
        console.error("❌ Errore: Elemento #tei-content non trovato nel DOM.");
        return;
    }

    try {
        console.log(`🔄 Caricamento file TEI da: ${teiFilePath}`);

        const response = await fetch(teiFilePath);
        if (!response.ok) throw new Error(`Errore nel caricamento del file TEI: ${response.status}`);

        const teiText = await response.text();

        // Parsing XML
        const parser = new DOMParser();
        const teiXML = parser.parseFromString(teiText, "application/xml");

        // Controlla se il file TEI contiene un <body>
        const body = teiXML.querySelector("body");
        if (!body) {
            teiContainer.innerHTML = "<p>❌ Contenuto TEI non trovato.</p>";
            return;
        }

        // Estrazione delle parti con gli speaker
        const paragraphs = [];
        body.querySelectorAll("sp").forEach((speech) => {
            const speakerElement = speech.querySelector("speaker");
            const speaker = speakerElement ? `<strong class="tei-speaker">${speakerElement.textContent.trim()}</strong>` : "";
            const speechLines = Array.from(speech.querySelectorAll("l"))
                                     .map(line => `<div class="tei-line">${line.textContent.trim()}</div>`)
                                     .join("");

            paragraphs.push(`<div class="tei-speech">${speaker}${speechLines}</div>`);
        });

        // Inserisce il contenuto elaborato
        teiContainer.innerHTML = paragraphs.join("");
        console.log("✅ Contenuto TEI caricato con successo.");

    } catch (error) {
        console.error("❌ Errore durante il caricamento del file TEI:", error);
        teiContainer.innerHTML = `<p>⚠️ Errore nel caricamento del file TEI. Controlla la console per maggiori dettagli.</p>`;
    }
}

// Evento al pulsante per caricare il file TEI
async function getTermsFromTEI(teiFilePath) {
    try {
        const response = await fetch(teiFilePath);
        if (!response.ok) throw new Error(`Errore nel caricamento del file TEI: ${response.status}`);

        const teiText = await response.text();
        console.log("📄 Contenuto TEI caricato:", teiText); // DEBUG: Verifica che il file sia stato letto

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(teiText, "application/xml");

        // **Estrazione delle linee di testo contenute nei tag <l>**
        const lines = Array.from(xmlDoc.getElementsByTagName("l")).map(el => el.textContent.trim());

        console.log("📝 Testo estratto da <l>:", lines); // DEBUG: Controlla il contenuto estratto

        // Se non troviamo righe, mostriamo un messaggio di errore
        if (lines.length === 0) {
            console.warn("⚠️ Nessun testo trovato nei tag <l>. Verifica la struttura del file TEI.");
            return [];
        }

        // **Unire tutte le righe in un unico testo**
        const fullText = lines.join(" ");

        // **Estrarre le parole greche**
        const words = fullText.match(/\b[α-ωΑ-Ω]+\b/g); // Prende solo parole in greco

        if (!words) {
            console.warn("⚠️ Nessuna parola greca trovata nel testo.");
            return [];
        }

        // **Conta la frequenza delle parole**
        const termFrequencies = {};
        words.forEach(word => {
            termFrequencies[word] = (termFrequencies[word] || 0) + 1;
        });

        // **Restituisce i primi 15 termini più usati**
        return Object.keys(termFrequencies)
            .map(term => ({ term, frequency: termFrequencies[term] }))
            .sort((a, b) => b.frequency - a.frequency) // Ordina per frequenza decrescente
            .slice(0, 15); // Prendi solo i primi 15 termini più usati

    } catch (error) {
        console.error("❌ Errore nell'elaborazione del TEI:", error);
        return [];
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const acarnesiButton = document.querySelector('[data-bs-target="#testo-Acarnesi"]');

    if (acarnesiButton) {
        acarnesiButton.addEventListener("click", () => {
            console.log("📥 Bottone Acarnesi cliccato. Avvio caricamento TEI...");
            loadTEIContent("../xml/ach.xml");
        });
    } else {
        console.warn('⚠️ Elemento con data-bs-target="#testo-Acarnesi" non trovato.');
    }
});

document.addEventListener("DOMContentLoaded", async function () {
    const bubbleContainer = document.getElementById("d3-bubble-chart");
    if (!bubbleContainer) return;

    // Carica i termini dal file TEI (assumendo che funzioni)
    const termData = await getTermsFromTEI("../xml/ach.xml");

    if (termData.length === 0) {
        console.warn("⚠️ Nessun termine trovato.");
        return;
    }

    const width = 800, height = 500;

    // Creazione dell'SVG
    const svg = d3.select("#d3-bubble-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Scala per il raggio delle bolle basata sulla frequenza
    const radiusScale = d3.scaleSqrt()
        .domain([0, d3.max(termData, d => d.frequency)])
        .range([10, 50]);

    // Simulazione delle forze per le bolle
    const simulation = d3.forceSimulation(termData)
        .force("x", d3.forceX(width / 2).strength(0.05))
        .force("y", d3.forceY(height / 2).strength(0.05))
        .force("collision", d3.forceCollide(d => radiusScale(d.frequency) + 2))
        .on("tick", ticked);

    // ** Creazione del tooltip **
    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background", "rgba(0, 0, 0, 0.7)")
        .style("color", "white")
        .style("padding", "8px")
        .style("border-radius", "5px")
        .style("opacity", 0)
        .style("pointer-events", "none");

    // Creazione delle bolle con animazione iniziale
    const bubbles = svg.selectAll(".bubble")
        .data(termData)
        .enter()
        .append("circle")
        .attr("class", "bubble")
        .attr("r", 0) // Animazione iniziale
        .attr("fill", "#00a3cc")
        .attr("stroke", "#076578")
        .attr("stroke-width", 2)
        .transition()
        .duration(1000)
        .attr("r", d => radiusScale(d.frequency));

    // Aggiunta delle etichette (nomi dei termini)
    const labels = svg.selectAll(".label")
        .data(termData)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("text-anchor", "middle")
        .attr("dy", ".3em")
        .attr("font-size", "14px")
        .attr("fill", "white")
        .text(d => d.term);

    // ** Tooltip interattivo **
    bubbles.on("mouseover", function (event, d) {
        d3.select(this)
            .transition()
            .duration(200)
            .attr("r", radiusScale(d.frequency) * 1.2)
            .attr("fill", "#ffcc00");

        tooltip.style("opacity", 1)
            .html(`<strong>${d.term}</strong>: ${d.frequency} occorrenze`)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 20) + "px");
    })
    .on("mousemove", function (event) {
        tooltip.style("left", (event.pageX + 10) + "px")
               .style("top", (event.pageY - 20) + "px");
    })
    .on("mouseout", function (event, d) {
        d3.select(this)
            .transition()
            .duration(200)
            .attr("r", radiusScale(d.frequency))
            .attr("fill", "#00a3cc");

        tooltip.style("opacity", 0);
    });

    // Funzione per aggiornare la posizione delle bolle
    function ticked() {
        bubbles.attr("cx", d => d.x).attr("cy", d => d.y);
        labels.attr("x", d => d.x).attr("y", d => d.y);
    }
});
