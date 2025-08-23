const express = require('express');
const app = express();
const listing= require('./routes/listing.js')
const review= require('./routes/review.js')
const mongoose= require('mongoose');

const mongoURL='mongodb://127.0.0.1:27017/wanderlust'
const path = require('path');
const methodOverride= require('method-override')
const ejsMate= require('ejs-mate')
const ExpressError = require('./utils/ExpressError.js')
const {wrapAsync} = require('./utils/wrapAsync.js')
const {validateListingSchema,validateReviewSchema} = require('./models/validateSchema.js')



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


// route route
app.get('/',(req,res)=>{
    res.send("welcome to my Website");
})

// for hadling all the request starting with /listings
app.use('/listings',listing);
app.use('/listings/:id/reviews',review)


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