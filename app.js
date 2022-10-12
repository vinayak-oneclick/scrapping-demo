const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const routes = require('./routes/rc.route');

const port = 3500;

const app = express();
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.static('views'));
app.use(cors());

app.use('/', routes);

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
