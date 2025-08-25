const express = require('express')
const router= express.Router()
const User= require('../models/user')
const { wrapAsync } = require('../utils/wrapAsync')
const passport = require('passport')

// for signup
router.get('/signup',async (req,res)=>{
    res.render('./users/signup')
})


router.post('/signup',wrapAsync(async(req,res)=>{
    try{
    const {username,email,password}= req.body
    let newUser= new User({email,username})
   let user= await User.register(newUser,password)
   req.flash("success","User has successfully Registered!")
   console.log(user)
   res.redirect('/listings')
    }
    catch(err)
    {
        req.flash("error",err.message)
        res.redirect('/signup')
    }
}))


// for login

router.get('/login',async (req,res)=>{
    res.render('./users/login')
})

router.post('/login',passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),async (req,res)=>{
    req.flash("success","Welcome to Wanderlust!")
    res.redirect("/listings")
})




module.exports= router