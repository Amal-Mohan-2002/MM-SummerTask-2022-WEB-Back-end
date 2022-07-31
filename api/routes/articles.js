// Importing necessary packages
const express = require("express");
const router = express.Router()
const mongoose = require('mongoose');

// Importing models
const Article = require('../models/article')

// List articles
router.get('/all',(req, res, next)=>{
    Article.find()
        .select('-__v')
        .exec()
        .then(docs=>{
            const response = {
                count: docs.length,
                articles: docs.map(doc =>{
                    return {
                        title: doc.title,
                        _id: doc._id,
                        location: doc.location,
                        created_at: doc.created_at,
                        description: doc.description,
                        views: doc.views,
                        likes: doc.likes,
                        request: {
                            type:'GET',
                            url: 'http://localhost:5000/api/article/'+doc._id
                        }
                    }
                })
            }
            res.status(200).json(response)
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({error: err})
        })
} )

// Trending articles
router.get('/trending',(req, res, next)=>{
    Article.find().sort({ views: -1 })
        .select('-__v')
        .exec()
        .then(docs=>{
            const response = {
                count: docs.length,
                articles: docs.map(doc =>{
                    return {
                        title: doc.title,
                        _id: doc._id,
                        location: doc.location,
                        created_at: doc.created_at,
                        description: doc.description,
                        views: doc.views,
                        likes: doc.likes,
                        request: {
                            type:'GET',
                            url: 'http://localhost:5000/api/article/'+doc._id
                        }
                    }
                })
            }
            res.status(200).json(response)
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({error: err})
        })
} )

// Read article
router.get('/:articleId',(req,res,next)=>{
    const id =req.params.articleId
    Article.findOneAndUpdate({_id :id}, {$inc : {'views' : 1}})
        .select('-__v')
        .exec()
        .then(doc=>{
            console.log('From Database',doc);
            if (doc){
                res.status(200).json({
                    Article: doc,
                    request: {
                        type:'GET',
                        Description: "Get the list of all the articles",
                        url: 'http://localhost:5000/api/article/all'
                    }
                })
            }else{
                res.status(404).json({message: 'No value found for the provided ID'})
            }
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({error: err})
        })
})

// Create article
router.post('/',(req, res, next)=>{
    const article = new Article({
        _id : new mongoose.Types.ObjectId(),
        title: req.body.title,
        location: req.body.location,
        description: req.body.description,
        photo: req.body.photo


    })
    article
        .save()
        .then(result=>{
            console.log(result);
            res.status(201).json(
                {
                    message: 'Article created successfully!',
                    createdArticle: {
                        title: result.title,
                        _id: result._id,
                        location: result.location,
                        created_at: result.created_at,
                        description: result.description,
                        views: result.views,
                        likes: result.likes,
                        request: {
                            type:'GET',
                            url: 'http://localhost:5000/api/article/'+result._id
                        }
                    }
                }
            )
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({error: err})
        })
    
} )

// Update article
router.put('/:articleId',(req,res,next)=>{
    const id = req.params.articleId
   const updateOps={}
   for (const ops of req.body){
       updateOps[ops.propName]= ops.value
   }
   Article.updateOne({_id: id}, {$set: updateOps})
    .exec()
    .then(result=>{
        res.status(201).json({
            message: 'Article updated successfully!',
            request: {
                type:'GET',
                Description: "View the updated article",
                url: 'http://localhost:5000/api/article/'+id
            }

        })
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error: err})
    })
})

// Delete article
router.delete('/:articleId',(req,res,next)=>{
    const id =req.params.articleId
    Article.remove({_id: id})
        .exec()
        .then(result=>{
            res.status(201).json({
                message: "Article deleted successfully!",
                request: {
                        type:'GET',
                        Description: "Get the list of all the articles",
                        url: 'http://localhost:5000/api/article/all'
                    }

            })
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({error: err})
        })

})

// Like Article
router.post('/:articleId/like',(req,res,next)=>{
    const id =req.params.articleId
    Article.updateOne({_id :id}, {$inc : {'likes' : 1}})
        .exec()
        .then(doc=>{
            console.log('From Database',doc);
            if (doc){
                res.status(200).json({message: "Liked!",
                request: {
                    type:'GET',
                    Description: "View the liked article",
                    url: 'http://localhost:5000/api/article/'+id
                }
            })
            }else{
                res.status(404).json({message: 'No value found for the provided ID'})
            }
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({error: err})
        })
})

// Unlike article
router.delete('/:articleId/unlike',(req,res,next)=>{
    const id =req.params.articleId
    Article.updateOne({_id :id}, {$inc : {'likes' : -1}})
        .exec()
        .then(doc=>{
            console.log('From Database',doc);
            if (doc){
                res.status(200).json({message: "Unliked!",
                request: {
                    type:'GET',
                    Description: "View the unliked article",
                    url: 'http://localhost:5000/api/article/'+id
                }
            })
            }else{
                res.status(404).json({message: 'No value found for the provided ID'})
            }
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({error: err})
        })
})



module.exports = router;