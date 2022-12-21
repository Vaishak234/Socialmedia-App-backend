const express = require('express')
const router = express.Router()
const Post = require('../models/Post');

//create a post 
router.post('/', async(req, res) => {
    const newpost = new Post(req.body)

    try {
        const savedPost = await newpost.save()
        res.status(200).json(savedPost)
        
    } catch (error) {
         return res.status(500).json(error)
    }
})

//update a post
router.put('/:id', async (req, res) => {
     try {
         const post = await  Post.findById(req.params.id)
         
        if (post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body })
            res.status(200).json('post has been updated')
        } else {
            res.status(403).json('you can update only your posts')
         }
         
    } catch (error) {
         return res.status(500).json(error)
    }
})

//delete a post
router.delete('/:id', async (req, res) => {
     try {
        const post = await  Post.findById(req.params.id)

        if (post.userId === req.body.userId) {
            await post.deleteOne()
            res.status(200).json('post has been deleted')
        } else {
            res.status(403).json('you can delete only your posts')
         }
         
    } catch (error) {
         return res.status(500).json(error)
    }
})

//like a post
router.put('/:id/like', async (req, res) => {
     try {
        const post = await Post.findById(req.params.id)
        if (post.likes.includes(req.body.userId)) {
            await post.updateOne({$pull:{likes:req.body.userId}})
            res.status(200).json('post has been disliked')
        } else {
            await post.updateOne({$push:{likes:req.body.userId}})
            res.status(200).json('post has been liked')
         }
         
    } catch (error) {
         return res.status(500).json(error)
    }
})

//get a post
router.get('/:id', async (req, res) => {
     try {
        const post = await  Post.findById(req.params.id)
        res.status(200).json(post)
         
    } catch (error) {
         return res.status(500).json(error)
    }
})

//get timeline posts
router.get('/timeline/all', async (req, res) => {
    let postArray = [];
     try {
         const currentUser = await User.findById(req.body.userId)
         const userPosts = await Post.find({ userId: currentUser._id })
         const friendPosts = await Promise.all(
             currentUser.followings.map(friendId => {
                 return Post.find({userId:friendId})
             })
         )
         res.json(userPosts.concat(...friendPosts))

    } catch (error) {
         return res.status(500).json(error)
    }
})


module.exports = router
