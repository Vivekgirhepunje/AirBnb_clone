
module.exports.renderLoginForm=async (req,res)=>{
    res.render('./users/login')
}

module.exports.login=async (req,res)=>{
    req.flash("success","Welcome to Wanderlust!")
    const redirectUrl= res.locals.redirectUrl||'/listings'
    res.redirect(redirectUrl) 
}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
       if(err){
         return next(err)
       }
       req.flash("success","you logged out!")
       res.redirect("/listings")
    })
    
}

module.exports.signup=async(req,res)=>{
    try{
    const {username,email,password}= req.body
    let newUser= new User({email,username})
    let user= await User.register(newUser,password)
    req.login(user,(err)=>{
    if(err){
        return next(err)
    }
    req.flash("success","User has successfully Registered!")
    res.redirect('/listings')
   })
    }
    catch(err)
    {
        req.flash("error",err.message)
        res.redirect('/signup')
    }
}