//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
var fs = require('fs');
var path = require('path');

var multer = require('multer');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/images/")
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now()+path.extname(file.originalname));
    }
});

var upload = multer({
  storage: storage }).single("file");



mongoose.connect("mongodb+srv://",  {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

const postSchema = new mongoose.Schema({
  postImage:
   {
       data: Buffer,
       contentType: String
   },
  postTitle: String,
  postBody: String

});
const Post = mongoose.model("Post", postSchema);


const homeStartingContent = "This blog-post website is made with the specifications that one can add  his/her own blogs by going to the compose-section.The composed post, gets added to this website's database on clicking the publish button on the compose page of the website.The website uses Mongodb to handle and to render the data to the posts-section.Along with the Mongodb, the website uses heroku and git to render it on the internet.The other utilities used are Node.js, Express.js, Javascript, Html, Css and Bootstrap for designing the Back-end, Front-end and User-Interface of the website.Go and post your blog on the compose-section and we will make it published on our website.";

const aboutContent = "This blog-post website is made with the specifications that one can add  his/her own blogs by going to the compose-section.The composed post, gets added to this website's database on clicking the publish button on the compose page of the website.The website uses Mongodb to handle and to render the data to the posts-section.Along with the Mongodb, the website uses heroku and git to render it on the internet.The other utilities used are Node.js, Express.js, Javascript, Html, Css and Bootstrap for designing the User-Interface, Front-end and Back-end of the website.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


app.get("/", function(req, res) {
  Post.find({}, function(err, foundPosts) {
    if (!err) {
      res.render("home", {
        homeStartingContentInejs: homeStartingContent,
        postsInejs: foundPosts
      });
    }
  });


});

app.get("/about", function(req, res) {
  res.render("about", {
    aboutContentInejs: aboutContent
  });
});

app.get("/contact", function(req, res) {
  res.render("contact", {
    contactContentInejs: contactContent
  });
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

app.get("/posts/:newpostparameter", function(req, res) {
  let checkparameterId = req.params.newpostparameter;

  Post.findOne({ _id : checkparameterId }, function(err, foundPost) {
    if (!err) {

        res.render("post", {
          newPostImageInejs : foundPost.postImage,
          newPostTitleInejs: foundPost.postTitle,
          newPostBodyInejs: foundPost.postBody
        });
    }
  });

});

app.post("/compose",upload, function(req, res) {


  const newPost = new Post({
    postImage : {
      data: fs.readFileSync(path.join(__dirname + '/public/images/' + req.file.filename)),
      contentType: 'image/png/jpg'
    },
    postTitle: req.body.postTitle,
    postBody: req.body.postBody
  });

 if(req.body.postBody.length>0)
  {newPost.save();}

  res.redirect("/");
});


let port = process.env.PORT;
if(port == null || port =="")
{
  port = 3000;
}

app.listen(port, function() {
  console.log("server running !");
});
