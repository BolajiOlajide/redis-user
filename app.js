const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const redis = require('redis');
require('dotenv').config();


// set port
const PORT = process.env.PORT || 3001;

// init app
const app = express();