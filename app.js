const express = require("express");
const app= express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const {MONGOCONURL} = require("./keys")
require('./api/models/user')



// Connecting to the database (MongoDB Alas)
mongoose.connect(MONGOCONURL,{useNewUrlParser: true})
mongoose.connection.on("connected", ()=>{
    console.log('MongoDB connection successful!')
})
mongoose.connection.on("error", (err)=>{
    console.log('MongoDB connection error!',err)
})

const articlesRoutes = require('./api/routes/articles')
const usersRoutes = require('./api/routes/auth')

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
app.use('/api/article', usersRoutes)

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