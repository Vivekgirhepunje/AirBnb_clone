const Listing =require('./models/listing')
const Review = require("./models/review")
module.exports.isLoggedIn = (req,res,next)=>{

    
    if(!req.isAuthenticated()){
        //if user is not logged then only we will save req.originalUrl to save where user was 
        // previously requesting 
        req.session.redirectUrl=  req.originalUrl;
        req.flash("error","You must be logged in to perform this operation!!")
        return  res.redirect("/login") 
    }
    next()
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
    res.locals.redirectUrl= req.session.redirectUrl;
    }
    next()
}

module.exports.isOwner=async (req,res,next)=>{
    let {id}= req.params;
    let listing = await Listing.findById(id) // now using these listing we will find the owner and check if it matches the login user
    if(!listing.owner || !listing.owner._id.equals(req.user._id)){
        req.flash("error","You are not owner of this listing")
        return res.redirect(`/listings/${id}`)
    }
    next()
}

module.exports.isReviewAuthor= async (req,res,next)=>{
     const {id,reviewId}= req.params;
     let review= await Review.findById(reviewId).populate('author')
     if(!req.user || !req.user._id.equals(review.author._id)){
        req.flash("error","This review does not belong to you!")
        return res.redirect(`/listings/${id}`)
     }
     next()
}