var express = require("express");
var router = express.Router();
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");

router.get("/", function (req, res) {
  getArticles(req, res);
});

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
  let articles = getArticles(req, res);
  res.render("index", articles);
});

// This API gets all the Articles are saved
router.get("/articlesSaved", function (req, res) {
  db.Article.find({ isSaved: true }).populate("notes").then(function (results) {
    res.json(results);
  }).catch(function (error) {
    res.json(error);
  });

});

// This updates the Article when it is saved
router.put("/saveArticle/:id", function (req, res) {
  db.Article.findOneAndUpdate({ _id: req.params.id }, { $set: { isSaved: true } }).then(function (result) {
    res.json({ isSuccess: true });
  }).catch(function (error) { res.json(error) });
});

// This API gets all the Notes related the specific id
router.get("/getNotes/:id", function (req, res) {
  db.Article.findOne({ _id: req.params.id }).populate("notes").then(function (results) {
    res.json(results.notes)
  })
});

// This API creates the notes for a specific Article and returns the updated Article
router.post("/saveNotes/:id", function (req, res) {
  db.Notes.create(req.body).then(function (notesDB) {
    return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { notes: notesDB._id } }, { new: true })
  }).then(function (article) {
    res.json(article);
  }).catch(function (error) {
    res.json(error);
  });
});

// Deletes the specific article
router.get("/deleteArticle/:id", function (req, res) {
  db.Article.findByIdAndDelete(req.params.id).then(function (result) {
    result.notes.forEach(element => {
      db.Notes.findOneAndDelete({ _id: element }).then(function (notesResult) {
        return (notesResult);
      }).catch(function (error) { res.json(error) });
    });
    res.json({ isSuccess: true });
  }).catch(function (error) { res.json(error) });
});

// This API deletes the specific notes
router.get("/deleteNotes/:notesId/:articleId", function (req, res) {

  db.Notes.findByIdAndDelete(req.params.notesId).then(function (result) {

    db.Article.findOneAndUpdate({ _id: req.params.articleId }, { $pull: { notes: req.params.notesId } }).catch(function (error) { res.json(error) });
    res.json({ isSuccess: true });
  }).catch(function (error) { res.json(error) });

});

function getArticles(req, res) {
  db.Article.find({ isSaved: false }).then(function (results) {
    let articlesArray = {
      saved: false,
      articles: results
    };
    // return (results);
    res.render("index", articlesArray);
    // res.json(articlesArray);
  }).catch(function (error) {
    res.json(error);
  });
}

module.exports = router;