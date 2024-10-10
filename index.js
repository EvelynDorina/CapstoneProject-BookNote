import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";

const port = 3000;
const app = express();

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "BookNote",
  password: "password",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

let Notes = [
  {
    id: 1,
    title: "To Kill A mocking bird",
    bookImage: "https://covers.openlibrary.org/b/isbn/0385472579-S.jpg",
    isbn: "1122445666",
    recommend: 5,
    reviews: "why i like this",
    author: "Harper lee",
  },
  {
    id: 2,
    title: "Little Prince",
    isbn: "112249999666",
    bookImage: "https://covers.openlibrary.org/b/isbn/0385472579-S.jpg",
    recommend: 5,
    reviews: "why i like this",
    author: "Antonio",
  },
];

app.get("/", async (req, res) => {
  try {
    // get all data from database
    const result = await db.query("SELECT * FROM book_reviews");
    const notes = result.rows;

    res.render("index", { notes });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).send("An error occurred while loading reviews.");
  }
});
app.get("/add-review", (req, res) => {
  res.render("add", { bookData: null });
});
app.post("/book-info", async (req, res) => {
  const { isbn } = req.body;
  try {
    const response = await axios.get(
      `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`
    );

    const bookData = response.data[`ISBN:${isbn}`];
    res.render("add", { bookData });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching book data.");
  }
});
app.get("/reviews/:id", async (req, res) => {
  const reviewsId = req.params.id;
  try {
    // SQL search from id
    const result = await db.query("SELECT * FROM book_reviews WHERE id = $1", [
      reviewsId,
    ]);
    const review = result.rows[0];

    if (review) {
      res.render("details", { review });
    } else {
      res.status(404).send("Review not found");
    }
  } catch (error) {
    console.error("Error fetching review:", error);
    res.status(500).send("An error occurred while fetching the review.");
  }
});
app.post("/submit-review", async (req, res) => {
  const { title, author, reviews, isbn, recommend } = req.body;

  // url dinamic for cover
  // you can change cover size like change -S become M Medium or L Large
  const bookImage = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;

  // SQL Query Add data
  const query = `
    INSERT INTO book_reviews (title, isbn, author, reviews, recommend, book_image)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id;
  `;

  const values = [title, isbn, author, reviews, recommend, bookImage];

  try {
    //insert data to database
    const result = await db.query(query, values);
    const insertedId = result.rows[0].id;
    console.log("New review inserted with ID:", insertedId);

    // redirect
    res.redirect("/");
  } catch (error) {
    console.error("Error inserting review:", error);
    res.status(500).send("An error occurred while submitting your review.");
  }
});
app.post("delete/:id", async (req, res) => {
  const deletedId = req.params.id;
  try {
    const result = await db.query("DELETE  FROM book_reviews WHERE id = $1", [
      deletedId,
    ]);
    console.log(`Review with ID ${deletedId} has been deleted.`);

    res.redirect("/");
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).send("An error occurred while deleting the review.");
  }
});
app.get("/update/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const response = await db.query(
      "SELECT * FROM book_reviews WHERE id = $1",
      [id]
    );
    const review = response.rows[0];
    if (review) {
      res.render("update", { review });
    } else {
      res.status(404).send("Review not found");
    }
  } catch (error) {
    console.error("Error found review:", error);
    // res.redirect("/");
  }
});
app.post("/update/:id", async (req, res) => {
  const updatedId = req.params.id;
  const { reviews } = req.body;

  try {
    const result = await db.query(
      "UPDATE book_reviews SET reviews = $1 WHERE id = $2",
      [reviews, updatedId]
    );

    if (result.rowCount > 0) {
      console.log("Review updated successfully");
      res.redirect(`/reviews/${updatedId}`);
    } else {
      console.log("Review not found");
      res.status(404).send("Review not found");
    }
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).send("An error occurred while updating the review.");
  }
});
app.post("/search", async (req, res) => {
  const search = req.body.search; // get keyword
  try {
    const searchQuery = `
      SELECT * FROM book_reviews 
      WHERE title ILIKE $1 OR isbn ILIKE $1
    `;

    const values = [`%${search}%`];

    const result = await db.query(searchQuery, values);
    const searchResults = result.rows;

    if (searchResults.length > 0) {
      res.render("search-results", { searchResults });
    } else {
      res.render("search-results", { searchResults: [] }); // when not found show blank
    }
  } catch (error) {
    console.error("Error during search:", error);
    res.status(500).send("An error occurred during the search.");
  }
});
app.listen(port, () => {
  console.log(`server is running on port ${port}.`);
});
