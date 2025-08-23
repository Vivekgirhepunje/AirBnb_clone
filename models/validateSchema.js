const joi = require("joi");

module.exports.validateListingSchema = joi.object({
  listing: joi.object({
    title: joi.string().required().label("Title"),
    description: joi.string().required().label("Description"),
    price: joi.number().min(0).required().label("Price"),
    location: joi.string().required().label("Location"),
    country: joi.string().required().label("Country"),

    image: joi.alternatives().try(
      joi.object({
        filename: joi.string().optional(),
        url: joi.string().allow('', null)
      }).allow({}, null),   // allow empty object or null
      joi.string().allow('', null) // also allow plain empty string
    ).label("Image Url")
  }).required().label("Listing")
});


module.exports.validateReviewSchema= joi.object({
  review:joi.object({
    comment:joi.string().required().label("Comment"),
    rating:joi.number().min(1).max(5).label("Rating")
  }).required()
})

