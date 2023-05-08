const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors")
require('dotenv').config();



const recipeRoutes = require("./routes/recipeRoutes")
const userRoutes = require("./routes/userRoutes")
const connection = mongoose.connect(process.env.DATABASE_URL)
.then(()=>{
    console.log("connected to db")
}).catch((err)=>{
    console.log("connection failed to db ",err);
});


// middleware & static files
app.use('/images', express.static('images'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// recipe routes
app.use("/api/v1/recipes/",recipeRoutes)
// user routes
app.use("/api/v1/users/",userRoutes)


app.listen(process.env.PORT,()=>{
    console.log(`server listening on port ${process.env.PORT}`)
});
