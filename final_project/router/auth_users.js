const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return username.length >= 5;
};

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }
  if (authenticatedUser(username, password)) {
    jwt.sign(
      {
        username,
      },
      "agjhgafbakcbvnbajkbvkjasbvjaksb",
      {
        expiresIn: "1h",
      },
      (err, token) => {
        if (err) throw err;
        res
          .status(200)
          .cookie("token", token, { sameSite: "none", secure: true })
          .json({
            message: "Login successful",
            user: {
              username,
            },
          });
      }
    );
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const reviewData = req.body;

  // Check if the book with the provided ISBN exists
  if (!books[isbn]) {
    return res
      .status(404)
      .json({ message: "Book not found for ISBN: " + isbn });
  }

  // Update the book's reviews with the new review data
  books[isbn].reviews.push(reviewData);

  // Respond with a success message
  return res.status(200).json({ message: "Review added successfully." });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.body.username;

  if (!books[isbn]) {
    return res
      .status(404)
      .json({ message: "Book not found for ISBN: " + isbn });
  }
  const reviewIndex = books[isbn].reviews.findIndex(
    (review) => review.username === username
  );

  if (reviewIndex === -1) {
    return res
      .status(404)
      .json({ message: "Review not found for username: " + username });
  }

  books[isbn].reviews.splice(reviewIndex, 1);

  return res.status(200).json({ message: "Review deleted successfully." });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.authenticatedUser = authenticatedUser;
