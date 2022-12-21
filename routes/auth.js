const express = require('express')
const router = express.Router()
const User = require('../models/User');
const bcryptjs = require('bcryptjs')

//Register
router.post('/register',async (req,res) => {
    
    try {
        //generate a new password
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(req.body.password, salt)

        //create new user 
        const newUser = new User({
           username: req.body.username,
           email: req.body.email,
           password: hashedPassword,
        });

        //save user and retun response
        const user = await newUser.save()
        res.status(200).json(user)
        
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }

})

//Login
router.post('/login', async (req, res) => {

    try {
        
        //fetch user from database
        const user = await User.findOne({email:req.body.email})
        !user &&  res.status(404).json('User not found')
        
        //compare password stored in database
        const validPassword = await bcryptjs.compare(req.body.password, user.password)
        !validPassword && res.status(404).json('wrong password')

        res.status(200).json(user)
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
})


module.exports = router