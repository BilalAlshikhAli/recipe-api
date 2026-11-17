import {Request, Response, NextFunction} from "express";
import "dotenv/config"; // import dotenv to access environment variables


/*
we can define the apikey as constant here, but it is better to define it in the .env file and access it using process.env.API_KEY
sothat we can add the .env file to .gitignore and not push it to github, so that the api key is not public.
const apiKey = "Bilal123"
*/

export function apiKeyCheck(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.headers["apikey"];
   
    console.log("API Key from request header:", apiKey); // log the api key from the request header for debugging purposes
    console.log("API Key from environment variable:", process.env.API_KEY); // log the api key from the environment variable for debugging purposes
    
    if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(401).json({ message: "Fehler: Nicht autorisiert" });
    }
    next();       
    
}
