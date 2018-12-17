const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const redis = require('redis');
require('dotenv').config();


// create redis client
let client = redis.createClient();

client.on('connect', function() {
  console.log('Connected to Redis');
});

// set port
const PORT = process.env.PORT || 3001;

// init app
const app = express();

// view engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
// set view engine
app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

// search page
app.get('/', function(req, res) {
  return res.render('searchusers');
});

// search processing
app.post('/user/search', function(req, res, next) {
  let id = req.body.id;

  client.hgetall(id, function(err, obj) {
    if (!obj) {
      return res.render('searchusers', { error: 'User doesn\'t exist' });
    }
    obj.id = id;
    return res.render('details', { user: obj });
  });
});

app.get('/user/add', function(req, res) {
  return res.render('adduser');
});

// process add user page
app.post('/user/add', function(req, res) {
  let id = req.body.id;
  let firstname = req.body.firstname;
  let lastname = req.body.lastname;
  let email = req.body.email;
  let phone = req.body.phone;

  return client.hmset(id, [
    'firstname', firstname,
    'lastname', lastname,
    'email', email,
    'phone', phone
  ], function(err, reply) {
    if (err) {
      console.log(err);
      return;
    }
    console.log(reply);
    return res.redirect('/')
  });
});

// delete user
app.delete('/user/delete/:id', function(req, res) {
  client.del(req.params.id);
  return res.redirect('/');
});

app.listen(PORT, function() { console.log(`Server started on port ${PORT}`)});
