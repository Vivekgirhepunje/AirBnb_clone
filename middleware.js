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