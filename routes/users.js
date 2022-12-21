const express = require('express')
const router = express.Router()
const bcryptjs = require('bcryptjs')
const User = require('../models/User');

//update user
router.put('/:id', async (req,res) => {
    if (req.body.userId === req.params.id ) {
        if(req.body.password) {
            try {
                const salt = await bcryptjs.genSalt(10)
                req.body.password = await bcryptjs.hash(req.body.password, salt)
            } catch (error) {
               return res.status(500).json(error)
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set:req.body,
            })
            res.status(200).json("Account has been updated")
        } catch (error) {
             return res.status(500).json(error)
        }
    } else {
        res.status(403).json("You can update only your account")
    }
})
//delete user
router.delete('/:id', async (req,res) => {
    if (req.body.userId === req.params.id ) {
        
        try {
            await User.findByIdAndDelete(req.params.id)
            res.status(200).json("Account has been deleted successfully")
        } catch (error) {
             return res.status(500).json(error)
        }
    } else {
        res.status(403).json("You can delete only your account")
    }
})

//get user
router.get('/:id', async (req,res) => {
        
    try {
        const user = await User.findById(req.params.id)
        const {password ,updatedAt,...others} = user.__doc
        res.status(200).json(user.__doc)
    } catch (error) {
         return res.status(500).json(error)
    }
    
})

//follow a user
router.put('/:id/follow', async (req,res) => {
        
   if (req.body.userId !== req.params.id ) {
        
        try {
             const user = await User.findById(req.params.id)
             const currentUser = await User.findById(req.body.userId)
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({ $push: { followers: req.body.userId } })
                await currentUser.updateOne({ $push: { following: req.body.userId } })
                res.status(200).json("User has been followed")

            } else {
                res.status(403).json("you already follow this user")
            }
               
        } catch (error) {
             return res.status(500).json(error)
        }
    } else {
        res.status(403).json("You cannot follow yourself")
    }
})

//unfollow a user
router.put('/:id/unfollow', async (req,res) => {
        
   if (req.body.userId !== req.params.id ) {
        
        try {
             const user = await User.findById(req.params.id)
             const currentUser = await User.findById(req.body.userId)
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userId } })
                await currentUser.updateOne({ $pull: { following: req.body.userId } })
                res.status(200).json("User has been unfollowed")

            } else {
                res.status(403).json("you are not following this user")
            }
               
        } catch (error) {
             return res.status(500).json(error)
        }
    } else {
        res.status(403).json("You cannot follow yourself")
    }
})


module.exports = router