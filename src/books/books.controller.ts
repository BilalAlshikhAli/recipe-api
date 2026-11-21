import { Response, Request, NextFunction } from "express";
import { getAllBooks, getBookById, searchBooks } from "./books.service.ts";
import { sendSuccess } from "../utils/sendSuccess.ts";

export async function getBooksHandler(req: Request, res: Response, next: NextFunction) {
    try {
        sendSuccess(res, await getAllBooks());
    } catch (error) {
        next(error);
    }
}

export async function getBookHandler(req: Request, res: Response, next: NextFunction) {
    try {
        sendSuccess(res, await getBookById(Number(req.params.id)));
    } catch (error) {
        next(error);
    }
}


export async function searchBooksHandler(req: Request, res: Response, next: NextFunction) {
    try {     
        const query = req.query.q as string;
        sendSuccess(res, await searchBooks(query));
    } catch (error) {
        next(error);
    } 
}