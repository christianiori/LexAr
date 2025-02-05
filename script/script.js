// DICHIARAZIONI GENERALI
const terms = document.querySelectorAll(".term");
const filterButtons = document.querySelectorAll(".dropdown-item[data-filter]");
const clearFiltersButton = document.getElementById("clear-vocabulary-filters");
const searchBar = document.getElementById("search-bar");
const modalElement = document.getElementById("filter-modal"); 
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

document.addEventListener("DOMContentLoaded", function () {
    let sidebar = document.getElementById("annotationSidebar");
    if (!sidebar) {
        sidebar = document.createElement("div");
        sidebar.id = "annotationSidebar";
        sidebar.classList.add("annotation-sidebar");
        sidebar.style.position = "fixed";
        sidebar.style.right = "-320px"; // Nasconde la sidebar inizialmente
        sidebar.style.top = "60px"; // Sposta la sidebar sotto la navbar
        sidebar.style.height = "calc(100vh - 60px)"; // Adatta l'altezza
        sidebar.style.zIndex = "1050";
        sidebar.style.width = "300px";
        sidebar.style.background = "#0d6ca6";
        sidebar.style.padding = "15px";
        sidebar.style.boxShadow = "-2px 0 5px rgba(0,0,0,0.2)";
        sidebar.style.transition = "right 0.3s ease-in-out";
        sidebar.style.color = "white";
        sidebar.innerHTML = `
    <h3 style="color: white; margin-bottom: 10px;">Commenti</h3>
    <textarea id="annotationInput" placeholder="Scrivi un commento..." rows="3"
        style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px; font-size: 14px; margin-bottom: 10px;"></textarea>
    <button id="saveAnnotation" style="background-color: white; color: #0d6ca6; border: none; padding: 10px;
        border-radius: 5px; cursor: pointer; width: 100%; margin-bottom: 15px; font-weight: bold;">Salva</button>
    
    <div id="annotationContainer" style="max-height: 55vh; overflow-y: auto; padding-right: 5px;">
        <ul id="annotationItems" style="list-style: none; padding: 0;"></ul>
    </div>

    <button id="exportAnnotations" style="background-color: #0dcaf0; color: white; border: none; padding: 10px; 
        border-radius: 5px; cursor: pointer; width: 100%; margin-top: 10px;">Esporta Commenti</button>

    <button id="deleteAllAnnotations" style="background-color: #0dcaf0; color: white; border: none; padding: 10px; 
        border-radius: 5px; cursor: pointer; width: 100%; margin-top: 10px;">Elimina Tutti i Commenti</button>
`;

        document.body.appendChild(sidebar);
        document.getElementById("exportAnnotations").addEventListener("click", exportAnnotations);
        document.getElementById("deleteAllAnnotations").addEventListener("click", deleteAllAnnotations);
    }
    displayAnnotations();
});

document.addEventListener("mouseup", handleTextSelection); 
document.addEventListener("touchend", handleTextSelection); 

function handleTextSelection() {
    let selection = window.getSelection();
    let selectedText = selection.toString().trim();
    let existingButton = document.getElementById("annotateButton");

    if (selectedText.length > 0) {
        setTimeout(() => showAnnotationButton(selection, selectedText), 50);
    } else if (existingButton) {
        existingButton.remove(); // Rimuove il pulsante se non c'è più selezione
    }
}


document.addEventListener("click", function (event) {
    let sidebar = document.getElementById("annotationSidebar");
    if (!sidebar.contains(event.target) && 
        event.target.id !== "annotateButton" && 
        event.target.id !== "saveAnnotation" && 
        !event.target.classList.contains("deleteComment") && 
        !event.target.classList.contains("editInput") &&
        !event.target.classList.contains("editSaveButton")) {
        sidebar.style.right = "-320px";
    }
});


