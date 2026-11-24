-- ____________________________Tebelle Erstellen______________________________________

CREATE TABLE IF NOT EXISTS "rezepte" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "minuten" INTEGER NOT NULL,
    "portionen" INTEGER NOT NULL,
    "anleitung" TEXT NOT NULL,
    "bewertung" DECIMAL(8, 2) NOT NULL
);
ALTER TABLE 
    "rezepte" ADD PRIMARY KEY("id");


CREATE TABLE IF NOT EXISTS "zutaten"(
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NULL
);
ALTER TABLE
    "zutaten" ADD PRIMARY KEY("id");


CREATE TABLE IF NOT EXISTS "rezept_zutaten"(
    "zutat_id" INTEGER NOT NULL,
    "rezept_id" INTEGER NOT NULL,
    "menge" VARCHAR(100) NOT NULL
);
ALTER TABLE
    "rezept_zutaten" ADD PRIMARY KEY("rezept_id", "zutat_id");
ALTER TABLE
    "rezept_zutaten" ADD CONSTRAINT "rezept_zutaten_rezept_id_foreign" FOREIGN KEY("rezept_id") REFERENCES "rezepte"("id");
ALTER TABLE
    "rezept_zutaten" ADD CONSTRAINT "rezept_zutaten_zutat_id_foreign" FOREIGN KEY("zutat_id") REFERENCES "zutaten"("id")




--______________________________ Beispieldaten einfugen _____________________________________________





-- 1) Rezepte (darunter die zwei aus Woche 1)
INSERT INTO rezepte (title, minuten, portionen,anleitung, bewertung ) VALUES
  ('Spaghetti Carbonara', 20, 2, 'lange Anleitung', 4.5),
  ('Linsen-Curry',        35, 4, 'lange Anleitung', 3.0),
  ('Gemuese-Curry',        19, 4, 'Unbekannt', 2.6);

-- 2) Zutaten (jede nur einmal!)
INSERT INTO zutaten (name) VALUES
  ('Spaghetti'), ('Ei'), ('Speck'), ('Linsen'), ('Kokosmilch'), ('Zwiebel');

-- 3) Verknüpfen: welche Zutat (mit welcher Menge) gehört in welches Rezept?
--    Die ids kannst du vorher mit SELECT * FROM rezepte; / SELECT * FROM zutaten; nachschauen.
INSERT INTO rezept_zutaten (rezept_id, zutat_id, menge) VALUES
  (7, 19, '200 g'),   -- Carbonara: Spaghetti
  (7, 20, '2 Stück'), -- Carbonara: Ei
  (7, 21, '100 g'),   -- Carbonara: Speck
  (8, 22, '250 g'),   -- Curry: Linsen
  (8, 23, '400 ml'),  -- Curry: Kokosmilch
  (8, 24, '1 Stück'), -- Curry: Zwiebel
  (9, 19, '5 Stück'), -- Curry: Spaghetti
  (9, 21, '2 Stück'); -- Curry: Speck -- Curry: Speck


-- ________________________________________SQL tests___________________________________

SELECT * FROM rezepte;

SELECT title, minuten FROM rezepte;

SELECT * FROM rezepte
WHERE minuten <= 30;

SELECT * FROM rezepte
ORDER BY minuten ASC;

SELECT COUNT(*) FROM rezepte;

SELECT r.title, z.name, rz.menge
FROM rezepte r
JOIN rezept_zutaten rz ON rz.rezept_id = r.id
JOIN zutaten z         ON z.id = rz.zutat_id
WHERE r.id = 1;

SELECT title, minuten,portionen,anleitung,bewertung 
FROM rezepte WHERE id = 1;  

UPDATE rezepte SET portionen = 6 WHERE id = 1;

SELECT title, minuten,portionen,anleitung,bewertung 
FROM rezepte WHERE id = 1;  

-- DELETE FROM rezepte WHERE id = 1; -- Kann nicht gelöscht werden, da die Id bei anderen Tabellen schon existiert


