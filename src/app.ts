import express from "express";
import recipeRoutes from "./recipe/recipe.router.ts";
import { logger } from "./middleware/logger.ts";
import { errorHandler } from "./recipe/recipe.errors.ts";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express"

const swaggerSpec = swaggerJSDoc({
    definition: {
        openapi: "3.0.0",
        info: { title: "Recipe-Api", version: "1.0.0" }
    },
    apis: [`${import.meta.dirname}/**/*.router.ts`]
})

const app = express();

const CDN = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14";
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCssUrl: `${CDN}/swagger-ui.min.css`,
    customJs: [
        `${CDN}/swagger-ui-bundle.min.js`,
        `${CDN}/swagger-ui-standalone-preset.min.js`,
    ],
}));


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