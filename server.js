var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');

mongoose.connect('mongodb://localhost/chrome2mongo');

var Article   = require('./app/models/articles');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; 

var router = express.Router(); 

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// on routes that end in /articles
router.route('/articles')

    // create a article (accessed at POST http://localhost:8080/api/articles)
    .post(function(req, res) {
        
        var article = new Article();      // create a new instance of the Article model
        article.title = req.body.title;  // set the articles name (comes from the request)
        article.url = req.body.url;
        article.author = req.body.author;

        // save the bear and check for errors
        article.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Article created!' });
        });
        
    })

    // get all the articles (accessed at GET http://localhost:8080/api/articles)
    .get(function(req, res) {
        Article.find(function(err, articles) {
            if (err)
                res.send(err);

            res.json(articles);
        });
    });



// all of our routes will be prefixed with /api
app.use('/api', router);

app.listen(port);
console.log('Magic happens on port ' + port);