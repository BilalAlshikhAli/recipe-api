import {Router} from "express";
import { getRecipesHandler, getRecipeHandler, addRecipeHandler, updateRecipeHandler, deleteRecipeHandler } from "./recipe.controller.ts";
import { apiKeyCheck } from "../middleware/apiKey_check.ts";
import { handleRecipeErrors } from "./recipe.errors.ts";

const router = Router();

router.get("/", getRecipesHandler);

/**
 * @openapi
 * /recipes/{id}:
 *   get:
 *     summary: Rezept anhand der ID abrufen
 *     tags: [Rezepte]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Numerische ID des Rezepts
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Rezept gefunden
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
 *       404:
 *         description: Rezept nicht gefunden
 */
router.get("/:id", getRecipeHandler);

/**
 * @openapi
 * /recipes:
 *   post:
 *     summary: Neues Rezept anlegen
 *     tags: [Rezepte]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewRecipe'
 *     responses:
 *       201:
 *         description: Rezept wurde angelegt
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
 *         description: Ungültige Rezeptdaten
 */
router.post("/", addRecipeHandler);

/**
 * @openapi
 * /recipes/{id}:
 *   put:
 *     summary: Rezept aktualisieren
 *     description: Ersetzt die Rezeptdaten. Die ID im Pfad wird verwendet.
 *     tags: [Rezepte]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Numerische ID des Rezepts
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
 *         description: Rezept wurde aktualisiert
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
 *         description: Rezept nicht gefunden
 */
router.put("/:id", updateRecipeHandler);

/**
 * @openapi
 * /recipes/{id}:
 *   delete:
 *     summary: Rezept löschen
 *     description: Erfordert einen gültigen API-Key.
 *     tags: [Rezepte]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Numerische ID des Rezepts
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Rezept wurde gelöscht
 *       400:
 *         description: Rezept nicht gefunden
 *       401:
 *         description: API-Key fehlt oder ist ungültig
 */
router.delete("/:id", apiKeyCheck, deleteRecipeHandler);

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     ApiKeyAuth:
 *       type: apiKey
 *       in: header
 *       name: apikey
 *   schemas:
 *     Recipe:
 *       type: object
 *       required: [id, title, minute, portion, ingredients, instructions, review]
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: Spaghetti Carbonara
 *         minute:
 *           type: number
 *           description: Zubereitungsdauer in Minuten
 *           example: 30
 *         portion:
 *           type: number
 *           example: 2
 *         ingredients:
 *           type: array
 *           items:
 *             type: string
 *           example: [Spaghetti, Eier, Parmesan]
 *         instructions:
 *           type: string
 *         review:
 *           type: number
 *           example: 4.8
 *     NewRecipe:
 *       type: object
 *       required: [title, minute, portion, ingredients, instructions, review]
 *       properties:
 *         title:
 *           type: string
 *         minute:
 *           type: number
 *         portion:
 *           type: number
 *         ingredients:
 *           type: array
 *           items:
 *             type: string
 *         instructions:
 *           type: string
 *         review:
 *           type: number
 */
router.use(handleRecipeErrors);

export default router;