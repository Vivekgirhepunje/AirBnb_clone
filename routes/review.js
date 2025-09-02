const express = require('express');
const {wrapAsync} = require('../utils/wrapAsync.js')
const {validateReviewSchema} = require('../models/validateSchema.js');
const { isLoggedIn,isReviewAuthor} = require('../middleware.js');
const router= express.Router({mergeParams:true})
const reviewController= require('../controllers/reviews.js');

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
 router.post('/',isLoggedIn,validateReview,wrapAsync(reviewController.createReview))

// for deleting reviews
router.delete('/:reviewId',isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview))

module.exports= router;