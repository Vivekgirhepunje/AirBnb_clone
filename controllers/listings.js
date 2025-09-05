const Listing = require('../models/listing')

module.exports.index=async(req,res)=>{
   const allListing = await Listing.find(); // return the array of all the documents
   res.render('./listings/index.ejs',{allListing})
}

module.exports.renderNewForm=(req,res)=>{
    res.render('./listings/new.ejs');
}

module.exports.showListing= async (req,res)=>{
   let listing= await Listing.findById(req.params.id).populate({path:"reviews",populate:{path:"author"}}).populate("owner")
   if(!listing){
    req.flash("error","Listing you requested does not exists!");
    res.redirect('/listings')
   }
   else res.render('./listings/show.ejs',{listing})
}

module.exports.createListing= async (req,res)=>{
    const{path:url,filename}= req.file
    const newListing= new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename}
    await newListing.save();
    // console.log("new listing created")
    //flash message - new listing created 
    req.flash("success","New Listing Created!");
    res.redirect('/listings')
}

module.exports.renderEditForm=async (req,res)=>{
    let listing=await Listing.findById(req.params.id)
    if(!listing){
        req.flash("failure","Listing you requested does not exists!")
        res.redirect('/listings')
    }
    res.render('./listings/edit.ejs',{listing})
}

module.exports.editListing= async (req,res)=>{

    let {id}= req.params;
    console.log()
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing})
    let {path:url, filename}= req.file
    console.log(req.file)
    if(req.file){
        listing.image={url,filename}
        console.log("image modified")
        listing.save()
    }
    
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`)
}

module.exports.destroyListing=async (req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect('/listings')
 }