const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// step's Schema
const stepSchema = new Schema({
    order:{
        type:Number,
        required:true
    },
    body:{
        type:String,
        required:true
    }
})
const ingredientSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    amount:{
        type:Schema.Types.Decimal128,
        required:true
    },
    unit:{
        type:String,
        required:true
    }
})
const commentSchema = new Schema({
    created_by:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    body:{
        type:String,
        required:true
    }
},{timestamps:true})
const recipeSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    
    // ingredients:[ingredientSchema],
    // steps:[stepSchema],
    ingredients:String,
    steps:String,
    comments:[commentSchema],
    created_by:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
},{timestamps:true})

const Recipe = mongoose.model('recipe',recipeSchema);

module.exports = Recipe;