function showAnnotationButton(selection, selectedText) {
    if (selection.rangeCount === 0) return;

    let existingButton = document.getElementById("annotateButton");
    if (existingButton) existingButton.remove();

    let range = selection.getRangeAt(0);
    let rect = range.getBoundingClientRect();

    let button = document.createElement("button");
    button.id = "annotateButton";
    button.innerHTML = `<i class="fas fa-feather"></i>`;
    button.style.position = "absolute";
    button.style.left = `${rect.left + window.scrollX + rect.width / 2 - 10}px`;

    if (window.innerWidth < 768) {
        button.style.top = `${rect.top + window.scrollY - 50}px`;
    } else {
        button.style.top = `${rect.bottom + window.scrollY + 5}px`;
    }

    button.style.background = "rgba(0, 163, 204, 0.8)";
    button.style.color = "white";
    button.style.border = "none";
    button.style.padding = "8px";
    button.style.borderRadius = "50%";
    button.style.cursor = "pointer";
    button.style.zIndex = "1000";
    button.style.fontSize = "16px";
    button.style.boxShadow = "0px 2px 5px rgba(0, 0, 0, 0.2)";
    button.style.opacity = "0";
    button.style.transition = "opacity 0.2s ease-in-out, transform 0.2s ease-in-out";

    setTimeout(() => { button.style.opacity = "1"; }, 10);

    button.addEventListener("click", function (event) {
        event.stopPropagation();
        console.log("Pulsante piuma cliccato!");
        openAnnotationSidebar(selectedText);
        button.remove();
    });

    document.body.appendChild(button);

    document.addEventListener("mousedown", removeAnnotateButton);
document.addEventListener("touchstart", removeAnnotateButton); // Per mobile

function removeAnnotateButton(event) {
    let button = document.getElementById("annotateButton");
    if (button && !window.getSelection().toString().trim()) {
        button.remove();
    }
}

}

function deleteAllAnnotations() {
    if (confirm("Sei sicuro di voler eliminare tutti i commenti? Questa azione è irreversibile.")) {
        localStorage.removeItem("annotations"); // Cancella i dati dal localStorage

        let list = document.getElementById("annotationItems");
        if (list) {
            list.style.display = "none"; // Nasconde la lista per evitare ridisegno
            requestAnimationFrame(() => {
                list.innerHTML = ""; // Ora rimuove tutto in un colpo solo
                list.style.display = "block"; // Mostra di nuovo la lista vuota
            });
        }
    }
}


function saveAnnotation(text, comment) {
    let annotations = JSON.parse(localStorage.getItem("annotations") || "[]");
    annotations.push({ text, comment });
    localStorage.setItem("annotations", JSON.stringify(annotations));
}

function displayAnnotations() {
    let list = document.getElementById("annotationItems");
    if (!list) return;
    
    list.innerHTML = "";
    let annotations = JSON.parse(localStorage.getItem("annotations") || "[]");
    annotations.forEach((a, index) => {
        let li = document.createElement("li");
        li.style.background = "white";
        li.style.padding = "10px";
        li.style.margin = "5px 0";
        li.style.borderRadius = "10px";
        li.style.color = "#0d6ca6";
        li.style.boxShadow = "2px 2px 5px rgba(0,0,0,0.2)";
        li.style.position = "relative";
        li.innerHTML = `
            <span style="display: block; font-weight: bold;">${a.text}</span>
            <p style="margin: 5px 0; font-size: 14px;" id="comment-${index}">${a.comment}</p>
            <button onclick="editAnnotation(${index})" class="editButton"
                style="background: none; border: none; color: #ff9800; cursor: pointer; position: absolute; top: 5px; right: 25px;">
                ✎
            </button>
            <button onclick="deleteAnnotation(${index})" class="deleteComment"
                style="background: none; border: none; color: red; cursor: pointer; position: absolute; top: 5px; right: 5px;">
                ✖
            </button>
        `;
        list.appendChild(li);
    });
}

