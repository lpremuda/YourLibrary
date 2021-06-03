const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const Author = require('../models/author')
const { query } = require('express')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

// Get All Books
router.get('/', async (req, res) => {
    // query1 = await Book.find({title: new RegExp('The','i')})
    // query1.forEach(q => { console.log(q.title) })
    // query2 = await Book.find({ title: { $regex: /The/i } })
    // query2.forEach(q => { console.log(q.title) })
    // query3 = Book.find()
    // query3.regex('title', /The/i)
    // books3 = await query3.exec()
    // books3.forEach(q => { console.log(q.title) })
    let query = Book.find()
    if (req.query.title != null && req.query.title != '') {
        query.regex('title', new RegExp(req.query.title,'i'))
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
        query.gte('publishDate', req.query.publishedAfter)
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
        query.lte('publishDate', req.query.publishedBefore)
    }
    
    const books = await query.exec()
    
    try {
        res.render('book/index', {
            books: books,
            searchOptions: req.query
         })
    } catch (err) {
        res.redirect('/')
        console.error(err)
    }
})

// Get New Book
router.get('/new', async (req, res) => {
    try {
        const book = new Book()
        const authors = await Author.find()
        res.render('book/new', { book: book, authors: authors })
    } catch (err) {
        res.redirect('/')
        console.error(err)
    }
})

// Get Book
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('author').exec()
        res.render('book/show', { book: book })
    } catch (err) {
        res.redirect('/')
        console.error(err)
    }
})

// Get Edit Book
router.get('/:id/edit', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('author').exec()
        const authors = await Author.find()
        res.render('book/edit', { authors: authors, book: book })
    } catch (err) {
        res.redirect('/')
        console.error(err)
    }
})

// Post Book
router.post('/', async (req, res) => {
    let book = new Book({
        title: req.body.title,
        author: req.body.author, // author's id
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        description: req.body.description
    })
    saveCover(book, req.body.cover)

    try {
        const newBook = await book.save()
        res.redirect(`books/${newBook.id}`)
    } catch (err) {
        res.redirect('/')
        console.error(err)
    }

})

// Update Book
router.put('/:id', async (req, res) => {
    let book 
    try {
        book = await Book.findById(req.params.id)
        book.title = req.body.title
        book.author = req.body.author // author's id
        book.publishDate = new Date(req.body.publishDate)
        book.pageCount = req.body.pageCount
        book.description = req.body.description
        if (!req.body.cover) {
            saveCover(book, req.body.cover)
        }

        const savedBook = await book.save()
        res.redirect(`/books/${savedBook.id}`)
    } catch (err) {
        console.error(err)
    }
})

// Delete Book
router.delete('/:id', async (req, res) => {
    let book
    try {    
        book = await Book.findById(req.params.id)
        await book.remove()
        res.redirect('/books')
    } catch (err) {
        console.error(err)
        if (book != null) {
            res.render('book/show', { book: book, errorMessage: 'Could not remove book' })
        }
    }

})

function saveCover(book, coverEncoded) {
    if (!coverEncoded) { return }
    let cover = JSON.parse(coverEncoded)
    if (imageMimeTypes.includes(cover.type)) {
        book.coverImage = new Buffer.from(cover.data,'base64')
        book.coverImageType = cover.type
    }
}

module.exports = router