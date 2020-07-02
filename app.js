const express = require('express');
const morgan = require('morgan');
const playstore = require('./playstore.js');

const app = express();

app.use(morgan('common'));

const genres = ['action', 'puzzle', 'strategy', 'casual', 'arcade', 'card']

app.get('/apps', (req, res) => {
  const { sort, genre = '' } = req.query;

  if (genre) {
    if (!genres.includes(genre.toLowerCase())) {
      return res
        .status(400)
        .send('Genre must be one of Action, Puzzle, Strategy, Casual, Arcade, or Card');
    }
  }

  const results = playstore
    .filter(app =>
      app
        .Genres
        .toLowerCase()
        .includes(genre.toLowerCase()));
  
  if (sort) {
    if (!['rating', 'app'].includes(sort.toLowerCase())) {
      return res
        .status(400)
        .send('Sort must be one of rating or app');
    }
    const sortString = sort.replace(/^\w/, c => c.toUpperCase());
    results
      .sort((a, b) => {
        return a[sortString] > b[sortString] ? 1 : a[sortString] < b[sortString] ? -1 : 0;
      })
  }

  res.json(results);
});

app.listen(8000, () => {
  console.log('Server started on PORT 8000');
});