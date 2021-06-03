const express = require('express')
const router = express.Router()
const Book = require('../models/book')

router.get('/', async (req,res) => {
  let books
  try {
    books = await Book.find({}).sort({ 'createdAt': 'desc' }).exec()
    // book = await Book.find()
    res.render('index', { books: books })
  } catch (err) {
    console.error(err)
  }
})

module.exports = router