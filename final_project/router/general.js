const axios = require('axios');
const express = require('express');
const general = express.Router();

// Function to fetch book data from the server using Axios with async-await
const fetchBooksData = async () => {
    try {
        const response = await axios.get('http://localhost:5000/customer');
        return response.data;
    } catch (error) {
        throw new Error('Error fetching book data');
    }
};

// Function to fetch book details based on ISBN using Axios with async-await
const fetchBookByISBN = async (isbn) => {
    try {
        const response = await axios.get(`http://localhost:5000/customer/isbn/${isbn}`);
        return response.data;
    } catch (error) {
        throw new Error(`Error fetching book details for ISBN: ${isbn}`);
    }
};

// Function to fetch book details based on author using Axios with async-await
const fetchBooksByAuthor = async (author) => {
    try {
        const response = await axios.get(`http://localhost:5000/customer/author/${author}`);
        return response.data;
    } catch (error) {
        throw new Error(`Error fetching books for author: ${author}`);
    }
};

// Function to fetch book details based on title using Axios with async-await
const fetchBooksByTitle = async (title) => {
    try {
        const response = await axios.get(`http://localhost:5000/customer/title/${title}`);
        return response.data;
    } catch (error) {
        throw new Error(`Error fetching books for title: ${title}`);
    }
};

// Get the list of books available in the shop
general.get('/', async (req, res) => {
    try {
        const booksData = await fetchBooksData();
        res.status(200).json({ books: booksData });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get book details based on ISBN
general.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const bookDetails = await fetchBookByISBN(isbn);
        res.status(200).json({ book: bookDetails });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get book details based on author
general.get('/author/:author', async (req, res) => {
    const author = req.params.author;
    try {
        const booksByAuthor = await fetchBooksByAuthor(author);
        res.status(200).json({ booksByAuthor: booksByAuthor });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get book details based on title
general.get('/title/:title', async (req, res) => {
    const title = req.params.title;
    try {
        const booksByTitle = await fetchBooksByTitle(title);
        res.status(200).json({ booksByTitle: booksByTitle });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports.general = general;
