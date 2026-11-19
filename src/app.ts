import express from "express";
import recipeRoutes from "./recipe/recipe.router";
import { logger } from "./middleware/logger";
import { errorHandler } from "./recipe/recipe.errors";



const app = express();

app.get("/status", (req, res) => {
    res.status(200).json({ message: "Server is running." })
})


app.use(logger);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/recipes", recipeRoutes)

app.use((req, res) => {
    res.status(404).json({ error: `Route ${req.originalUrl} not found.`})
})

//reciperErrorHandler is is used in recipe routes and it is a global error handler middleware that will catch any errors thrown in the application and return a proper response to the client.
app.use(errorHandler); //  global Error-Middleware

export default app;