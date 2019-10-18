//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const app = express();
const pass = process.env.DB_PASS;

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(express.static("public"));

mongoose.connect(
  "mongodb+srv://admin-alistair:" + pass + "@cluster0-gah1e.mongodb.net/blogDB",
  {
    useNewUrlParser: true
  }
);

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res) {
  Post.find({}, function(err, posts) {
    res.render("home", {
      posts: posts
    });
  });
});

app.get("/about", function(req, res) {
  res.render("about");
});

app.get("/contact", function(req, res) {
  res.render("contact");
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

app.post("/compose", function(req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save(function(err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res) {
  const requestedPostId = req.params.postId;

  Post.findOne(
    {
      _id: requestedPostId
    },
    function(err, post) {
      res.render("post", {
        title: post.title,
        content: post.content
      });
    }
  );
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server has started successfully");
});
