var express = require("express");
var router = express.Router();
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");

// This API scrapes the website and stores the data into the DB
router.get("/scrape", function (req, res) {
  axios.get("https://www.nytimes.com/").then(function (response) {
    const $ = cheerio.load(response.data);
    $("article a").each(function (i, element) {
      var result = {};
      result.headline = $(this).children("div")
        .children("h2")
        .text();
      result.url = $(this).attr("href");
      result.summary = $(this).children("p")
        .text();

      if (result.headline) {
        // console.log(result);
        db.Article.create(result)
          .then(function (dbArticle) {
            // View the added result in the console
            // console.log(dbArticle);
          })
          .catch(function (err) {
            // If an error occurred, log it
            // console.log(err);
          });
      }
    });
  }).catch(error => console.log(error));
  res.send("Scrapped");
});

// This API gets all the articles that are not saved
router.get("/articles", function (req, res) {
  db.Article.find({ isSaved: false }).then(function (results) {
    res.json(results);
  }).catch(function (error) {
    res.json(error);
  });
});

// This API gets all the Articles are saved
router.get("/articlesSaved", function (req, res) {
  db.Article.find({ isSaved: true }).populate("notes").then(function (results) {
    res.json(results);
  }).catch(function (error) {
    res.json(error);
  });

});

// This API gets all the Notes related the specific id
router.get("/getNotes/:id", function (req, res) {
  db.Article.findOne({ _id: req.params.id }).populate("notes").then(function (results) {
    res.json(results.notes)
  })
});

// This API creates the notes for a specific Article and returns the updated Article
router.post("/saveNotes/:id", function (req, res) {
  db.Notes.create(req.body).then(function(notesDB){
    return db.Article.findOneAndUpdate({_id:req.params.id},{$push :{notes:notesDB._id}},{new:true})
  }).then(function(article){
    res.json(article);
  }).catch(function(error){
    res.json(error);
  });
});

// Deletes the specific article
router.get("/deleteArticle/:id",function(req,res){
  db.Article.findByIdAndDelete(req.params.id).populate("notes").then(function(result){
    console.log(result.notes);
    // res.json(result);
   db.Notes.deleteMany(result.notes, function(err) {res.json(err)})
})
});


module.exports = router;