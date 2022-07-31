const mongoose = require('mongoose')

const articleSchema= mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    title: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },

    created_at    : {
            type: Date, 
            required: true, 
            default: Date.now 
        },
    description : {
        type: String,
        required: true
    },
    views : {
        type: Number,
        default: 0

    }, 
    likes : {
        type: Number,
        default: 0
    },
    photo : {
        type: String,
        required: true
    }

})

module.exports = mongoose.model("Article", articleSchema)