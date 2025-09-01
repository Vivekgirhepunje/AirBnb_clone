const mongoose = require('mongoose');
const Review = require('./review');
const { object, ref } = require('joi');
const Schema = mongoose.Schema;
const User= require('./user')
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
        default:"https://images.unsplash.com/photo-1668983749904-51bdf1ab3468?q=80&w=1073&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set:(v)=>v===''?"https://images.unsplash.com/photo-1668983749904-51bdf1ab3468?q=80&w=1073&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":v

        }
    },
    price:Number,
    location:String,
    country:String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:'Review'
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
})

// post middleware for deleting reviews after deleting listing

listingSchema.post('findOneAndDelete',async (listing)=>{
      await Review.deleteMany({_id:{$in:listing.reviews}})
})

const Listing = mongoose.model('Listing',listingSchema)
module.exports = Listing;

