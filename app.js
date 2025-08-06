const express = require('express');
const app = express();
const mongoose= require('mongoose');
const Listing=  require("./models/listing.js");
const mongoURL='mongodb://127.0.0.1:27017/wanderlust'
const path = require('path');
const methodOverride= require('method-override')
const ejsMate= require('ejs-mate')


// Middleware to parse URL-encoded bodies (form data)
app.use(express.urlencoded({ extended: true }));
app.engine('ejs',ejsMate)
// Middleware to parse JSON (if sending JSON)
app.use(express.json());
app.use(methodOverride("_method"))
app.set('view engine','ejs')
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


app.get('/',(req,res)=>{
    res.send("welcome to my Website");
})
// create listing using post route data will added to database


app.get('/listings', async(req,res)=>{
   const allListing = await Listing.find(); // return the array of all the documents
   res.render('./listings/index.ejs',{allListing})
})
app.get('/listings/new',(req,res)=>{
    res.render('./listings/new.ejs');
})

app.get('/listings/:id',async (req,res)=>{
   let listing= await Listing.findById(req.params.id)
   res.render('./listings/show.ejs',{listing})
})

// for creating new listing

app.post('/listings',async (req,res)=>{
    const newListing= new Listing(req.body.listing);
    await newListing.save();
    // console.log("new listing created")
    res.redirect('/listings')
})

// for editing existing listing
app.get("/listings/:id/edit",async (req,res)=>{
    let listing=await Listing.findById(req.params.id)
    res.render('./listings/edit.ejs',{listing})
})

app.put('/listings/:id',async (req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing})
    res.redirect(`/listings/${id}`)
})

// remove listing using id 
 app.delete('/listings/:id',async (req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings')
 })

// app.get('/testListing',async (req,res)=>{
//     let samepleListing = new Listing({
//         title:"my new Villa",
//         description:"By the beach",
//         price:2200,
//         location:"mumbai",
//         country:"India"
//     })
//     await samepleListing.save();
//     console.log("listing saved");
// })

app.listen(8080,()=>{
   console.log("server is running on port: 8080")
})