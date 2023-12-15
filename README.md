# Library Management System

This is a library management system that allows users to borrow books from the library and return them. It also allows the admin to add books to the library and remove them.

## Table of Contents

1. [Preqrequisites](#preqrequisites)
2. [Installation](#installation)
3. [Usage](#usage)
4. [API Documentation](#api-documentation)

## Preqrequisites

You need to have the following installed on your machine:

- [Node.js](https://nodejs.org/en/)
- [PostgreSQL](https://www.postgresql.org/)

## Installation

1. Clone the repo
   ```sh
   git clone https://github.com/FaroukAmr/Library-Management-System.git
   ```
2. Install and run server & create database
   ```sh
   cd server
   ```
   ```sh
   npm install
   ```
   **Before the next steps go to .env@example and rename it to .env and fill it with your database credentials**
   ```sh
   npm run create-seed-db
   ```
   ```sh
   npm run dev
   ```
3. Install and run client
   ```sh
    cd client
   ```
   ```sh
   npm install
   ```
   ```sh
   npm run dev
   ```

## Usage

1. Open the browser and go to http://localhost:3000/
2. Sign up
3. Login

## API Documentation

[Swagger](https://app.swaggerhub.com/apis/FAROUKAMR508/Library/1.0.0#/)

## Database Diagram

[drawsql.app](https://drawsql.app/teams/farouks-team/diagrams/library)
