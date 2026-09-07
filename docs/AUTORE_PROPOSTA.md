# Proposta pagina Autore

Questa prima bozza sostituisce il layout Bootstrap della pagina Autore con il sistema visivo LexAr. Conserva i paragrafi storici presenti nella versione precedente e li dispone in sezioni con indice interno.

- Hero blu dedicata al titolo; ritratto `aristofane2.jpg` fuori dalla hero, accanto alla biografia, con altezza contenuta.
- Titoli e collegamenti sui fondi chiari usano i toni scuri della palette condivisa per garantire il contrasto.
- Fascia dati su fondo `--ink`.
- Indice orizzontale, con ritorno a capo su mobile.
- Biografia con titolo sopra il testo e ritratto a destra; carriera in sei blocchi tematici su due colonne; stile con quattro blocchi su fascia azzurra. Su mobile i blocchi seguono una sola colonna.
- Teatro di Dioniso per la carriera e manoscritto delle Rane per lo stile; immagini locali ottimizzate, crediti e licenze nelle didascalie.
- Biografia chiara, carriera blu profondo, stile azzurro con inserto carta, collegamenti su fondo blu petrolio. Accenti turchesi dalla palette condivisa.
- Footer condiviso con la pagina Progetto; collegamento Autore nella navigazione di tutte le pagine.
- Sezioni biografiche, carriera e stile con testo invariato, suddiviso in paragrafi e sottosezioni descrittive.
- Rimossi occhielli in maiuscoletto e numerazione decorativa; conservati i dati storici.
- Tre card di proseguimento verso Linea del tempo, Catalogo e Lessico.

I valori locali sono in `style/autore.css`; la pagina carica prima `shared.css` e `navigation.js`. La bozza è intenzionalmente semplice da modificare: titoli, testi, ordine delle sezioni e immagine possono essere cambiati senza intervenire sul sistema comune.
