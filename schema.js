// Server side validation using joi for data validation.
const { raw } = require('express');
const Joi = require('joi');

const listingSchema = Joi.object({
    title:Joi.string().required(),
    description:Joi.string().required(),
    price:Joi.number().required(),  
    location:Joi.string().required() ,
    country: Joi.string().required(), // ✅ add this line
    image:Joi.object({
        url:Joi.string().allow("",null),
        filename:Joi.string().allow("",null)
    }).optional()
});


const reviewSchema = Joi.object({
    review: Joi.object({
        rating:Joi.number().min(1).max(5).required(),
        comment:Joi.string().required()
  }).required(),
});

module.exports = { listingSchema, reviewSchema };
