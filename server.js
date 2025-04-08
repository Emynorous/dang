const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const authRoutes = require('./routes/auth');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'tajnyklic',
  resave: false,
  saveUninitialized: true
}));

app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(3000, () => {
  console.log('Server běží na http://localhost:3000');
});
