const express = require('express');
const Listing=  require("../models/listing.js");
const Review = require("../models/review.js")
const {wrapAsync} = require('../utils/wrapAsync.js')
const {validateListingSchema,validateReviewSchema} = require('../models/validateSchema.js')
const router= express.Router({mergeParams:true})


const validateReview= function(req,res,next){
    
    const {error,value} = validateReviewSchema.validate(req.body,{ abortEarly: false })
    
    if(error){
        const errmsg= error.details.map(e=>e.message).join(', ')
        throw new ExpressError(400,errmsg)
    }
    else{
      next();
    }
}

// for adding reviws 
 router.post('/',validateReview,wrapAsync(async(req,res)=>{
    const {id}= req.params; 
    const newReview = new Review(req.body.review)
    const listing=await Listing.findById(id)
    listing.reviews.push(newReview);
    await listing.save()
    await newReview.save()
    req.flash("success","Review Added!");
    res.redirect(`/listings/${id}`)
}))

// for deleting reviews
router.delete('/:reviewId',wrapAsync(async (req,res)=>{
    const {id,reviewId}= req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`)
}))

module.exports= router;