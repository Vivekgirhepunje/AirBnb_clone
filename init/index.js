const mongoose = require('mongoose');
require('dotenv').config()
const {data}= require('./data.js')
const Listing = require('../models/listing.js')
const mongoURL= process.env.MONGO_URI

main().then(()=>{
    console.log("Connected to Database");
})
.catch(err=>console.log(err))

async function main(){
    await mongoose.connect(mongoURL);
}

const initDb = async ()=>{
    await Listing.deleteMany();
    await Listing.insertMany(data);
    console.log("Data was initialized")
}

initDb();