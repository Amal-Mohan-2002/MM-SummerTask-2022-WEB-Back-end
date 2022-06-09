const mongoose = require('mongoose')

const articleSchema= mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    title: String,
    location: String,
    created_at    : {
            type: Date, 
            required: true, 
            default: Date.now 
        },
    description : String,
    views : {
        type: Number,
        default: 0

    }, 
    likes : {
        type: Number,
        default: 0
    }

})

module.exports = mongoose.model("Article", articleSchema)