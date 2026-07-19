const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  const userExists = users.some(u => u.username === username);
  if (userExists) {
    return res.status(409).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Task 10: Get all books using Promise callback
public_users.get('/', function (req, res) {
  new Promise((resolve, reject) => {
    resolve(books);
  })
  .then((allBooks) => {
    return res.status(200).send(JSON.stringify(allBooks, null, 4));
  })
  .catch((err) => {
    return res.status(500).json({ message: "Error fetching books" });
  });
});

// Task 11: Get book by ISBN using async/await with Axios
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get('http://localhost:5000/');
    const book = response.data[isbn];
    if (book) {
      return res.status(200).json(book);
    }
    return res.status(404).json({ message: "Book not found" });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book by ISBN" });
  }
});

// Task 12: Get books by Author using async/await with Axios
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const response = await axios.get('http://localhost:5000/');
    const allBooks = response.data;
    const filtered = {};
    Object.keys(allBooks).forEach(isbn => {
      if (allBooks[isbn].author === author) {
        filtered[isbn] = allBooks[isbn];
      }
    });
    return res.status(200).json(filtered);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by author" });
  }
});

// Task 13: Get books by Title using async/await with Axios
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const response = await axios.get('http://localhost:5000/');
    const allBooks = response.data;
    const filtered = {};
    Object.keys(allBooks).forEach(isbn => {
      if (allBooks[isbn].title === title) {
        filtered[isbn] = allBooks[isbn];
      }
    });
    return res.status(200).json(filtered);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by title" });
  }
});

// Get book review by ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }
  return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;
