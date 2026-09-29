# Roadmap di LexAr

Questa roadmap descrive il percorso dalla versione attuale di LexAr alla prima
versione pubblica stabile. Le attività vanno affrontate nell'ordine indicato:
ogni fase dipende dalla precedente e si considera conclusa soltanto quando è
soddisfatto il relativo criterio di uscita.

## Obiettivo di LexAr 1.0

LexAr 1.0 dovrà offrire:

- un'interfaccia coerente, accessibile e responsive;
- un catalogo funzionante delle undici commedie conservate;
- gli *Acarnesi* come opera digitale pilota completa di testo TEI, ricerca,
  navigazione per verso, metrica sperimentale e interazione lessicale di base
  direttamente sul testo greco;
- strumenti lessicali affidabili e collegati alle opere;
- pagine informative aggiornate;
- controlli automatici sui dati, sui collegamenti e sul backend;
- documentazione sufficiente per avviare, verificare e pubblicare il progetto.

La codifica TEI completa delle altre dieci commedie non blocca la versione 1.0:
sarà il principale percorso di espansione successivo.

## Stato di partenza

- [x] Homepage ridisegnata e responsive.
- [x] Catalogo unificato con undici opere, ricerca, filtri e ordinamento.
- [x] Pagina *Il progetto* ridisegnata.
- [x] Backend Python con database SQLite generato all'avvio.
- [x] API di base per opere, testo e lessico.
- [x] Deploy su Render con health check.
- [x] Testo TEI degli *Acarnesi* importato e validato.
- [x] Ricerca nel testo e navigazione diretta al verso.
- [x] Pilot metrico degli *Acarnesi* per i vv. 1–46.
- [x] Fallback statico del testo per l'uso senza backend.

---

## Fase 1 — Consolidare la base tecnica

### Struttura e collegamenti

- [x] Elencare le pagine pubbliche canoniche e i relativi URL.
- [x] Individuare riferimenti a pagine, stili e script non più utilizzati.
- [x] Correggere tutti i collegamenti interni non validi.
- [x] Verificare che ogni pagina permetta di tornare a Home, Opere e Lessico.
- [x] Aggiungere `tools/check_internal_links.py` per controllare automaticamente
  collegamenti, immagini, fogli di stile e script locali.
- [x] Documentare nel README il comando per eseguire il controllo.

### Controlli automatici

- [x] Riunire in un unico comando i controlli su backend, TEI, metrica e link.
- [x] Aggiungere una GitHub Action che esegua i controlli a ogni push.
- [x] Fare fallire il controllo se i dati generati non corrispondono alle fonti.
- [x] Conservare nel repository soltanto i file generati necessari al fallback.

**Criterio di uscita:** la repository supera tutti i controlli automatici, non
contiene collegamenti interni interrotti e ha una struttura documentata.

---

## Fase 2 — Completare gli *Acarnesi* come modello

### Lettore del testo

- [x] Provare caricamento tramite API e fallback statico.
- [x] Verificare ricerca con greco accentato, greco non accentato e nomi dei
  personaggi.
- [x] Gestire chiaramente ricerche senza risultati.
- [x] Verificare il salto a un verso esistente, inesistente, frammentato e
  fuori intervallo.
- [x] Mantenere visibili numero del verso e parlante durante la lettura.
- [x] Verificare il lettore con tastiera e lettore di schermo.
- [x] Controllare il layout almeno a 360, 768, 1024 e 1440 pixel.

### Pilot metrico

- [ ] Revisionare manualmente le scansioni dei vv. 1–46.
- [x] Risolvere o documentare i casi ancora aperti dei vv. 20, 37 e 43.
- [x] Distinguere nell'interfaccia scansioni proposte e scansioni verificate.
- [x] Aggiungere una breve legenda della notazione metrica.
- [x] Verificare che il testo resti leggibile con la metrica disattivata.

### Collegamento con il lessico

- [x] Mostrare nella scheda i termini lessicali associati agli *Acarnesi*.
- [x] Collegare ogni termine alla relativa voce del lessico.
- [x] Permettere di tornare dalla voce lessicale all'opera di provenienza.
- [x] Definire il comportamento quando un termine non possiede ancora una
  scheda completa.

