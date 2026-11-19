import { RecipeNotFoundError, addRecipeError, deleteRecipeError } from "./recipe.errors.ts";


interface recipe {
    id: number;
    title: string;
    minute: number;
    portion: number;
    ingredients: string[];
    instructions: string;
    review: number;
}

const recipes = [
    {
        id: 1,
        title: "Spaghetti Carbonara",
        minute: 30,
        portion: 2,
        ingredients: ["Spaghetti", "Eier", "Parmesan", "Speck", "Pfeffer"],
        instructions: "Spaghetti kochen, Speck anbraten, Eier mit Parmesan mischen und alles vermengen.",
        review: 4.8
    },
    {
        id: 2,
        title: "Gemüse-Curry",
        minute: 40,
        portion: 4,
        ingredients: ["Reis", "Kokosmilch", "Karotten", "Zucchini", "Currypulver"],
        instructions: "Gemüse anbraten, Kokosmilch und Currypulver hinzufügen, 20 Minuten köcheln lassen und mit Reis servieren.",
        review: 4.5
    }, 

    {
        id: 3,
        title: "Pancakes",
        minute: 20,
        portion: 3,
        ingredients: ["Mehl", "Milch", "Eier", "Zucker", "Backpulver"],
        instructions: "Alle Zutaten verrühren, Teig in der Pfanne backen und mit Obst servieren.",
        review: 4.9
    },
    {
        id: 4,
        title: "Hähnchen-Salat",
        minute: 25,
        portion: 2,
        ingredients: ["Hähnchenbrust", "Salat", "Tomaten", "Gurke", "Olivenöl"],
        instructions: "Hähnchen braten, Gemüse schneiden, alles mischen und mit Olivenöl anrichten.",
        review: 4.2
    }

]

export async function getAllRecipes(): Promise<recipe[]> {
    return recipes;
}

export async function getRecipeById(id: number): Promise<recipe> {
    const recipe = recipes.find((r) => r.id === id);
    if (!recipe) {
        throw new RecipeNotFoundError(id);
    }
    return recipe;
}

export async function addRecipe(recipe: recipe): Promise<recipe> {
    
    const errors: string[] = [];

    if (typeof recipe.title !== "string") {
        errors.push("title should be a Text e.g 'Pasta'.");
    }

    if (typeof recipe.minute !== "number") {
        errors.push("minute should be a number e.g 30.");
    }

    if (typeof recipe.portion !== "number") {
        errors.push("portion should be a number e.g 2.");
    }

    if (
        !Array.isArray(recipe.ingredients) ||
        !recipe.ingredients.every((ingredient) => typeof ingredient === "string")
    ) {
        errors.push(
        "ingredients should be an array of strings e.g ['Nudeln', 'Tomatensauce']."
        );
    }

    if (typeof recipe.instructions !== "string") {
        errors.push(
        "instructions should be a Text e.g 'Nudeln kochen und Sauce hinzufügen.'"
        );
    }

    if (typeof recipe.review !== "number") {
        errors.push("review should be a number e.g 4.5.");
    }

    if (errors.length > 0) {
        throw new addRecipeError(
        "invalid recipe format. expected: " +
        "{ title: string, minute: number, portion: number, ingredients: string[], instructions: string, review: number }. " +
        "errors: " +
        errors.join(" | ")
        )
    }

    const newRecipe = { ...recipe, id: recipes.length + 1 }; 
    recipes.push(newRecipe);
    return newRecipe;
}

export async function updateRecipe(id: number, updated: recipe): Promise<recipe> {
   
    /*  we can also assume that we have a complete recipe object here including the id, so we have to export the id from the updated recipe object and use it to find the index of the recipe in the array.
        and we can also validate the updated recipe here, similar to the addRecipe function, if needed.
    */
    const index = recipes.findIndex((r) => r.id === id);
    if (index === -1) {                         
        throw new RecipeNotFoundError(id); // throw a RecipeNotFoundError if the recipe is not found
    }
    recipes[index] = { ...updated, id };
    return recipes[index];
}

export async function deleteRecipe(id: number): Promise<recipe[]> {
    //const len = recipes.length;

    const index = recipes.findIndex((r) => r.id === id);
    if (index === -1) {
        throw new deleteRecipeError(id); // throw a RecipeNotFoundError if the recipe is not found
    }
    /*
    we can also return the result of copmaring the length of the array before and after the deletion, to check if the deletion was successful or not.

    if (recipes.length !== len ) {
        return true;
    else {
        return false;
    }
    but in my opinion, it is better to return the deleted recipe as an array, so that the client can see what was deleted, and also we can use this array to check if the deletion was successful or not. 
    */ 
    return recipes.splice(index, 1); // returns the deleted recipe as an array


}