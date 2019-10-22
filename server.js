var express=require("express");
var axios=require("axios");
var mongoose=require("mongoose");
var cheerio = require("cheerio");

var app=express();

// var db=require("./models");
var routes=require("./routes/htmlRoutes");

var PORT=process.env.PORT||3000;

var MONGODB_URI=process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);

// This converts the express response to the JSON format
app.use(express.urlencoded({extended:true}));
app.use(express.json());

// It uses the static file path when deployed in HEROKU
app.use(express.static("public"));

// This uses the routes folder files for routing
app.use("/",routes);

// Starts the server
app.listen(PORT,function(){
    console.log("App running on port " + PORT + "!");
});