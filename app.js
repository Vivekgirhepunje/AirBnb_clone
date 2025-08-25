const express = require('express');
const session = require('express-session')
require('dotenv').config()
const app = express();
const listingRouter= require('./routes/listing.js')
const reviewRouter= require('./routes/review.js')
const userRouter= require('./routes/uesr.js')
const mongoose= require('mongoose');
const flash =  require('connect-flash')
const passport= require('passport')
const LocalStrategy= require('passport-local')
const User = require('./models/user.js')


const mongoURL= process.env.MONGO_URI
const path = require('path');
const methodOverride= require('method-override')
const ejsMate= require('ejs-mate')
const ExpressError = require('./utils/ExpressError.js')
const {wrapAsync} = require('./utils/wrapAsync.js')
const {validateListingSchema,validateReviewSchema} = require('./models/validateSchema.js');
const { resolveCname } = require('dns');


const sessionOption={
    secret:"secretkey",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now()*24*7*60*60*1000,
        maxAge:24*7*60*60*1000
    }
}
app.use(flash())
app.use(session(sessionOption))

//passport related middleware
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// Middleware to parse URL-encoded bodies (form data)
app.use(express.urlencoded({ extended: true }));
app.set('view engine','ejs')
app.engine('ejs',ejsMate)
// Middleware to parse JSON (if sending JSON)
app.use(express.json());
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname,"/public")))

main().then(()=>{
    console.log("connected to Database successfully")
})
.catch((error)=>{
    console.log(error)
})

async function main(){
    await mongoose.connect(mongoURL)
}

// middleware for setting flash messages 
app.get('/',(req,res)=>{
    res.send("welcome to my Website");
})

app.use((req,res,next)=>{
    res.locals.success= req.flash("success");
    res.locals.error= req.flash("error");
    next()
})

// route route


// for hadling all the request starting with /listings
app.use('/listings',listingRouter);
app.use('/listings/:id/reviews',reviewRouter)
app.use('/',userRouter)

// handling invalid route 
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});


// error-handling Middlewares 
app.use((err,req,res,next)=>{
    let{status=500,message="Something went wrong"}=err
    res.status(status).render("error.ejs",{message})
})


app.listen(8080,()=>{
   console.log("server is running on port: 8080")
})