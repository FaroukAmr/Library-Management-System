CREATE TABLE IF NOT EXISTS books(
    isbn VARCHAR(13) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    shelf VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS users(
    username VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    registered TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS borrowed_books(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) REFERENCES users(username),
    isbn VARCHAR(13) REFERENCES books(isbn),
    borrowed_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expected_return_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP + INTERVAL '30 days',
    returned BOOLEAN DEFAULT FALSE,
    actual_return_date TIMESTAMP DEFAULT NULL
);

CREATE INDEX idx_borrowed_books_returned ON borrowed_books (returned);
CREATE INDEX idx_borrowed_books_returned_username ON borrowed_books (returned, username);