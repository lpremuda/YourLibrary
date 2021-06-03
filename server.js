if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const portNum = 3000

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout_Lucas')
app.use(expressLayouts)
app.use(methodOverride('_method'))
// app.use(bodyParser.text())
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))
app.use(express.static('public'))

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const db = mongoose.connection
db.on('error', error => {
    console.error(error)
})
db.once('connect', () => {
    console.log('Connected to MongoDB database')
})

indexRouter = require('./routes/index')
authorRouter = require('./routes/authors')
bookRouter = require('./routes/books')

app.use('/', indexRouter)
app.use('/authors', authorRouter)
app.use('/books', bookRouter)

app.listen(portNum, () => {
    console.log(`Opened connection for Express app on port ${portNum}`)
})

