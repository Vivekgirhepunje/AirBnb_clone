const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const listingSchema= new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
      filename:{
            type:String,
            default:"listingimage"
        }
        ,
        url:{
        type:String,
        default:"https://unsplash.com/photos/a-large-pink-house-with-a-pond-in-front-of-it-S7bDOVuF4R8",
        set:(v)=>v===''?"https://unsplash.com/photos/a-large-pink-house-with-a-pond-in-front-of-it-S7bDOVuF4R8":v

        }
    },
    price:Number,
    location:String,
    country:String
})

const Listing = mongoose.model('Listing',listingSchema)
module.exports = Listing;