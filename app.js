const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require ('ejs');
const chalk = require('chalk');
const morgan = require('morgan');

const app = express();
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.set('view engine','ejs');
app.use(morgan('tiny'));
app.use(express.static("public"));

// set up db
mongoose.connect('mongodb://localhost:27017/WikiDB', {useNewUrlParser : true, useUnifiedTopology : true});

//confirm db connection
mongoose.connection.on('open',()=> console.log(chalk.bgMagenta('MongoDB Connected ...')))

// create schema
const articleSchema = {
    title : String,
    content : String
};

// modal
const Article = mongoose.model('Article', articleSchema);

// chaining routes
// basic crud function targetting all article
app.route('/articles')
.get((req,res)=>{
        Article.find((err,foundArticles)=>{
            if(!err){ 
            res.send(foundArticles);
            }else(
                res.send(err)
            )
        });
    }
) 
.post((req,res)=>{
    // console.log( req.body.title)
    // console.log( req.body.content)
   
    const newArticle = new Article({
        title : req.body.title,
        content: req.body.content
    });
    newArticle.save((err)=>{
        if(!err){
            res.send('Successfully added new article');
        }else{
            res,send(err) 
        }
    });
}) 
.delete((req,res)=>{
    Article.deleteMany((err)=>{
        if (!err){
            res.send("Successfullt deleted all artciles in DB")
        }else(
            res.send(err)
        )
    });
});

// chaining routes
// getting specific stuff / article
app.route('/articles/:articleTitle')
.get((req,res)=>{
    
    Article.findOne({title:req.params.articleTitle}, (err, foundArticle)=>{
        if(foundArticle){
            res.send(foundArticle);
        }else{
            res.send('No article matching that title was found.')
        }
    });

})
.put((req,res)=>{
    Article.update(
        // CONDITION
        {title:req.params.articleTitle},
        // fields to be updates
        {title : req.body.title,content : req.body.content },
        //  overiwte function set it to true
        {overwrite : true},
        // now add call back function
        (err) =>{
            if(!err){
                res.send("Successfully Updates the Article");
            }
        }


    )

})
.patch((res,req)=>{
    Article.update(
        {title : req.params.articleTitle},
        {$set : req.body},
        (err) =>{
            if(!err){
                res.send("successfully updated the specific article ");
            }else{
                res.send(err)
            }
        } 
    )

})
.delete((req,res) =>{
    Article.deleteOne(
        {title : req.params.articleTitle},
        (err) =>{
            if(!err){
                res.send('One specified article has been deleted')

            }else{
                res,send(err)
            }
        }
    )
}
  
);

app.listen(5000, ()=>console.log(chalk.bgMagenta('server running on specified port')));