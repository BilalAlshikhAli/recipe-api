# Plan: Buchrezensionen im `express-demo`

## Ziel

Buchrezensionen in DB vollständig über die vorhandene Schichtung an PostgreSQL anbinden. Die Umsetzung erfolgt lokal auf dem bereits ausgecheckten Branch. Nach der Prüfung erstellst du selbst einen Pull Request.



## Arbeitsschritte

### 1. Bestandsaufnahme

- Keinen neuen Gruppen-Branch erstellen; auf dem aktuellen lokalen Branch arbeiten.
- Den richtigen `express-demo`-Checkout verwenden und sicherstellen, dass lokale Änderungen erhalten bleiben.
- Die vorhandene Schichtung `router → controller → service → repo`, Antwortformate, IDs und Fehlerbehandlung nachvollziehen.
- Prüfen, ob Buchendpunkte ihre Daten aus der DB lesen und wie sich die Buch-Existenz zuverlässig abfragen lässt.

### 2. Schema und Seed

- In `db/schema.sql` die Tabelle `reviews` mit Primärschlüssel `id`, nicht-null `book_id`, `author`, `rating` und `comment` anlegen.
- FK `book_id → books(id)` mit `ON DELETE CASCADE` und `CHECK (rating BETWEEN 1 AND 5)` definieren.
- Mehrere Seeds für vorhandene Bücher hinzufügen; das Seed-Verfahren des Projekts beachten.
- Buchabfragen für Listen und Einzelabruf um `AVG(rating)` ergänzen. Leere Bewertung als `null` oder `0` abbilden und konsistent dokumentieren.

### 3. Neues `src/reviews/`-Modul

- `reviews.repo.ts`: parametrisierte Queries zum Auflisten, Erstellen und Löschen von Rezensionen sowie zur Buch-Existenzprüfung. DELETE mit `RETURNING`.
- `reviews.service.ts`: Geschäftsregeln bündeln, Eingaben validieren und für unbekannte Bücher einen eindeutigen Fehler auslösen.
- `reviews.controller.ts`: Handler für GET, POST und DELETE implementieren; Statuscodes und Antwortformat an die bestehende API anpassen.
- `reviews.errors.ts`: ungültige Eingaben als `400`, unbekanntes Buch und unbekannte Rezension als `404` behandeln. Unerwartete DB-Fehler nicht als Validierungsfehler maskieren.
- `reviews.router.ts`: Endpunkte sowie vollständige `@openapi`-Kommentare ergänzen. Request-Body mit `author`, ganzzahligem `rating` von 1 bis 5 und `comment` dokumentieren.
- Router so registrieren, dass exakt `/books/:id/reviews` und `/books/:id/reviews/:reviewId` entstehen. Prüfen, dass Swagger den Router scannt.

### 4. Durchschnittsbewertung der Bücher

- Jede Buch-Response, insbesondere Listen- und Einzelabruf, um ein Feld wie `averageRating` ergänzen.
- `AVG(rating)` direkt in SQL per Join oder Subquery berechnen, statt den Wert im Anwendungsspeicher zu schätzen.
- Typen/DTOs und OpenAPI-Schemas anpassen. Den von PostgreSQL gelieferten Aggregatwert (`pg` kann ihn als String liefern) in Zahl oder `null` umwandeln.

### 5. Eingaben und Fehlerfälle

- Pfad-IDs als positive Ganzzahlen validieren; fehlerhafte IDs und Bodies ergeben `400`.
- `author` und `comment` müssen nicht-leere Strings sein; `rating` muss eine Ganzzahl zwischen 1 und 5 sein.
- GET und POST für ein gültiges, aber unbekanntes Buch ergeben `404`, nicht einen FK-bedingten `500`.
- DELETE für eine unbekannte Rezension ergibt `404`; bei Erfolg die übliche Erfolgsantwort, vorzugsweise `204`, verwenden.
- Alle SQL-Werte parametrisieren.

## Verifikation

- Schema in einer frischen lokalen DB anwenden. Seeds, FK-Cascade und Rating-Constraint prüfen.
- GET mit und ohne Rezensionen, gültiges und ungültiges POST, unbekanntes Buch, erfolgreiches und erfolgloses DELETE sowie Buchantworten mit Durchschnitt nachvollziehen.
- Vorhandene Tests/Checks und Typecheck des Projekts ausführen.
- `/docs` öffnen und prüfen, dass GET und POST der Rezensionen erscheinen.
- Sicherstellen, dass Validierungsfehler `400`, fehlende Ressourcen `404` und keine dieser erwarteten Situationen `500` ergeben.

## Schichtweise Änderungen und Commits

1. `db: add reviews table and seed data` — Schema, Constraints und Seed.
2. `reviews: add repository and service` — Datenzugriff und Geschäftsregeln.
3. `reviews: add controllers routes and OpenAPI docs` — HTTP-Schicht, Registrierung und Doku.
4. `books: include average review rating` — Aggregation, Typen und Buchantworten.

Änderungen lokal in dieser Reihenfolge umsetzen und gezielt prüfen. Commits sind für die lokale Aufgabe nicht erforderlich. Falls du sie vor deinem PR selbst erstellen möchtest, die Schichten getrennt und gezielt stagen.

## Abschluss und Übergabe

- Alle Änderungen bleiben lokal; nichts pushen und keinen Pull Request erstellen.
- Nach Umsetzung die Verifikation durchführen und Änderungen sowie Prüfergebnisse für deine Durchsicht bereithalten.
- Nach deiner Überprüfung kannst du selbst einen PR gegen `main` erstellen. Als mögliche Kurzbeschreibung: Schema und Seeds für Buchrezensionen, GET/POST/DELETE-Endpunkte, Validierung, OpenAPI-Dokumentation und durchschnittliche Buchbewertung.

## Abnahmekriterien

- [ ] `db/schema.sql` enthält `reviews`, FK mit `ON DELETE CASCADE`, Rating-Check und Seeds.
- [ ] `GET /books/:id/reviews` liest Rezensionen aus PostgreSQL.
- [ ] `POST /books/:id/reviews` validiert und speichert `author`, `rating`, `comment`.
- [ ] `DELETE /books/:id/reviews/:reviewId` löscht; fehlende Rezension ergibt `404`.
- [ ] Ungültige Eingaben ergeben `400`; unbekannte Bücher `404` statt `500`.
- [ ] Code folgt `src/reviews/` und der vorhandenen Schichtung; Queries sind parametrisiert.
- [ ] GET und POST sind per `@openapi` dokumentiert und unter `/docs` sichtbar.
- [ ] Jede Buch-Response enthält den in der DB berechneten Wert `AVG(rating)`.
- [ ] Umsetzung und Prüfung wurden lokal durchgeführt; kein Gruppen-Branch und kein PR wurden erstellt.
