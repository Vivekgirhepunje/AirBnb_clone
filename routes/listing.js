const express = require('express')
const router= express.Router()
const ExpressError = require('../utils/ExpressError.js')
const {wrapAsync} = require('../utils/wrapAsync.js')
const {validateListingSchema,validateReviewSchema} = require('../models/validateSchema.js')
const Listing=  require("../models/listing.js");







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
router.get('/new',(req,res)=>{
    res.render('./listings/new.ejs');
})


// to show particular listing 
router.get('/:id',wrapAsync(async (req,res)=>{
   let listing= await Listing.findById(req.params.id).populate('reviews')
   res.render('./listings/show.ejs',{listing})
}))


// for creating new listing
router.post('/',validateListing,wrapAsync(async (req,res)=>{
    const newListing= new Listing(req.body.listing);
    await newListing.save();
    // console.log("new listing created")
    res.redirect('/listings')
}))

// for editing existing listing it will show form where field are filled with prev. values
router.get("/:id/edit",wrapAsync(async (req,res)=>{
    let listing=await Listing.findById(req.params.id)
    res.render('./listings/edit.ejs',{listing})
}))


// sending edited listing to DB
router.put('/:id',validateListing,wrapAsync(async (req,res)=>{

    let {id}= req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing})
    res.redirect(`/listings/${id}`)
}))

// remove listing using id 
router.delete('/:id',wrapAsync(async (req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings')
 }))


module.exports= router;