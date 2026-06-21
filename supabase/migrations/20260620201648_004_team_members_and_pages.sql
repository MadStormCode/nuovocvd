/*
# Centro Vela Dervio - Migration v4

1. Nuova tabella: team_members
- gestione del team nella pagina Chi Siamo

2. Nuove pagine site_pages

3. Fix permissions
*/

CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  description text,
  image_url text,
  email text,
  phone text,
  sort_order int DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "team_members_select_public" ON team_members;
CREATE POLICY "team_members_select_public"
  ON team_members FOR SELECT
  TO anon, authenticated USING (is_active = true);

DROP POLICY IF EXISTS "team_members_insert_admin" ON team_members;
CREATE POLICY "team_members_insert_admin"
  ON team_members FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'segreteria', 'editor'))
  );

DROP POLICY IF EXISTS "team_members_update_admin" ON team_members;
CREATE POLICY "team_members_update_admin"
  ON team_members FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'segreteria', 'editor'))
  );

DROP POLICY IF EXISTS "team_members_delete_admin" ON team_members;
CREATE POLICY "team_members_delete_admin"
  ON team_members FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'segreteria'))
  );

CREATE INDEX IF NOT EXISTS idx_team_members_sort ON team_members(sort_order);

-- Seed team members
INSERT INTO team_members (name, role, description, image_url, sort_order, is_active) VALUES
  ('Marco Bianchi', 'Presidente', 'Fondatore del Centro Vela Dervio. Velista agonista con oltre 40 anni di esperienza.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400', 1, true),
  ('Laura Rossi', 'Direttore Sportivo', 'Istruttrice FIV di 3° livello. Campionessa italiana Laser Radial.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400', 2, true),
  ('Giuseppe Verdi', 'Istruttore Optimist', 'Specialista nella formazione dei più piccoli. 15 anni di esperienza con i bambini.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', 3, true),
  ('Anna Neri', 'Istruttrice Laser', 'Ex atleta olimpica. Specialista in tecnica avanzata e preparazione fisica.', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400', 4, true),
  ('Roberto Marino', 'Istruttore 420/Skiff', 'Velista di classe internazionale. Specialista in tattica di regata.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', 5, true),
  ('Sofia Conti', 'Responsabile Campus', 'Coordinatrice delle attività serali e del campus estivo. Educatrice professionale.', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400', 6, true)
ON CONFLICT DO NOTHING;

-- Nuove pagine utili
INSERT INTO site_pages (slug, title, content, meta_description, icon, nav_group, sort_order, is_active) VALUES
  ('spiagge', 'Spiagge', 
   'Dervio offre diverse spiagge e accessi al lago per chi pratica vela e per chi semplicemente vuole godersi il sole.

**Spiaggia di Dervio**
- Lunghezza: 300 metri
- Sabbia e ghiaia
- Servizi: docce, bar, noleggio pedalò
- Adatta a famiglie e bambini
- Parcheggio nelle vicinanze

**Spiaggia di Corenno Plinio**
- Piccola spiaggia ghiaiosa
- Vista sul Castello di Corenno
- Ideale per chi cerca tranquillità
- Accesso a piedi dal centro storico

**Spiaggia di Bellano**
- Spiaggia attrezzata a 3 km da Dervio
- Sabbia fine
- Servizi completi: bar, ristorante, noleggio
- Adatta per sport acquatici

**Accesso Club**
- Il Centro Vela ha un accesso privato all acqua
- Doccia e spogliatoi
- Parcheggio riservato ai soci
- Servizio di custodia barche', 
   'Spiagge e accesso al lago a Dervio: dove prendere il sole e praticare sport acquatici', 'Sun', 'info', 5, true),

  ('attivita', 'Attività', 
   'Oltre alla vela, il Lago di Como offre infinite possibilità di divertimento e relax.

**Sport Acquatici**
- Kitesurf: spot a Colico (15 minuti)
- Windsurf: spot a Dervio e Bellano
- SUP (Stand Up Paddle): noleggio disponibile
- Canoa e kayak: escursioni guidate
- Subacquea: immersioni nel lago

**Escursioni**
- Sentiero del Viandante: percorso panoramico da Dervio a Bellano
- Piani di Nava: escursione in mountain bike
- Grignetta: trekking per esperti
- Villa Monastero (Varenna): giardini botanici

**Cultura**
- Castello di Corenno Plinio (Dervio)
- Orrido di Bellano (cascata naturale)
- Varenna: borghi pittoreschi
- Bellagio: perla del lago
- Como: città storica e shopping

**Gastronomia**
- Ristoranti tipici con pesce di lago
- Pizzerie sul lungolago
- Enoteche con vini locali
- Aperitivi con vista lago', 
   'Attività e cose da fare a Dervio e sul Lago di Como: sport, escursioni, cultura, gastronomia', 'Compass', 'info', 6, true),

  ('partner', 'Partner e Sponsor', 
   'Il Centro Vela Dervio ringrazia i partner e sponsor che ci sostengono ogni anno.

**Partner Principali**
- Federazione Italiana Vela (FIV): riconoscimento scuola vela
- Comune di Dervio: patrocinio e supporto
- Provincia di Lecco: contributi per eventi
- Regione Lombardia: progetti sportivi

**Sponsor Tecnici**
- Fornitori attrezzatura nautica
- Abbigliamento tecnico
- Assicurazioni sportive
- Trasporti e logistica

**Diventa Partner**
Sei un azienda interessata a collaborare con il Centro Vela Dervio? Contattaci per scoprire le opportunità di partnership e sponsorizzazione.

Email: sponsor@centroveladervio.it', 
   'Partner e sponsor del Centro Vela Dervio: collaborazioni e opportunità', 'Handshake', 'info', 7, true),

  ('costi-e-agevolazioni', 'Costi e Agevolazioni', 
   'Scopri tutte le opportunità per risparmiare e le agevolazioni disponibili.

**Sconti Famiglia**
- 10% sul secondo figlio iscritto
- 15% sul terzo figlio e successivi
- Valido su tutti i corsi estivi

**Sconti Soci**
- Soci tesserati: 5% su tutti i corsi
- Familiari di soci: 10% di sconto
- Tesseramento annuo: 50 euro

**Agevolazioni**
- ISEE < 25.000 euro: sconto 20%
- Famiglie numerose: sconto 15%
- Disabili: supporto gratuito e attrezzatura adattata

**Borse di Studio**
- Ogni anno 5 borse di studio complete
- Bando aperto da marzo a maggio
- Requisiti: merito sportivo e situazione economica

**Pagamenti**
- Bonifico bancario
- Carta di credito
- Rateizzazione in 3 mesi senza interessi
- Assegno circolare', 
   'Costi, sconti e agevolazioni per i corsi di vela a Dervio', 'BadgePercent', 'info', 8, true)

ON CONFLICT (slug) DO NOTHING;
