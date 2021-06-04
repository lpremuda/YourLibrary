const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Author'
    },
    publishDate: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    pageCount: {
        type: Number,
        min: [1, 'Page count must be > 0 pages'],
        required: true
    },
    coverImage: {
        type: Buffer,
        required: true
    },
    coverImageType: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
})

bookSchema.virtual('coverImageDataURL').get(function() {
    if (this.coverImage != null && this.coverImageType != null) {
      coverImageBase64 = this.coverImage.toString('base64')
      return `data:${this.coverImageType};charset=utf-8;base64,${coverImageBase64}`
    }
})


module.exports = mongoose.model('Book', bookSchema)