function deleteAnnotation(index) {
    let annotations = JSON.parse(localStorage.getItem("annotations") || "[]");
    annotations.splice(index, 1); 
    localStorage.setItem("annotations", JSON.stringify(annotations));
    displayAnnotations(); 
}

function editAnnotation(index) {
    let annotations = JSON.parse(localStorage.getItem("annotations") || "[]");
    let commentElement = document.getElementById(`comment-${index}`);

    let input = document.createElement("textarea");
    input.value = annotations[index].comment;
    input.classList.add("editInput");
    input.style.width = "100%";
    input.style.height = "50px";
    input.style.marginTop = "5px";
    input.style.border = "1px solid #ccc";
    input.style.borderRadius = "5px";
    input.style.padding = "5px";
    input.style.fontSize = "14px";

    let saveButton = document.createElement("button");
    saveButton.innerText = "Salva";
    saveButton.classList.add("editSaveButton");
    saveButton.style.background = "#0dcaf0";
    saveButton.style.color = "white";
    saveButton.style.border = "none";
    saveButton.style.padding = "5px 10px";
    saveButton.style.marginTop = "5px";
    saveButton.style.borderRadius = "5px";
    saveButton.style.cursor = "pointer";

    commentElement.innerHTML = "";
    commentElement.appendChild(input);
    commentElement.appendChild(saveButton);

    saveButton.onclick = function () {
        annotations[index].comment = input.value;
        localStorage.setItem("annotations", JSON.stringify(annotations));
        displayAnnotations();
    };
}

