import {Router} from "express";
import { getRecipesHandler, getRecipeHandler, addRecipeHandler, updateRecipeHandler, deleteRecipeHandler } from "./recipe.controller.ts";
import { apiKeyCheck } from "../middleware/apiKey_check.ts";
import { handleRecipeErrors } from "./recipe.errors.ts";

const router = Router();


/**
 * @openapi
 * /recipes:
 *   get:
 *     summary: Alle Rezepte abrufen
 *     description: Gibt alle gespeicherten Rezepte als Array zurück.
 *     responses:
 *       200:
 *         description: Liste aller Rezepte
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recipe'
 */
router.get("/", getRecipesHandler);

/**
 * @openapi
 * /recipes/{id}:
 *   get:
 *     summary: Ein Rezept nach ID abrufen
 *     description: Gibt ein einzelnes Rezept anhand seiner ID zurück.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID des Rezepts.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Das gefundene Rezept
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       404:
 *         description: Rezept wurde nicht gefunden
 */
router.get("/:id", getRecipeHandler);

/**
 * @openapi
 * /recipes:
 *   post:
 *     summary: Neues Rezept erstellen
 *     description: Erstellt ein neues Rezept und vergibt automatisch eine ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewRecipe'
 *     responses:
 *       201:
 *         description: Rezept wurde erfolgreich erstellt
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Recipe'
 *       400:
 *         description: Ungültiges Rezeptformat
 */
router.post("/", addRecipeHandler);

/**
 * @openapi
 * /recipes/{id}:
 *   put:
 *     summary: Rezept aktualisieren
 *     description: Aktualisiert ein bestehendes Rezept anhand seiner ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID des zu aktualisierenden Rezepts.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewRecipe'
 *     responses:
 *       200:
 *         description: Rezept wurde erfolgreich aktualisiert
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       400:
 *         description: Ungültiges Rezeptformat
 *       404:
 *         description: Rezept wurde nicht gefunden
 */
router.put("/:id", updateRecipeHandler);


/**
 * @openapi
 * /recipes/{id}:
 *   delete:
 *     summary: Rezept löschen
 *     description: Löscht ein Rezept anhand seiner ID. Diese Route benötigt einen API-Key.
 *     security:
 *       - apiKey: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID des zu löschenden Rezepts.
 *         schema:
 *           type: integer
 *       - in: header
 *         name: apikey
 *         required: true
 *         description: API-Key für die Authentifizierung.
 *         schema:
 *           type: string  
 *     responses:
 *       204:
 *         description: Rezept wurde erfolgreich gelöscht
 *       401:
 *         description: API-Key fehlt oder ist ungültig
 *       400:
 *         description: Rezept wurde nicht gefunden
 */
router.delete("/:id", apiKeyCheck, deleteRecipeHandler);

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     apiKey:
 *       type: apiKey
 *       in: header
 *       name: apikey
 *   schemas:
 *     Recipe:
 *       type: object
 *       required: [id, title, minuten, portionen, zutaten, anleitung, bewertung]
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: Spaghetti Carbonara
 *         minuten:
 *           type: number
 *           description: Zubereitungsdauer in Minuten
 *           example: 30
 *         portionen:
 *           type: number
 *           example: 2
 *         zutaten:
 *           type: array
 *           items:
 *             type: object
 *             required: [name, menge]
 *             properties:
 *               name:
 *                 type: string
 *               menge:
 *                 type: string
 *           example: [{name: Spaghetti, menge: "200 g"}]
 *         anleitung:
 *           type: string
 *         bewertung:
 *           type: number
 *           example: 4.8
 *     NewRecipe:
 *       type: object
 *       required: [title, minuten, portionen, zutaten, anleitung, bewertung]
 *       properties:
 *         title:
 *           type: string
 *         minuten:
 *           type: number
 *         portionen:
 *           type: number
 *         zutaten:
 *           type: array
 *           items:
 *             type: object
 *             required: [name, menge]
 *             properties:
 *               name:
 *                 type: string
 *               menge:
 *                 type: string
 *         anleitung:
 *           type: string
 *         bewertung:
 *           type: number
 *   responses:
 *     RecipeNotFound:
 *       description: Rezept wurde nicht gefunden
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: Rezept mit der ID 5 wurde nicht gefunden.
 */
router.use(handleRecipeErrors);

export default router;