### Interazione linguistica di base — requisito per LexAr 1.0

- [x] Definire una tokenizzazione stabile del greco che conservi punteggiatura,
  apostrofi, elisioni e testo TEI senza alterare ciò che viene visualizzato.
- [x] Rendere selezionabili con mouse, tocco e tastiera le parole riconosciute
  nel lessico.
- [x] Mostrare una scheda accessibile con forma nel testo, lemma, categoria
  grammaticale, significato essenziale e collegamento alla voce completa.
- [x] Evidenziare nel lettore le altre occorrenze della stessa voce e permettere
  di rimuovere facilmente l'evidenziazione.
- [x] Gestire in modo chiaro le forme non riconosciute o prive di una scheda
  lessicale completa.
- [x] Garantire chiusura con `Escape`, ritorno del focus e una resa utilizzabile
  su mobile senza coprire il verso selezionato.
- [x] Conservare ricerca, salto al verso, metrica, API e fallback quando
  l'interazione lessicale è attiva.
- [x] Aggiungere controlli automatici per forme accentate e non accentate,
  punteggiatura, elisioni, parole ripetute e termini senza voce.

Analisi morfologica completa, traduzione sincronizzata, annotazioni personali
ed esercizi didattici restano ampliamenti successivi: non bloccano LexAr 1.0.

**Criterio di uscita:** gli *Acarnesi* funzionano su desktop e mobile tramite
API e fallback, sono navigabili da tastiera, permettono di esplorare dal testo
le parole presenti nel lessico e rappresentano il modello completo di una
pagina-opera.

---

## Fase 3 — Creare il sistema visivo comune

Avviata il 7 settembre 2026, su richiesta del responsabile del progetto,
in parallelo alla revisione filologica ancora aperta dei vv. 1–46.
La fase 2 non viene dichiarata chiusa e nessuna scansione viene promossa
a verificata con questo intervento.

Primo intervento: `style/shared.css` raccoglie palette, font del corpo,
reset di base e stili di Cerca e del pulsante menu. Restano locali il bordo
della Home e l'ombra degli Acarnesi, per conservare la grafica approvata.
`script/navigation.js` gestisce il menu di Home, Progetto, Catalogo e Acarnesi
(apertura, Escape, uscita del focus, clic esterno e cambio di breakpoint).
Il menu usa gli stessi quattro collegamenti su desktop e mobile e il limite
già esistente di 760px; i breakpoint dei contenuti restano da armonizzare.
Secondo intervento: condivisi base dei pulsanti Home/Acarnesi, struttura
dei footer Home/Progetto/Catalogo e motivo decorativo delle card. Centralizzate
le famiglie tipografiche dei titoli, del greco e della notazione metrica,
le larghezze dei contenitori e i colori dei footer. Dimensioni dei titoli,
varianti delle card e griglia del footer Acarnesi restano specifiche di pagina.
La struttura e i criteri di riuso sono documentati in `docs/CSS_SYSTEM.md`.

Terzo intervento sulle quattro pagine pilota: focus comune adattato ai fondi,
stati equivalenti per mouse e tastiera, sezione corrente sottolineata nel menu
e controlli nativi disabilitati distinguibili. Il focus resta visibile anche
sulle parole con occorrenze evidenziate. Le pagine legacy restano da migrare;
le checkbox relative a tutte le pagine restano aperte.

Quarto intervento: soglie comuni a 480/760/980/1280px, con eccezioni
documentate a 900px (Progetto) e 1040px (card Catalogo). Corretti i titoli
compressi su tablet e i filtri sovrapposti; il pannello mobile chiuso non
entra più nel percorso di Tab. Menu e footer mobili usano regole condivise.
Chiusura della fase: token visivi e navigazione consolidati in `shared.css`;
le copie residue del menu sono state rimosse dai fogli pagina. Le sette pagine
migrate condividono ordine del menu, sezione corrente accessibile e un unico
elenco di voci per desktop e mobile. Le pagine legacy restano fuori da questa
fase e saranno migrate nelle fasi successive.

### Fondamenta grafiche

- [x] Centralizzare i token condivisi per colori, font, spaziature, bordi e
  ombre in variabili CSS, lasciando locali le varianti approvate delle pagine.
