import type { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../utils/sendSuccess.ts";
import { addReview, getReviews, removeReview } from "./reviews.service.ts";

export async function getReviewsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    sendSuccess(res, await getReviews(req.params.id));
  } catch (error) {
    next(error);
  }
}

export async function createReviewHandler(req: Request, res: Response, next: NextFunction) {
  try {
    sendSuccess(res, await addReview(req.params.id, req.body), 201);
  } catch (error) {
    next(error);
  }
}

export async function deleteReviewHandler(req: Request, res: Response, next: NextFunction) {
  try {
    await removeReview(req.params.id, req.params.reviewId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
