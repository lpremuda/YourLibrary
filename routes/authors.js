const express = require('express')
const router = express.Router()
const Author = require('../models/author')
const Book = require('../models/book')
const typeis = require('type-is')

// Get All Authors
router.get('/', async (req, res) => {
    // res.send('All Authors')
    let searchOptions = {}
    try {
        if (req.query.name != null && req.query.name != '') {
            searchOptions.name = new RegExp(req.query.name, 'i') // 'i' means case-insensitive
        }
        const authors = await Author.find(searchOptions)
        res.render('author/index', { authors: authors, searchName: req.query.name })
    } catch (err) {
        console.error(err)
    }
})

// New Author
router.get('/new', (req, res) => {
    res.render('author/new', { author: new Author() })
})

// Get Author
router.get('/:id', async (req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id)
        const books = await Book.find({ author: author.id }).limit(6).exec()
        res.render('author/show', { author: author, books: books })
    } catch (err) {
        console.error(err)
    }
})

// Edit Author
router.get('/:id/edit', async (req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id)
        res.render('author/edit', { author: author })
    } catch (err) {
        console.error(err)
    }
})

// Post Author
router.post('/', async (req, res) => {
    try {
        const author = new Author({
            name: req.body.name
        })
        const newAuthor = await author.save()
        res.redirect(`/authors/${newAuthor.id}`)
    } catch (err) {
        console.log('Error in /authors POST routine')
        console.error(err)
    }
})

// Update Author
router.put('/:id', async (req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id)
        if (req.body.name) {
            author.name = req.body.name
            await author.save()
            res.redirect(`/authors/${author.id}`)
        }
    } catch (err) {
        console.error(err)
        if (author == null) {
            res.redirect('/') 
        } else {
            res.render('author/new', {
                author: author,
                errorMessage: 'Error updating author'
            })
        }
    }
})

// Delete Author
router.delete('/:id', async (req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id)
        await author.remove()
        res.redirect('/authors')
    } catch (err) {
        console.error(err)
    }
})

module.exports = router