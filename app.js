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

//TODO

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser: true});

const articleSchema={
    title: String,
    content: String
}

const Article=mongoose.model("Article",articleSchema);

 
app.route("/articles")
.get(function(req,res){
    Article.find(function(err,foundArticles){
        if(!err){
             res.send(foundArticles);
        }else{
            res.send(err);
        }
    })
})

.post(function(req,res){
    console.log();

    const React= new Article({
        title : req.body.title ,
        content : req.body.content
    });

    React.save(function(err){
        if(!err){
            res.send("Successfully added");
        }else{
            res.send(err)
        }
    })
})

.delete(function(req,res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("Successfully deleted all the docs!")
        }else{
            res.send(err)
        }
    })
});

app.route("/articles/:articleTitle")
.get(function(req,res){
    Article.findOne({title:req.params.articleTitle},function(err,foundArticle){ 
    if(!err){
        res.send(foundArticle);
    }else{
        res.send(err);
    }
})
})

.put(function(req,res){
    Article.updateOne({title:req.params.articleTitle},
        {title : req.body.title ,
        content : req.body.content},
        {overwrite:true},
        function(err){
            if(!err){
                res.send("Successfully updated Articles!");
            }else{
                res.send(err);
            } 
        })
})

.patch(function(req,res){
    Article.updateOne(
        {title:req.params.articleTitle},
        {$set: req.body},
        function(err){
            if(!err){
                res.send("Successfully Updated");
            }else{
                res.send(err);
            }
        })
})

.delete(function(req,res){
    Article.deleteOne(
        {title:req.params.articleTitle},
        function(err){
            if(!err){
                res.send("Successfully deleted");
            }else{
                res.send(err);
            }
        }
    );
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});