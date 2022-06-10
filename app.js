const express = require("express");
const app= express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

// Connecting to the database (MongoDB Alas)
mongoose.connect('mongodb+srv://amal:mymongo123321@restapi.pu730yx.mongodb.net/?retryWrites=true&w=majority',{useNewUrlParser: true})
mongoose.Promise = global.Promise


const articlesRoutes = require('./api/routes/articles')


// Middleware init
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// Handling CORS errors
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin", "*")
    res.header(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With, Content-Type, Accept, Authorization"
    )
    if (req.method === 'OPTIONS'){
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({})
    }
    next()
})

// Routes that handle requests
app.use('/api/article', articlesRoutes)

// Error
app.use((req,res,next)=>{
    const error = new Error('Not found')
    error.status= 404
    next(error)
})

app.use((error,req,res,next)=>{
    res.status(error.status || 500 )
    res.json({
        error: {
            message: error.message
        }
    })

})


module.exports= app