- [x] Creare stili comuni per navigazione, pulsanti, titoli, card e footer.
- [x] Definire stati coerenti per hover, focus, pagina corrente e disabilitato
  nelle quattro pagine pilota (Home, Progetto, Catalogo, Acarnesi).
- [x] Ridurre le regole duplicate fra `home.css`, `intro.css`, `catalogo.css` e
  `work.css` senza alterare le pagine già approvate.
- [x] Stabilire breakpoint condivisi per mobile, tablet e desktop,
  documentando le eccezioni necessarie alla composizione approvata.

### Navigazione

- [x] Uniformare struttura e ordine delle voci nelle sette pagine migrate.
- [x] Evidenziare la sezione corrente con `aria-current="page"`.
- [x] Riutilizzare lo stesso elenco di voci per menu desktop e mobile.
- [x] Controllare apertura, chiusura e gestione del focus nel menu mobile.

**Criterio di uscita:** Home, Il progetto, Catalogo, Acarnesi, Autore e Linea
del tempo e Glossario condividono il sistema visivo e la navigazione senza regressioni
responsive. Le pagine legacy saranno migrate nelle fasi successive.

---

## Fase 4 — Rinnovare le pagine informative

Procedere una pagina alla volta, completando e verificando ciascuna prima di
passare alla successiva.

Le pagine **Autore** e **Linea del tempo** sono state rinnovate con navigazione
comune e layout responsive. La timeline conserva ricerca, cronologia e
collegamenti alle undici commedie.

- [x] **Autore:** aggiornare struttura, immagini, fonti e collegamenti alle
  opere. Layout editoriale a macrosezioni, palette completa, immagini del busto,
  Teatro di Dioniso e manoscritto delle *Rane* con didascalie e fonti; voce Autore
  aggiunta alla navigazione del sito.
- [x] **Linea del tempo:** migrare dal layout legacy, mantenendo ricerca,
  cronologia e collegamenti alle undici opere; verificata la ricerca e la resa
  su desktop e mobile.
- [x] **Glossario:** migliorare ricerca, leggibilità e collegamenti contestuali;
  aggiunti filtri per ambito, schede espandibili e rimandi alle opere e alle fonti.
- [ ] **Lessico generale:** trasformarlo nella pagina di accesso ai tre strumenti
  lessicali.
- [ ] Eliminare breadcrumbs e card laterali superflue dalle pagine rinnovate.
- [ ] Verificare titoli, metadati HTML, gerarchia delle intestazioni e testo
  alternativo delle immagini.

**Criterio di uscita:** tutte le pagine informative usano il nuovo sistema
visivo, hanno una funzione chiara e non dipendono più dal vecchio layout.

---

## Fase 5 — Uniformare le altre dieci opere

Usare gli *Acarnesi* come modello, mantenendo inizialmente statici i testi non
ancora disponibili in TEI. Migrare le opere in ordine cronologico:

- [ ] *Cavalieri*.
- [ ] *Nuvole*.
- [ ] *Vespe*.
- [ ] *Pace*.
- [ ] *Uccelli*.
- [ ] *Donne alle Tesmoforie*.
- [ ] *Lisistrata*.
- [ ] *Rane*.
- [ ] *Donne al Parlamento*.
- [ ] *Pluto*.

Per ogni opera:

- [ ] trasferire titolo, datazione, agone, personaggi, trama e immagini nel
  modello comune;
- [ ] controllare fonti, crediti e licenze delle immagini;
- [ ] aggiungere metadati strutturati al backend;
- [ ] collegare catalogo, opera precedente, opera successiva e lessico;
- [ ] indicare senza ambiguità se il testo digitale non è ancora disponibile;
- [ ] verificare pagina e navigazione su mobile e desktop.

**Criterio di uscita:** tutte le undici opere hanno schede coerenti e complete;
solo le funzioni dipendenti dal TEI rimangono disattivate nelle opere prive di
testo digitale.

---

## Fase 6 — Rinnovare gli strumenti lessicali

### Dati

- [ ] Definire una fonte dati unica per vocaboli, opere, categorie grammaticali,
  campi semantici e radici.
