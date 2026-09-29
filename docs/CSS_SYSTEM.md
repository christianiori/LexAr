# Sistema CSS condiviso di LexAr

## Ambito

Home, Il progetto, Catalogo, Acarnesi, Autore, Linea del tempo e Glossario caricano
`style/shared.css` prima del proprio foglio di pagina. Le altre pagine legacy
saranno migrate nelle fasi successive.

Il progetto, Catalogo, Acarnesi, Autore e Linea del tempo caricano anche
`style/home.css` per componenti e varianti già approvati. La navigazione è ora
definita in `style/shared.css`; i footer Home, Progetto, Catalogo e Autore
condividono una struttura flessibile, mentre Acarnesi mantiene la propria
griglia. La Linea del tempo condivide la composizione della hero con Home.
Il refactoring conserva la grafica approvata: condividere una regola non implica
uniformare dimensioni o composizioni che sono intenzionalmente diverse.

## Fondamenta e componenti

- `shared.css`: palette e gradiente del marchio, famiglie tipografiche,
  spaziature ricorrenti, larghezze dei contenitori, bordi, ombre e colori dei
  footer; contiene anche navigazione, Cerca e pulsante menu comuni.
- Pulsanti Home/Acarnesi: allineamento, spaziatura interna fra gli elementi,
  raggio, peso del testo, variante primaria e movimento al passaggio del mouse.
  Padding, dimensione del testo, bordi e transizioni restano nei fogli di pagina.
- Footer Home/Progetto/Catalogo: struttura flessibile comune. Il footer degli
  Acarnesi mantiene la griglia e il proprio adattamento mobile.
- Card Home/Catalogo: motivo a meandro condiviso; dimensioni, colori, opacità,
  livelli di sovrapposizione e interazioni restano locali.
- Titoli: famiglie `--font-editorial` e `--font-script` condivise. Scala,
  interlinea, peso e spaziatura delle lettere conservano i valori approvati.
- Greco: distinguere `--font-greek` e `--font-greek-georgia` per preservare
  anche il comportamento dei caratteri di riserva. La metrica usa `--font-metric`.

I selettori con `:where(.home-page, ...)` limitano i componenti alle pagine
interessate senza aumentare la specificità. Gli override di pagina, caricati
dopo, mantengono la precedenza. Non importare questi componenti nelle pagine
legacy senza una verifica della cascata e del layout.

Le sette pagine migrate condividono la stessa sequenza di voci nel menu: Home,
Il progetto, Linea del tempo, Autore, Glossario, Opere e Lessico; Cerca resta l'azione
separata. Il menu mobile riusa lo stesso elenco HTML del desktop. Ogni pagina
indica la propria sezione con un solo `aria-current="page"`. Le pagine legacy,
inclusi Lessico e le dieci schede non ancora migrate, conservano il menu
precedente fino alle rispettive fasi di lavoro.

## Stati interattivi

Il focus da tastiera usa un contorno di 3px a distanza di 4px: scuro sui
fondi chiari, bianco sulle sezioni scure. `--focus-color` si eredita dal
contenitore; la nota della Home, che diventa chiara al focus, ripristina
il contorno scuro. I controlli del lettore con indicatori dedicati li mantengono.
Il contorno delle parole greche è applicato dopo il colore delle occorrenze,
perché il focus deve restare riconoscibile anche sulla parola evidenziata.

Pulsanti, filtri e collegamenti del lettore offrono lo stesso riscontro di
colore a hover e focus visibile. Le card con più collegamenti usano
`focus-within`. Nel menu, sezione corrente, hover e focus usano una
sottolineatura color acquamarina che non modifica le dimensioni dei link.

Per disabilitare un controllo usare l'attributo HTML nativo `disabled`:
attenuazione, cursore e assenza di hover accompagnano il blocco nativo
di attivazione e focus. `aria-disabled` da solo non disabilita un link:
non viene introdotto come scorciatoia per controlli inattivi.
La preferenza di movimento ridotto limita transizioni e animazioni anche
sulla Home, come già avveniva nelle altre pagine.

## Navigazione e responsive

`script/navigation.js` gestisce il menu delle sette pagine migrate: apertura,
chiusura con Escape e clic esterno, chiusura dopo la navigazione, aggiornamento
dell'etichetta accessibile e gestione del focus quando cambia il breakpoint.
Il limite mobile del menu è 760px, riportato sia nel JavaScript sia nelle
media query CSS.
Le variabili CSS non sono utilizzate nelle condizioni delle media query.
Le soglie di riferimento sono 480px (mobile compatto), 760px (mobile),
980px (tablet) e 1280px (desktop compatto). Menu e footer flessibili hanno
un'unica media query condivisa a 760px. Le media query usano valori letterali:
non usare `var()` nelle loro condizioni.

Due eccezioni conservano la composizione approvata: 900px per le sezioni
editoriali del Progetto e 1040px per il passaggio a due colonne delle card
del Catalogo. Non sono soglie globali da copiare in nuovi componenti.
I filtri del Catalogo passano a due colonne già a 1280px, indipendentemente
dalle card, per evitare sovrapposizioni dei pulsanti.
Il pannello mobile dei filtri è `inert` quando è chiuso; passando al desktop
torna accessibile e il focus non resta su pulsanti diventati invisibili.

## Verifica di un'estrazione

1. Confrontare le dichiarazioni complete e la specificità dei selettori.
2. Conservare le differenze come override nei fogli di pagina.
3. Confrontare le sette pagine migrate a 360, 768, 1024 e 1440px, comprese
   interazioni, menu, focus e riduzione del movimento.
4. Eseguire `python tools/check_project.py` senza richiedere `PYTHONUTF8`.

Resta da completare il riuso dei componenti nelle pagine successive.
La revisione filologica del pilot metrico resta indipendente e aperta.
