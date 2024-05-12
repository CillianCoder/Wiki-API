//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB")

const articleSchema = mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
    .get((req, res) => {
        Article.find({})
            .then((foundArticle) => {
                res.send(foundArticle);
            })
            .catch((err) => {
                res.send(err);
            })
    })
    .post((req, res) => {
        try {
            const newArticle = new Article({
                title: req.body.title,
                content: req.body.content
            });
            newArticle.save();
            res.send("Data insert successful!");
        } catch (err) {
            res.send(err)
        }
    })
    .delete((req, res) => {
        Article.deleteMany({})
            .then(() => {
                res.send("All Articles Deleted!")
            })
            .catch((err) => {
                res.send(err);
            })
    });


app.route("/articles/:articleTitle")
    .get((req, res) => {
        Article.findOne({ title: req.params.articleTitle })
            .then((foundArticle) => {
                if (foundArticle) {
                    res.send(foundArticle);
                } else {
                    res.send("Article not found!")
                }
            })
            .catch((err) => {
                res.send(err);
            })
    })
    .put((req, res) => {
        Article.updateOne({ title: req.params.articleTitle }, { title: req.body.title, content: req.body.content})
            .then(() => {
                res.send("Update successful!")
            })
            .catch((err) => {
                res.send(err);
            })
    })
    .patch((req, res) => {
        Article.updateOne({ title: req.params.articleTitle }, { $set: req.body})
            .then(() => {
                res.send("Update successful!")
            })
            .catch((err) => {
                res.send(err);
            })
    })
    .delete((req, res) => {
        Article.deleteOne({ title: req.params.articleTitle})
            .then(() => {
                res.send("Selected data delete successful!")
            })
            .catch((err) => {
                res.send(err);
            })
    });


app.listen(3000, () => {
    console.log("Server started on port 3000");
});