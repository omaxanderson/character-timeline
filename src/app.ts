import express from 'express';
import morgan from 'morgan';
const app = express();

import db from './database/db';

// Template engine
app.set('views', './src/ui/views');
app.set('view engine', 'pug');

// Logging
app.use(morgan('dev'));

// Routes
app.get('/pug', (req, res) => {
   res.render('test');
});

app.get('/series/:series_id', async (req, res) => {
   const { series_id } = req.params;
   if (Number.isNaN(series_id)) {
      res.code(400).send({ message: 'Series ID must be a number' });
   }
   const results = await db.query(
      `SELECT *
      FROM series join series_book using (series_id) join book using (book_id) 
      where series.title = '${series_id}'`
   );
   res.send(results);
});

app.get('/series', async (req, res) => {
   const { q } = req.query;
   const results = await db.query(
      `SELECT *
      FROM series join series_book using (series_id) join book using (book_id) 
      where series.title = '${q}'`
   );
   res.send(results);
});

app.get('/notes/:book_id/:chapter_number', async (req, res) => {
   const { book_id, chapter_number } = req.params;
   const { include_chapter } = req.query;
   console.log('include chapter?', Boolean(include_chapter));
   console.log(typeof include_chapter);
   // default to "up until this chapter"
   const sql = db.format(
      `SELECT *
      FROM note
      WHERE book_id = ?
      AND chapter_id <${parseInt(include_chapter, 10) ? '=' : ''} ?`,
      [book_id, chapter_number],
   );
   console.log(sql);
   const results = await db.query(sql);
   res.send(results);
});

// Start the server
(async () => {
   const port = 3000;
   const address = '127.0.0.1';
   await app.listen(port, address);
   console.log(`Listening at ${address}/${port}`);
})();
