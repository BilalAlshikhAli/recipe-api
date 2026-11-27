import { ReviewBookNotFoundError, ReviewInputError, ReviewNotFoundError } from "./reviews.errors.ts";
import {
  bookExists,
  createReview as createReviewRepo,
  deleteReview as deleteReviewRepo,
  getReviewsByBookId,
  type NewReview,
  type Review,
} from "./reviews.repo.ts";

export async function getReviews(bookIdValue: unknown): Promise<Review[]> {
  const bookId = parseId(bookIdValue, "book id");
  await requireBook(bookId);
  return getReviewsByBookId(bookId);
}

export async function addReview(bookIdValue: unknown, data: unknown): Promise<Review> {
  const bookId = parseId(bookIdValue, "book id");
  const review = validateReview(data);
  await requireBook(bookId);
  return createReviewRepo(bookId, review);
}

export async function removeReview(bookIdValue: unknown, reviewIdValue: unknown): Promise<void> {
  const bookId = parseId(bookIdValue, "book id");
  const reviewId = parseId(reviewIdValue, "review id");
  await requireBook(bookId);
  if (!(await deleteReviewRepo(bookId, reviewId))) {
    throw new ReviewNotFoundError(`Review ${reviewId} was not found for book ${bookId}.`);
  }
}

async function requireBook(bookId: number): Promise<void> {
  if (!(await bookExists(bookId))) {
    throw new ReviewBookNotFoundError(`Book ${bookId} was not found.`);
  }
}

function parseId(value: unknown, name: string): number {
  const id = typeof value === "string" && /^\d+$/.test(value) ? Number(value) : NaN;
  if (!Number.isSafeInteger(id) || id < 1) {
    throw new ReviewInputError(`The ${name} must be a positive integer.`);
  }
  return id;
}

function validateReview(data: unknown): NewReview {
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    throw new ReviewInputError("The request body must be a JSON object.");
  }
  const input = data as Record<string, unknown>;
  if (typeof input.author !== "string" || !input.author.trim()) {
    throw new ReviewInputError("author must be a non-empty string.");
  }
  if (!Number.isInteger(input.rating) || (input.rating as number) < 1 || (input.rating as number) > 5) {
    throw new ReviewInputError("rating must be an integer between 1 and 5.");
  }
  if (typeof input.comment !== "string" || !input.comment.trim()) {
    throw new ReviewInputError("comment must be a non-empty string.");
  }
  return {
    author: input.author.trim(),
    rating: input.rating as number,
    comment: input.comment.trim(),
  };
}
