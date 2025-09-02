const express = require('express')
const router= express.Router()
const ExpressError = require('../utils/ExpressError.js')
const {wrapAsync} = require('../utils/wrapAsync.js')
const {validateListingSchema,validateReviewSchema} = require('../models/validateSchema.js')
const Listing=  require("../models/listing.js");
const {isLoggedIn,isOwner}= require('../middleware.js')
const listingController = require('../controllers/listings.js')


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


// to show all the listings index route
router.get('/',wrapAsync(listingController.index))


// to fetch form for creating new listing
router.get('/new',isLoggedIn,listingController.renderNewForm)


// to show particular listing 
router.get('/:id',wrapAsync(listingController.showListing))


// for creating new listing
router.post('/',validateListing,isLoggedIn,wrapAsync(listingController.createListing))


// for editing existing listing it will show form where field are filled with prev. values
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm))


// sending edited listing to DB
router.put('/:id',isLoggedIn,isOwner,validateListing,wrapAsync(listingController.editListing))


// remove listing using id 
router.delete('/:id',isLoggedIn,isOwner,wrapAsync(listingController.deleteListing))


module.exports= router;