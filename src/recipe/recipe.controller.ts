import { Request, Response, NextFunction } from "express";
import { addRecipe, getAllRecipes, getRecipeById, updateRecipe, deleteRecipe } from "./recipe.service";



export async function getRecipesHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const recipes = await getAllRecipes();
        res.json(recipes);

    } catch (err) {
        next(err);
    }
}

export async function getRecipeHandler(req: Request, res: Response, next: NextFunction) {

  const id = Number(req.params.id); // pick the id from the request parameters and convert it to a number
  
  try {
    const recipe = await getRecipeById(id); // get the recipe form the 'database' by id using the service function
    if (!recipe) {                          // check if the recipe is null, if so return a 404 error with a message
      return res.status(404).json({ 
        success: false,
        message: "Recipe not found" });
    }
    res.status(200).json({                  // if the recipe is found, return it with a 200 status code and a success message
      success: true,
      data: recipe
    });
  } catch (err) {
    next(err);
  }
}

export async function addRecipeHandler(req: Request, res: Response, next: NextFunction) {
    const recipe = req.body; // pick the recipe from the request body
    try {
        const newRecipe = await addRecipe(recipe);
        if (!newRecipe) {
            return res.status(404).json({
                success: false,
                message: "Failed to add recipe"
            });
        }
        res.status(201).json({
            success: true,
            data: newRecipe
        });
    } catch (err) {
        next(err);
    }
}

export async function updateRecipeHandler(req: Request, res: Response, next: NextFunction) {
    const id = Number(req.params.id);
    const updatedRecipe = req.body; 
    try {
        const recipe = await updateRecipe(id, updatedRecipe);
        if (!recipe) {
            return res.status(404).json({
                success: false,
                message: "Recipe not found"
            });
        }
        res.status(200).json({
            success: true,
            data: recipe
        });
    } catch (err) {
        next(err);
    }
}

export async function deleteRecipeHandler(req: Request, res: Response, next: NextFunction) {
    const id = Number(req.params.id);
    try {
        const recipes = await deleteRecipe(id);
        if (!recipes) {
            return res.status(404).json({
                success: false,
                message: "Recipe not found"
            });
        }
        res.status(204).json({
            success: true,
            data: recipes
        });
    } catch (err) {
        next(err);
    }
}