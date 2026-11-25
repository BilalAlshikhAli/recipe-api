import { getPostgresPool } from "../utils/pool.postgres.ts";
const pool = getPostgresPool(); 

export type RezeptZutat = {
  name: string;
  menge: string;
};

export type Rezept = {
  id: number;
  title: string;
  minuten: number;
  portionen: number;
  anleitung: string;
  bewertung: number;
  zutaten: RezeptZutat[];
};

export type AddRecipeInput = Omit<Rezept, "id">;

export type UpdateRecipeInput = Partial<Omit<Rezept, "id" | "zutaten">>;

const editableColumns = {
  title: "title",
  minuten: "minuten",
  portionen: "portionen",
  anleitung: "anleitung",
  bewertung: "bewertung",
};


export async function getAllRecipes(): Promise<Rezept[]> {
  const res = await pool.query(
    "SELECT * FROM rezepte ORDER BY id"
  );
  
  return res.rows
}

export async function addRecipe_repo(input: AddRecipeInput) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const recipeResult = await client.query(
      `INSERT INTO rezepte (title, minuten, portionen, anleitung, bewertung)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [input.title, input.minuten, input.portionen, input.anleitung, input.bewertung]
    );
    const createdRecipe = recipeResult.rows[0];
    const savedIngredients: RezeptZutat[] = [];

    for (const ingredient of input.zutaten) {
      const normalizedName = ingredient.name.trim();
      if (!normalizedName) {
        throw new Error("Zutatennamen dürfen nicht leer sein.");
      }

      // Vorhandene Zutaten werden wiederverwendet (ohne Beachtung der Großschreibung).
      const existingIngredient = await client.query(
        `SELECT id
         FROM zutaten
         WHERE lower(name) = lower($1)
         ORDER BY id
         LIMIT 1`,
        [normalizedName]
      );

      let ingredientId: number;
      if (existingIngredient.rowCount) {
        ingredientId = existingIngredient.rows[0].id;
      } else {
        const newIngredient = await client.query(
          `INSERT INTO zutaten (name)
           VALUES ($1)
           RETURNING id`,
          [normalizedName]
        );
        ingredientId = newIngredient.rows[0].id;
      }

      await client.query(
        `INSERT INTO rezept_zutaten (rezept_id, zutat_id, menge)
         VALUES ($1, $2, $3)
         ON CONFLICT (rezept_id, zutat_id)
         DO UPDATE SET menge = EXCLUDED.menge`,
        [createdRecipe.id, ingredientId, ingredient.menge]
      );

      savedIngredients.push({ name: normalizedName, menge: ingredient.menge });
    }

    await client.query("COMMIT");
    return { ...createdRecipe, zutaten: savedIngredients } as Rezept;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function getRecipeById_repo(id:number) {
    const res = await pool.query(
        'SELECT * FROM rezepte WHERE id = $1', [id]
    )

    if(res.rowCount === 0 ) return null

    const zutatenRes = await pool.query(
      `SELECT z.name, rz.menge
       FROM rezept_zutaten rz
       JOIN zutaten z ON z.id = rz.zutat_id
       WHERE rz.rezept_id = $1
       ORDER BY z.id`,
      [id]
    );

    return { ...res.rows[0], zutaten: zutatenRes.rows } as Rezept;
}


export async function updateRecipe_repo(id: number, changes: UpdateRecipeInput) {

    const entries = Object.entries(changes).filter(
    ([key, value]) =>
      key in editableColumns &&
      value !== undefined
  );

  if (entries.length === 0) {
    throw new Error("Es wurden keine änderbaren Felder übergeben.");
  }

  const values = entries.map(([, value]) => value);
  const assignments = entries.map(
    ([key], index) =>
      `${editableColumns[key as keyof typeof editableColumns]} = $${index + 1}`
  );

  values.push(id);

  const result = await pool.query(
    `UPDATE rezepte
     SET ${assignments.join(", ")}
     WHERE id = $${values.length}
     RETURNING *`,
    values
  );

  return result.rows[0] ?? null;
}
    
export async function deleteRecipe_repo(id:number) {
    const result = await pool.query(
        'DELETE FROM rezepte WHERE id = $1 RETURNING *', [id]
    )
    return result.rows[0] ?? null;
}
