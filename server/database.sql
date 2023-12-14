CREATE DATABASE library;

CREATE TABLE books(
    ISBN VARCHAR(13) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    shelf VARCHAR(255) NOT NULL
);

CREATE TABLE users(
    username VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    registered TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE borrowed_books(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) REFERENCES users(username),
    ISBN VARCHAR(17) REFERENCES books(ISBN),
    borrowed_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    return_date TIMESTAMP NOT NULL
);