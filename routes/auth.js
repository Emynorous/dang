const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');

const router = express.Router();

router.post('/register', (req, res) => {
  const { username, name, email, password } = req.body;

  if (!username || !name || !email || !password) return res.send('Vyplňte všechna pole.');

  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run(
    `INSERT INTO users (username, name, email, password) VALUES (?, ?, ?, ?)`,
    [username, name, email, hashedPassword],
    function (err) {
      if (err) return res.send('Uživatel už existuje nebo chyba.');
      res.redirect('/login.html');
    }
  );
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
    if (err || !user || !bcrypt.compareSync(password, user.password)) {
      return res.send('Špatné přihlašovací údaje.');
    }
    req.session.user = user;
    res.redirect('/profile.html');
  });
});

router.post('/update', (req, res) => {
  if (!req.session.user) return res.status(401).send('Nepřihlášen');

  const { name, email, password } = req.body;
  const userId = req.session.user.id;
  const hashedPassword = password ? bcrypt.hashSync(password, 10) : req.session.user.password;

  db.run(
    `UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?`,
    [name, email, hashedPassword, userId],
    function (err) {
      if (err) return res.send('Chyba při aktualizaci.');
      res.redirect('/profile.html');
    }
  );
});

module.exports = router;
