import type { NextFunction, Request, Response } from "express";

export class ReviewInputError extends Error {}
export class ReviewBookNotFoundError extends Error {}
export class ReviewNotFoundError extends Error {}

export function handleReviewErrors(
  error: Error,
  _req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof ReviewInputError) {
    return res.status(400).json({ success: false, error: error.message });
  }
  if (error instanceof ReviewBookNotFoundError || error instanceof ReviewNotFoundError) {
    return res.status(404).json({ success: false, error: error.message });
  }
  return next(error);
}
