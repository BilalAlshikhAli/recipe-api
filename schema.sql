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

--________________________________________BOOK_____________________________________-

CREATE TABLE books (
    id serial primary key,
    title varchar NOT NULL,
    author varchar NOT NULL,
    release_date DATE
);

-- Jede Kombination aus Titel + Autor nur einmal, ohne Rücksicht auf Groß-/Kleinschreibung.
-- Leerzeichen am Rand entfernt schon der Service vor dem Insert.
CREATE UNIQUE INDEX books_title_author_unique ON books (lower(title), lower(author));

INSERT INTO books (title, author, release_date) VALUES
    ('The Hobbit', 'J.R.R. Tolkien', '1937-09-21'),
    ('Dune', 'Frank Herbert', '1965-08-01'),
    ('A Game of Thrones', 'George R.R. Martin', '1996-08-01'),
    ('Foundation', 'Isaac Asimov', '1951-06-01'),
    ('The Name of the Wind', 'Patrick Rothfuss', '2007-03-27'),
    ('Neuromancer', 'William Gibson', '1984-07-01'),
    ('Die unendliche Geschichte', 'Michael Ende', '1979-09-01'),
    ('The Left Hand of Darkness', 'Ursula K. Le Guin', '1969-03-01'),
    ('Mistborn: The Final Empire', 'Brandon Sanderson', '2006-07-17'),
    ('The Hitchhiker''s Guide to the Galaxy', 'Douglas Adams', '1979-10-12');

-- Crew gehört genau zu einem Film (1:1) -> direkt als Spalten in movies
CREATE TABLE movies (
    id serial primary key,
    title varchar NOT NULL,
    year integer NOT NULL,
    director varchar NOT NULL,
    editor varchar NOT NULL,
    cinematographer varchar NOT NULL
);

-- Jedes Genre gibt es nur einmal
CREATE TABLE genres (
    id serial primary key,
    name varchar NOT NULL UNIQUE
);

-- n:m-Beziehung: ein Film hat mehrere Genres, ein Genre gehört zu mehreren Filmen
-- jede Zeile = "Film X hat Genre Y"
CREATE TABLE movie_genres (
    movie_id integer NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    genre_id integer NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
    PRIMARY KEY (movie_id, genre_id)   -- dieselbe Kombination darf nur einmal vorkommen
);

INSERT INTO movies (title, year, director, editor, cinematographer) VALUES
    ('The Shawshank Redemption', 1994, 'Frank Darabont', 'Richard Francis-Bruce', 'Roger Deakins'),          -- id 1
    ('The Godfather', 1972, 'Francis Ford Coppola', 'William Reynolds', 'Gordon Willis'),                    -- id 2
    ('Pulp Fiction', 1994, 'Quentin Tarantino', 'Sally Menke', 'Andrzej Sekuła'),                            -- id 3
    ('Inception', 2010, 'Christopher Nolan', 'Lee Smith', 'Wally Pfister'),                                  -- id 4
    ('Spirited Away', 2001, 'Hayao Miyazaki', 'Takeshi Seyama', 'Atsushi Okui'),                             -- id 5
    ('Blade Runner', 1982, 'Ridley Scott', 'Terry Rawlings', 'Jordan Cronenweth'),                           -- id 6
    ('Das Leben der Anderen', 2006, 'Florian Henckel von Donnersmarck', 'Patricia Rommel', 'Hagen Bogdanski'), -- id 7
    ('The Matrix', 1999, 'Lana & Lilly Wachowski', 'Zach Staenberg', 'Bill Pope'),                           -- id 8
    ('Parasite', 2019, 'Bong Joon-ho', 'Yang Jin-mo', 'Hong Kyung-pyo'),                                     -- id 9
    ('Back to the Future', 1985, 'Robert Zemeckis', 'Arthur Schmidt', 'Dean Cundey');                        -- id 10

INSERT INTO genres (name) VALUES
    ('Drama'),      -- id 1
    ('Crime'),      -- id 2
    ('Thriller'),   -- id 3
    ('Sci-Fi'),     -- id 4
    ('Action'),     -- id 5
    ('Animation'),  -- id 6
    ('Fantasy'),    -- id 7
    ('Adventure'),  -- id 8
    ('Comedy');     -- id 9

-- (movie_id, genre_id) - die IDs aus den Kommentaren oben
INSERT INTO movie_genres (movie_id, genre_id) VALUES
    (1, 1),                  -- Shawshank: Drama
    (2, 2), (2, 1),          -- Godfather: Crime, Drama
    (3, 2), (3, 3),          -- Pulp Fiction: Crime, Thriller
    (4, 4), (4, 5), (4, 3),  -- Inception: Sci-Fi, Action, Thriller
    (5, 6), (5, 7), (5, 8),  -- Spirited Away: Animation, Fantasy, Adventure
    (6, 4), (6, 3),          -- Blade Runner: Sci-Fi, Thriller
    (7, 1), (7, 3),          -- Das Leben der Anderen: Drama, Thriller
    (8, 4), (8, 5),          -- The Matrix: Sci-Fi, Action
    (9, 3), (9, 1), (9, 9),  -- Parasite: Thriller, Drama, Comedy
    (10, 4), (10, 9), (10, 8); -- Back to the Future: Sci-Fi, Comedy, Adventure

--____________________________BOOK REVIEWS________________________________________

CREATE TABLE IF NOT EXISTS reviews (
    id serial PRIMARY KEY,
    book_id integer NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    author varchar(255) NOT NULL,
    rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment text NOT NULL
);

INSERT INTO reviews (book_id, author, rating, comment)
SELECT b.id, seed.author, seed.rating, seed.comment
FROM (VALUES
    ('The Hobbit', 'Sam Reader', 5, 'A timeless adventure.'),
    ('Dune', 'Alex Reader', 4, 'Rich world building and memorable characters.'),
    ('Foundation', 'Jamie Reader', 4, 'A thoughtful science fiction classic.')
) AS seed(book_title, author, rating, comment)
JOIN books b ON b.title = seed.book_title;
