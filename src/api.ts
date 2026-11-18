
import type { Book } from './task1-types';

// Адрес нашего ресурса на MockAPI
const API_URL = 'https://6afd8d552a9c141d36b8aa54.mockapi.io/api/books';

// DTO — формат книги, который возвращает сервер
interface BookDTO {
  id: string;
  title: string;
  author: string;
  year: number;
  rating: number;
}

// Преобразование данных сервера в модель приложения
function mapFromServer(dto: BookDTO): Book {
  return {
    id: dto.id,
    title: dto.title,
    authors: [dto.author],
    year: dto.year,
    rating: dto.rating,
  };
}

// Преобразование модели приложения в формат сервера
function mapToServer(book: Book): BookDTO {
  return {
    id: book.id,
    title: book.title,
    author: book.authors[0] ?? '',
    year: book.year ?? 0,
    rating: book.rating ?? 0,
  };
}

// GET — получаем список книг с сервера
export async function fetchBooks(): Promise<Book[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const dtos: BookDTO[] = await response.json();

  return dtos.map(mapFromServer);
}

// POST — создаём одну книгу на сервере
export async function saveBook(book: Book): Promise<Book> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mapToServer(book)),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const dto: BookDTO = await response.json();
  return mapFromServer(dto);
}

// DELETE — удаляем книгу по её идентификатору
export async function deleteBook(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
}
