import { Router } from "express";
import {
  createReviewHandler,
  deleteReviewHandler,
  getReviewsHandler,
} from "./reviews.controller.ts";
import { handleReviewErrors } from "./reviews.errors.ts";

const router = Router();

/**
 * @openapi
 * /books/{id}/reviews:
 *   get:
 *     summary: Rezensionen eines Buchs abrufen
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Rezensionen des Buchs
 *       400:
 *         description: Ungültige Buch-ID
 *       404:
 *         description: Buch nicht gefunden
 */
router.get("/:id/reviews", getReviewsHandler);

/**
 * @openapi
 * /books/{id}/reviews:
 *   post:
 *     summary: Rezension für ein Buch anlegen
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [author, rating, comment]
 *             properties:
 *               author:
 *                 type: string
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Rezension wurde angelegt
 *       400:
 *         description: Ungültige Eingabe
 *       404:
 *         description: Buch nicht gefunden
 */
router.post("/:id/reviews", createReviewHandler);

/**
 * @openapi
 * /books/{id}/reviews/{reviewId}:
 *   delete:
 *     summary: Rezension eines Buchs löschen
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Rezension gelöscht
 *       400:
 *         description: Ungültige ID
 *       404:
 *         description: Buch oder Rezension nicht gefunden
 */
router.delete("/:id/reviews/:reviewId", deleteReviewHandler);

router.use(handleReviewErrors);

export default router;
