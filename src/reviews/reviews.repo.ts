import { getPostgresPool } from "../utils/pool.postgres.ts";

const pool = getPostgresPool();

export type Review = {
  id: number;
  book_id: number;
  author: string;
  rating: number;
  comment: string;
};

export type NewReview = Pick<Review, "author" | "rating" | "comment">;

export async function bookExists(bookId: number): Promise<boolean> {
  const result = await pool.query("SELECT 1 FROM books WHERE id = $1", [bookId]);
  return result.rows.length > 0;
}

export async function getReviewsByBookId(bookId: number): Promise<Review[]> {
  const result = await pool.query(
    "SELECT id, book_id, author, rating, comment FROM reviews WHERE book_id = $1 ORDER BY id",
    [bookId]
  );
  return result.rows;
}

export async function createReview(bookId: number, review: NewReview): Promise<Review> {
  const result = await pool.query(
    `INSERT INTO reviews (book_id, author, rating, comment)
     VALUES ($1, $2, $3, $4)
     RETURNING id, book_id, author, rating, comment`,
    [bookId, review.author, review.rating, review.comment]
  );
  return result.rows[0];
}

export async function deleteReview(bookId: number, reviewId: number): Promise<Review | null> {
  const result = await pool.query(
    `DELETE FROM reviews WHERE book_id = $1 AND id = $2
     RETURNING id, book_id, author, rating, comment`,
    [bookId, reviewId]
  );
  return result.rows[0] ?? null;
}
