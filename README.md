# BookNote Application

BookNote is a web-based book review application where users can add, view, and search book reviews. Users can submit reviews with a rating as well. This project uses Express.js, PostgreSQL, and EJS.

## Features

- Search for book reviews by title or ISBN
- Add new book reviews
- Edit existing reviews
- Delete reviews
- Book cover images dynamically fetched from OpenLibrary API

## Installation

To get started with this project, follow these steps:

### Prerequisites

- Node.js (>= 14.x)
- PostgreSQL (>= 13.x)

### Setup

1. **Clone the repository**:

   git clone https://github.com/EvelynDorina/CapstoneProject-BookNote.git

2. **Download Dependecies**:

   npm install

3. **Set up the PostgreSQL database**:

   Don't forget create a database before you create and setup table.

   CREATE TABLE book_reviews (

   id SERIAL PRIMARY KEY,

   title VARCHAR(255) NOT NULL,

   isbn VARCHAR(13) NOT NULL,

   author VARCHAR(255),

   reviews TEXT,

   recommend INTEGER,

   book_image VARCHAR(255)

   );

4. **Update the environment variables**:

   DB_USER=your_postgre_user

   DB_PASSWORD=your_postgre_password

   DB_HOST=localhost

   DB_PORT=5432

   DB_NAME=BookNote or Name you want to use

   change enviroment variables in index.js

5. **Run the Server**:

   npm install

   This will start the server on http://localhost:3000

   ## Usage

   - Visit `http://localhost:3000` in your browser.
   - Search for books by title or ISBN.
   - Add a review by filling out the "Add Review" form.
   - View the details of a review by clicking the "for detail" button.

   To update or delete a review, click on a specific review's detail page

   ## Dependencies

   - Express.js
   - EJS
   - PostgreSQL
   - Axios
   - Body-parser
