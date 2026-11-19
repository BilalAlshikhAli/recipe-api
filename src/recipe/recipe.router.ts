import {Router} from "express";
import { getRecipesHandler, getRecipeHandler, addRecipeHandler, updateRecipeHandler, deleteRecipeHandler } from "./recipe.controller.ts";
import { apiKeyCheck } from "../middleware/apiKey_check.ts";
import { handleRecipeErrors } from "./recipe.errors.ts";

const router = Router();

router.get("/", getRecipesHandler);
router.get("/:id", getRecipeHandler);
router.post("/", addRecipeHandler);
router.put("/:id", updateRecipeHandler);
router.delete("/:id", apiKeyCheck , deleteRecipeHandler);

router.use(handleRecipeErrors);

export default router;