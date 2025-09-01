const express = require('express')
const router= express.Router()
const ExpressError = require('../utils/ExpressError.js')
const {wrapAsync} = require('../utils/wrapAsync.js')
const {validateListingSchema,validateReviewSchema} = require('../models/validateSchema.js')
const Listing=  require("../models/listing.js");
const {isLoggedIn,isOwner}= require('../middleware.js')



const validateListing= function(req,res,next){
    
    const {error,value} = validateListingSchema.validate(req.body,{ abortEarly: false })
    
    if(error){
        const errmsg= error.details.map(e=>e.message).join(', ')
        throw new ExpressError(400,errmsg)
    }
    else{
      next();
    }
}



// to show all the listings
router.get('/',wrapAsync(async(req,res)=>{
   const allListing = await Listing.find(); // return the array of all the documents
   res.render('./listings/index.ejs',{allListing})
}))


// to fetch form for creating new listing
router.get('/new',isLoggedIn,(req,res)=>{
    res.render('./listings/new.ejs');
})


// to show particular listing 
router.get('/:id',wrapAsync(async (req,res)=>{
   let listing= await Listing.findById(req.params.id).populate({path:"reviews",populate:{path:"author"}}).populate("owner")
   console.log(listing.reviews)
   if(!listing){
    req.flash("error","Listing you requested does not exists!");
    res.redirect('/listings')
   }
   else res.render('./listings/show.ejs',{listing})
}))


// for creating new listing
router.post('/',validateListing,isLoggedIn,wrapAsync(async (req,res)=>{
    const newListing= new Listing(req.body.listing);
    newListing.owner=req.user._id;
    await newListing.save();
    // console.log("new listing created")
    //flash message - new listing created 
    req.flash("success","New Listing Created!");
    res.redirect('/listings')
}))

// for editing existing listing it will show form where field are filled with prev. values
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
    let listing=await Listing.findById(req.params.id)
    if(!listing){
        req.flash("failure","Listing you requested does not exists!")
        res.redirect('/listings')
    }
    res.render('./listings/edit.ejs',{listing})
}))


// sending edited listing to DB
router.put('/:id',isLoggedIn,isOwner,validateListing,wrapAsync(async (req,res)=>{

    let {id}= req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing})
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`)
}))

// remove listing using id 
router.delete('/:id',isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect('/listings')
 }))


module.exports= router;