function exportAnnotations() {
    let annotations = localStorage.getItem("annotations");
    if (!annotations || annotations.length === 0) {
        alert("Non ci sono annotazioni da esportare.");
        return;
    }

    let blob = new Blob([annotations], { type: "application/json" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "annotazioni.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


function openAnnotationSidebar(selectedText) {
    let sidebar = document.getElementById("annotationSidebar");
    let input = document.getElementById("annotationInput");
    let saveButton = document.getElementById("saveAnnotation");

    input.value = "";
    sidebar.style.right = "0"; // Mantieni la sidebar aperta

    saveButton.onclick = function () {
        let comment = input.value.trim();
        if (comment) {
            saveAnnotation(selectedText, comment);
            displayAnnotations();
        }
    };
}

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
    const bubbles= document.querySelectorAll(".bolla");
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
async function getTermsFromTEI(xmlPath, maxWords = 30) {
    const response = await fetch(xmlPath);
    const text = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "application/xml");

    // Lista di stopwords comuni in greco antico (può essere ampliata)
 const stopwords = new Set([
        // ARTICOLI
        "ὁ", "ἡ", "τό", "οἱ", "αἱ", "τά", "τοῦ", "τῆς", "τοῖς", "ταῖς", "τῶν",
        "τῷ", "τὸν", "τὴν", "τοὺς", "τὰς", "ταῦτα", "ταῦτ’",

        // PRONOMI PERSONALI, POSSESSIVI, DIMOSTRATIVI
        "ἐγώ", "ἐγὼ", "ἐμοῦ", "ἐμοί", "ἐμοὶ", "μοι", "με", "σύ", "σοῦ", "σοι", "σε",
        "μου", "σου", "ἡμεῖς", "ἡμῶν", "ἡμῖν", "ἡμᾶς", "ὑμεῖς", "ὑμῶν", "ὑμῖν", "ὑμᾶς",
        "αὐτός", "αὐτὸς", "αὐτή", "αὐτό", "αὐτοῦ", "αὐτῆς", "αὐτῷ", "αὐτόν", "αὐτήν",
        "ἐμαυτοῦ", "ἐμαυτῷ", "ἐμαυτὸν", "σεαυτοῦ", "σεαυτῷ", "σεαυτὸν",
        "ἑαυτοῦ", "ἑαυτῷ", "ἑαυτὸν",
        "οὗτος", "αὕτη", "τοῦτο", "τοῦτ’", "τουτὶ", "τούτου", "ταύτης", "τούτῳ", "ταύτῃ",
        "τοῦτον", "ἐκεῖνος", "ἐκείνη", "ἐκεῖνο", "ἐκείνου", "ἐκείνης", "ἐκείνοις",
        "ταυτὶ", "ταυτ’", "ταυτά", "ταῦτ’", "ὅστις", "πάντα", "τίς", "τις", "ὥστ'", "ἐγώ",

        // VERBO "ESSERE" (tutte le forme con accenti diversi)
        "εἰμί", "εἰμὶ", "εἶ", "ἐστίν", "ἐστιν", "ἐστὶ", "ἐστί", "ἐσμέν", "ἐσμὲν", "ἐστέ", "ἐστὲ",
        "εἰσίν", "εἰσὶ", "εἰσὶν", "ἔσομαι", "ἔσῃ", "ἔσται", "ἐσόμεθα", "ἔσεσθε", "ἔσονται",
        "ἦν", "ἦσαν", "ἦσθα", "ἦμεν", "ἦτε", "ἔστιν", "ἔσθ’", "ἐστ’", "εἰσ’", "ἐστι", "ἵν’", "ἐστὶν",

        // CONGIUNZIONI, PARTICELLE E AVVERBI
        "καί", "καὶ", "δέ", "δὲ", "ἀλλά", "ἀλλ’", "ἀλλὰ", "τε", "μέν", "μὲν", "γάρ", "γὰρ",
        "οὐ", "οὐκ", "οὐχ", "οὐχί", "οὔτε", "οὔ", "μή", "μήτε", "μηδέ", "μὴ",
        "ἄν", "ἐάν", "ἐὰν", "ἤ", "εἰ", "ὡς", "ὥς", "ὥστε", "ὅταν", "ἵνα", "ὅτι",
        "οὖν", "ἆρα", "γέ", "γὰρ", "μήν", "μὴν", "τοι", "τοίνυν", "νυν", "πῶς",
        "δῆτα", "δῆτ’", "ἀεὶ", "οἷον", "οἴμοι", "καλῶς", "κακῶς", "γάρ", "ταῦτ'", "κᾆτ'", "ὥσπερ", "δεῖ", "ἀνὴρ", "δῆτ'",

        // PREPOSIZIONI
        "ἐν", "εἰς", "ἐκ", "πρός", "πρὸς", "μετά", "μετὰ", "κατά", "κατὰ",
        "ὑπό", "ὑπὸ", "ἀπό", "ἀπὸ", "διά", "δι’", "διὰ", "ἐπί", "ἐπὶ", "παρά", "παρὰ",
        "ἀντί", "ἀντὶ", "ὑπέρ", "ὑπὲρ", "περὶ", "ἀμφί", "ἀμφὶ", "χωρίς",
        "εἴσω", "ἄνευ", "ἐγγύς", "ἄχρι", "ἕνεκα", "χάριν", "ἔνδον", "κατ'",

        // VERBI COMUNI E IMPERATIVI TRONCAMENTI
        "φέρε", "φέρων", "λαβών", "λαβὼν", "δίκαια", "δί’", "δός", "λέγει", "ναί", "τὰν",

        // TRONCAMENTI COMUNI (PRONOMI, PARTICELLE, CONGIUNZIONI)
        "γ’", "μ’", "θ’", "τ’", "σ’", "κ’", "δ’", "π’", "ν’", "χ’", "οὑ’", "ἑ’", "μήτ'",
        "οὗ’", "οὐδ’", "μήτ’", "ἅπ’", "ἅματ’", "ἆρ’", "εἴτ’", "εἶπ’", "ἴδ’",
        "ἀλλ’", "ἄρ’", "ταυτὶ", "ταυτ’", "δῆτ’", "ἀλλ'", "νῦν", "τοῦτ'", "ὑπ'",
        "ἄρ'", "δί'", "οἷς", "ἵν'", "εἶτα", "ὅπως", "ἐμοί", "ἤδη", "δὸς", "ὁδὶ", "εἶναι",
        "ἔτι", "εἶτ'", "οὐδ'", "δεῦρο", "ναὶ", "σφόδρα", "μόνον", "μηδαμῶς", "ποτ'", "πολὺ", "οὐχὶ", "κἀμοὶ", "ἔχων", "ἔχει"
    ]);

    // Estrai tutti gli elementi <l> che contengono il testo
    const lines = xmlDoc.getElementsByTagName("l");
    let wordCount = {};

    for (let line of lines) {
        const words = line.textContent
            .trim()
            .toLowerCase()
            .replace(/[.,;!?()«»"“”‘’]/g, '') // Rimuove punteggiatura
            .split(/\s+/); // Divide in parole

        words.forEach(word => {
            if (word.length > 2 && !stopwords.has(word)) { // Esclude parole corte e stopwords
                wordCount[word] = (wordCount[word] || 0) + 1;
            }
        });
    }

    // Converti in array e ordina per frequenza decrescente
    let sortedWords = Object.entries(wordCount)
        .sort((a, b) => b[1] - a[1]) // Ordina per frequenza
        .slice(0, maxWords) // Seleziona le top N parole più frequenti
        .map(([term, frequency]) => ({ term, frequency }));

    return sortedWords;
}
let bubblesChart = d3.selectAll("#d3-bubble-chart .bubble");
bubblesChart
    .attr("data-bs-toggle", "tooltip")
    .attr("data-bs-placement", "top") // Tooltip sopra la bolla
    .attr("title", d => `${d.term}: ${d.frequency}`) // Testo del tooltip
    .on("mouseover", function(event, d) {
        d3.select(this)
            .transition()
            .duration(200)
            .attr("r", d => radiusScale(d.frequency) * 1.2) // 🔥 Ingrandisce la bolla
            .attr("stroke", "black") // Evidenzia la bolla
            .attr("stroke-width", 3);
    })
    .on("mouseout", function(event, d) {
        d3.select(this)
            .transition()
            .duration(200)
            .attr("r", d => radiusScale(d.frequency)) // 🔥 Torna alla dimensione originale
            .attr("stroke", "#076578") // Ripristina il bordo originale
            .attr("stroke-width", 2);
    });
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
// Dichiarazione globale della simulazione
let simulation; 

document.addEventListener("DOMContentLoaded", async function () {
    const width = window.innerWidth < 600 ? window.innerWidth - 20 : 800;
    const height = window.innerWidth < 600 ? 400 : 500;
    const bubbleContainer = document.getElementById("d3-bubble-chart");
    if (!bubbleContainer) return;

    // Carica i termini dal file TEI (assumendo che funzioni)
    const maxWords = window.innerWidth < 600 ? 15 : 30;
    const termData = (await getTermsFromTEI("../xml/ach.xml")).slice(0, maxWords);

    if (termData.length === 0) {
        console.warn("⚠️ Nessun termine trovato.");
        return;
    }

    termData.forEach(d => {
    d.x = Math.random() * width; 
    d.y = Math.random() * height;
});

const isMobile = window.innerWidth < 600;

bubblesChart
    .on(isMobile ? "click" : "mouseover", function(event, d) {
        d3.select(this)
            .transition()
            .duration(200)
            .attr("r", d => radiusScale(d.frequency) * 1.2)
            .attr("stroke", "black")
            .attr("stroke-width", 3);

        if (isMobile) {
            alert(`${d.term}: ${d.frequency}`); // Tooltip alternativo su mobile
        }
    })
    .on("mouseout", function(event, d) {
        if (!isMobile) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("r", d => radiusScale(d.frequency))
                .attr("stroke", "#076578")
                .attr("stroke-width", 2);
        }
    });

 
    const radiusScale = d3.scaleSqrt()
    .domain([1, d3.max(termData, d => d.frequency)])
    .range(window.innerWidth < 600 ? [20, 50] : [25, 70]);

    if (simulation) {
        simulation.stop(); 
    }

    d3.select("#d3-bubble-chart").select("svg").remove();
    let svg = d3.select("#d3-bubble-chart")
    .append("svg")
    .attr("width", "100%") 
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

    const containerRect = document.getElementById("d3-bubble-chart").getBoundingClientRect();
const centerX = containerRect.width / 2;
const centerY = containerRect.height / 2;

simulation = d3.forceSimulation(termData)
    .force("x", d3.forceX(centerX).strength(window.innerWidth < 600 ? 0.3 : 0.1)) 
    .force("y", d3.forceY(centerY).strength(window.innerWidth < 600 ? 0.3 : 0.1))
    .force("collision", d3.forceCollide(d => radiusScale(d.frequency) + (window.innerWidth < 600 ? 30 : 10))) 
    .force("charge", d3.forceManyBody().strength(-30))
    .on("tick", ticked);


if (termData.length > 0) { 
    let bubblesChart = svg.selectAll(".bubble")
        .data(termData)
        .enter()
        .append("circle")
        .attr("class", "bubble")
        .attr("r", d => radiusScale(d.frequency))
        .attr("fill", "#00a3cc")
        .attr("stroke", "#076578")
        .attr("stroke-width", 2)
        .attr("data-bs-toggle", "tooltip")  
        .attr("data-bs-placement", "top")   
        .attr("title", d => `${d.term}: ${d.frequency}`);

    setTimeout(() => {
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
        console.log("✅ Tooltip di Bootstrap inizializzati correttamente.");
    }, 500); 
}

const defs = svg.append("defs");
const paths = defs.selectAll(".circlePath")
    .data(termData)
    .enter()
    .append("path")
    .attr("id", (d, i) => `circlePath${i}`)
    .attr("d", d => {
        let r = radiusScale(d.frequency) / 2;
        return `M ${-r}, 0 A ${r},${r} 0 1,1 ${r},0`;
    })
    .style("fill", "none");

const labels = svg.selectAll(".label")
    .data(termData)
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("text-anchor", "middle")
    .attr("dy", ".3em")
    .attr("font-size", d => 
    window.innerWidth < 600 ? Math.max(radiusScale(d.frequency) / 2.5, 10) + "px"
                            : Math.min(Math.max(radiusScale(d.frequency) / 2.5, 12), radiusScale(d.frequency) / 1.5) + "px")
    .attr("fill", "white")
    .text(d => d.term);


   function ticked() {
    d3.selectAll(".bubble")
        .attr("cx", d => d.x = Math.max(radiusScale(d.frequency), Math.min(width - radiusScale(d.frequency), d.x)))
        .attr("cy", d => d.y = Math.max(radiusScale(d.frequency), Math.min(height - radiusScale(d.frequency), d.y)));

    d3.selectAll(".label")
        .attr("x", d => d.x)
        .attr("y", d => d.y + 3);

}
});


//PAGINA RADICI
// Funzione per caricare vocaboli.html e processare i vocaboli
document.addEventListener("DOMContentLoaded", () => {
    fetch("https://christianiori.github.io/LexAr/script/radici.json") // Assicurati che il file sia nello stesso livello di script.js
        .then(response => {
            if (!response.ok) {
                throw new Error("Errore nel caricamento del file JSON");
            }
            return response.json();
        })
        .then(data => {
            console.log("Dati radici caricati:", data);
            mostraRadici(data);
        })
        .catch(error => console.error("Errore:", error));
});

function mostraRadici(radici) {
    const container = document.getElementById("radiciContainer");
    if (!container) return;

    Object.entries(radici).forEach(([radice, parole]) => {
        const radiceElement = document.createElement("div");
        radiceElement.classList.add("radice");
        radiceElement.innerHTML = `<b>${radice}</b>: ${parole.join(", ")}`;
        container.appendChild(radiceElement);
    });
}
