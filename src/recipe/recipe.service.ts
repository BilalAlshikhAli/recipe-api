import { addRecipeError, RecipeNotFoundError } from "./recipe.errors.ts";
import {
  addRecipe_repo,
  deleteRecipe_repo,
  getAllRecipes as getAllRecipesRepo,
  getRecipeById_repo,
  updateRecipe_repo,
  type AddRecipeInput,
  type Rezept,
  type UpdateRecipeInput,
} from "./recipe.repo.ts";

// Die Eigenschaften entsprechen den Spalten der Tabelle `rezepte`.
export type recipe = Rezept;

export async function getAllRecipes(): Promise<recipe[]> {
  return getAllRecipesRepo();
}

export async function getRecipeById(id: number): Promise<recipe> {
  const foundRecipe = await getRecipeById_repo(id);
  if (!foundRecipe) {
    throw new RecipeNotFoundError(id);
  }
  return foundRecipe;
}

export async function addRecipe(input: AddRecipeInput): Promise<recipe> {
  const errors: string[] = [];

  if (typeof input.title !== "string" || !input.title.trim()) {
    errors.push("title muss ein nicht leerer Text sein.");
  }
  if (!Number.isInteger(input.minuten) || input.minuten <= 0) {
    errors.push("minuten muss eine positive ganze Zahl sein.");
  }
  if (!Number.isInteger(input.portionen) || input.portionen <= 0) {
    errors.push("portionen muss eine positive ganze Zahl sein.");
  }
  if (typeof input.anleitung !== "string" || !input.anleitung.trim()) {
    errors.push("anleitung muss ein nicht leerer Text sein.");
  }
  if (typeof input.bewertung !== "number" || !Number.isFinite(input.bewertung)) {
    errors.push("bewertung muss eine Zahl sein.");
  }
  if (
    !Array.isArray(input.zutaten) ||
    !input.zutaten.every(
      (zutat) =>
        typeof zutat?.name === "string" &&
        zutat.name.trim().length > 0 &&
        typeof zutat.menge === "string" &&
        zutat.menge.trim().length > 0
    )
  ) {
    errors.push("zutaten muss ein Array aus Objekten mit name und menge sein.");
  }

  if (errors.length > 0) {
    throw new addRecipeError(errors.join(" | "));
  }

  return addRecipe_repo(input);
}

export async function updateRecipe(
  id: number,
  updated: UpdateRecipeInput
): Promise<recipe> {
  const result = await updateRecipe_repo(id, updated);
  if (!result) {
    throw new RecipeNotFoundError(id);
  }

  // Das UPDATE gibt die Rezeptzeile zurück; diese Abfrage ergänzt die Zutaten.
  const fullRecipe = await getRecipeById_repo(id);
  if (!fullRecipe) {
    throw new RecipeNotFoundError(id);
  }
  return fullRecipe;
}

export async function deleteRecipe(id: number): Promise<recipe> {
  const deletedRecipe = await deleteRecipe_repo(id);
  if (!deletedRecipe) {
    throw new RecipeNotFoundError(id);
  }
  return { ...deletedRecipe, zutaten: [] };
}
