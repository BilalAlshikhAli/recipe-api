import {Router} from "express";
import { getRecipesHandler, getRecipeHandler, addRecipeHandler, updateRecipeHandler, deleteRecipeHandler } from "./recipe.controller";
import { apiKeyCheck } from "../middleware/apiKey_check";


const router = Router();

router.get("/", getRecipesHandler);
router.get("/:id", getRecipeHandler);
router.post("/", addRecipeHandler);
router.put("/:id", updateRecipeHandler);
router.delete("/:id", apiKeyCheck , deleteRecipeHandler);



export default router;