- [ ] Eliminare duplicazioni fra HTML, JavaScript e database.
- [ ] Validare identificatori, forme greche, lemmi, traduzioni e collegamenti.
- [ ] Documentare il formato dei dati e la procedura per aggiungere una voce.

### Interfacce

- [ ] Rifare **Tutti i vocaboli** con ricerca e filtri cumulabili.
- [ ] Conservare normalizzazione di accenti, spiriti, maiuscole e sigma finale.
- [ ] Rifare **Campi semantici** mantenendo l'esplorazione visuale.
- [ ] Rifare **Radici** mantenendo il grafo interattivo e una vista alternativa
  accessibile senza grafico.
- [ ] Rendere condivisibili tramite URL ricerca e filtri applicati.
- [ ] Collegare vocaboli, radici, campi semantici e opere senza percorsi chiusi.

**Criterio di uscita:** i tre strumenti usano dati coerenti, funzionano su
mobile e permettono di passare dal lessico ai testi e viceversa.

---

## Fase 7 — Qualità e accessibilità

- [ ] Verificare contrasto dei colori secondo WCAG AA.
- [ ] Rendere tutte le funzioni utilizzabili da tastiera.
- [ ] Controllare ordine del focus, etichette, messaggi dinamici e dialoghi.
- [ ] Verificare il sito con JavaScript disabilitato dove è previsto un fallback.
- [ ] Eliminare errori HTML e avvisi rilevanti del browser.
- [ ] Ottimizzare peso e dimensioni delle immagini.
- [ ] Ridurre CSS e JavaScript inutilizzati.
- [ ] Verificare le pagine principali con connessione lenta e servizio Render
  appena riattivato.
- [ ] Aggiungere una pagina 404 coerente con il sito.
- [ ] Eseguire un controllo completo su Chrome, Firefox e un browser mobile.

**Criterio di uscita:** non restano problemi bloccanti di accessibilità,
navigazione, responsive design, collegamenti o caricamento.

---

## Fase 8 — Pubblicare LexAr 1.0

- [ ] Aggiornare README con descrizione, funzioni, struttura e schermate.
- [ ] Documentare fonti testuali, criteri editoriali e responsabilità delle
  annotazioni.
- [ ] Completare crediti e licenze di testi, dati, codice e immagini.
- [ ] Definire una licenza esplicita per il repository.
- [ ] Aggiungere numero di versione e changelog.
- [ ] Eseguire tutti i controlli automatici sull'ultimo commit.
- [ ] Verificare homepage, catalogo, Acarnesi, lessico e API sul deploy pubblico.
- [ ] Creare il tag `v1.0.0` e una release GitHub con note di rilascio.
- [ ] Aggiornare questa roadmap segnando le attività completate.

**Criterio di uscita:** il tag `v1.0.0` corrisponde a un deploy pubblico stabile,
documentato e verificato.

---

## Dopo la versione 1.0 — Espansione del corpus TEI

Per ogni nuova commedia:

1. scegliere e documentare l'edizione di riferimento;
2. preparare o importare la trascrizione senza alterarne silenziosamente il
   testo;
3. assegnare identificatori stabili a battute e versi;
4. aggiungere metadati e riferimenti esterni;
5. validare il documento con la personalizzazione TEI di LexAr;
6. generare il fallback statico;
7. collegare testo, personaggi e lessico;
8. verificare ricerca, navigazione e visualizzazione responsive;
9. pubblicare l'opera con un commit e una nota nel changelog.

Ordine proposto: *Cavalieri*, *Nuvole*, *Vespe*, *Pace*, *Uccelli*, *Donne alle
Tesmoforie*, *Lisistrata*, *Rane*, *Donne al Parlamento*, *Pluto*.

La metrica potrà essere estesa soltanto dopo la revisione del pilot degli
*Acarnesi* e dovrà continuare a distinguere chiaramente proposte e dati
verificati.

## Regola di avanzamento

Alla conclusione di ogni gruppo di attività:

1. eseguire i controlli automatici;
2. verificare manualmente le pagine interessate su mobile e desktop;
3. creare un commit circoscritto e descrittivo;
4. pubblicare il commit;
5. aggiornare le checkbox di questa roadmap nello stesso ciclo di lavoro.
