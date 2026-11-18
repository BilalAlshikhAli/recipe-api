import { NextFunction, Request, Response } from "express";

export class RecipeNotFoundError extends Error {
    constructor(recipeId: number) {
        super(`Recipe not found. ID: ${recipeId}`);
        this.name =  new.target.name;
    }
}

export class addRecipeError extends Error {
    constructor(message: string) {
        super(message);
        this.name =  new.target.name;
    }
}

export class updateRecipeError extends Error {
    constructor(id: number) {
        super(`Recipe not found. ID: ${id}`);
        this.name =  new.target.name;
    }
}

export class deleteRecipeError extends Error {
    constructor(id: number) {
        super(`Recipe not found. ID: ${id}`);
        this.name =  new.target.name;
    }
}


export function handleRecipeErrors( err: Error,_req: Request,res: Response,next: NextFunction) {
    
    if (err instanceof RecipeNotFoundError) {   // recipe not found error
        return res.status(404).json({
            message: err.message,
            success: false,
        });
    }   
    
    if (err instanceof addRecipeError) { 
        return res.status(400).json({
            message: err.message,
            success: false,
        }); 
    }

    if (err instanceof updateRecipeError) {
        return res.status(400).json({
            message: err.message,
            success: false,
        });
    }

    if (err instanceof deleteRecipeError) {
        return res.status(400).json({
            message: err.message,
            success: false,
        });
    }
    next(err); // pass the error to the next middleware if it's not a RecipeNotFoundError or addRecipeError
}

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error(err.stack);
    if (res.headersSent) {
        return next(err);
    }
    res.status(500).json({ success: false, error: "Internal server error" });
}