import { Book } from './Book';

export interface BorrowedBook extends Book {
  borrowed_date: Date;
  expected_return_date: Date;
}
