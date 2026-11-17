import express from "express";
import recipeRoutes from "./recipe/recipe.router";
import { logger } from "./middleware/logger";

const PORT = 3000;
const app = express();

app.get("/status", (req, res) => {
    res.status(200).json({ message: "Server is running." })
})


app.use(logger);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/recipes", recipeRoutes)



app.listen(PORT, () => console.log(`Server läuft jetzt auf port ${PORT}`));