import { DatabaseError } from "pg";
import { getPostgresPool } from "../utils/pool.postgres.ts";
import type { Book, NewBook } from "./books.service.ts";
import { BookAlreadyExistsError } from "./books.errors.ts";

const pool = getPostgresPool();

const bookColumns = `b.id, b.title, b.author, b.release_date,
  AVG(r.rating)::numeric AS average_rating`;
const bookJoins = `FROM books b LEFT JOIN reviews r ON r.book_id = b.id`;

export async function getAllBooks(): Promise<Book[]> {
  console.log("getAllBooks_repo")
  const result = await pool.query(
    `SELECT ${bookColumns} ${bookJoins} GROUP BY b.id ORDER BY b.id`
  );
  return result.rows.map(withAverageRating);
}

export async function getBookById(id: number): Promise<Book | null> {
  const result = await pool.query(
    `SELECT ${bookColumns} ${bookJoins} WHERE b.id = $1 GROUP BY b.id`,
    [id]
  );
  return result.rows[0] ? withAverageRating(result.rows[0]) : null;
}

export async function searchBook(query: string): Promise<Book[]> {
  const result = await pool.query(
    `SELECT ${bookColumns} ${bookJoins}
     WHERE b.title ILIKE $1 OR b.author ILIKE $1
     GROUP BY b.id ORDER BY b.id`,
    [`%${query}%`]
  );
  return result.rows.map(withAverageRating);
}

export async function createBook(book: NewBook): Promise<Book> {
  try {
    const result = await pool.query(
      `INSERT INTO books (title, author, release_date)
       VALUES ($1, $2, $3) RETURNING id, title, author, release_date`,
      [book.title, book.author, book.release_date]
    );
    return { ...result.rows[0], average_rating: null };
  } catch (error) {
    if (
      error instanceof DatabaseError &&
      error.code === "23505" &&
      error.constraint === "books_title_author_unique"
    ) {
      throw new BookAlreadyExistsError(book.title, book.author);
    }
    throw error;
  }
}

function withAverageRating(row: Record<string, unknown>): Book {
  return {
    ...row,
    average_rating: row.average_rating === null ? null : Number(row.average_rating),
  } as Book;
}
