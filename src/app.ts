import express from 'express';
import morgan from 'morgan';
const app = express();

import db from './database/db';

// Template engine
app.set('views', './src/ui/views');
app.set('view engine', 'pug');

// Logging
app.use(morgan('dev'));

const getData = async (series_id: number,
                       book_id: number = 1,
                       chapter_number: number = 1,
                       include_chapter: boolean = false) => {
   const noteSql = db.format(
       `SELECT *
      FROM note
      WHERE book_id = ?
      AND chapter_id <${include_chapter ? '=' : ''} ?`,
       [book_id, chapter_number],
   );

   const attributeSql = db.format(
       `SELECT book_id, chapter_id, attribute_name, value
      FROM custom_attribute
      WHERE book_id = ?
      AND chapter_id <${include_chapter ? '=' : ''} ?`,
       [book_id, chapter_number],
   );

   const [notes, attributes] = await Promise.all([
      db.query(noteSql),
      db.query(attributeSql),
   ]);

   return { notes, attributes };
}

// Routes
app.get('/pug', (req, res) => {
   res.render('test', {
      test: 'max',
   });
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

app.get('/notes/:series_id/:book_id/:chapter_number', async (req, res) => {
   const {
      series_id,
      book_id,
      chapter_number,
   } = req.params;
   const { include_chapter } = req.query;
   const results = await getData(series_id, book_id, chapter_number, Boolean(parseInt(include_chapter, 10)));
   res.send(results);
});

// Start the server
(async () => {
   const port = 3000;
   const address = '127.0.0.1';
   await app.listen(port, address);
   console.log(`Listening at ${address}/${port}`);
})();
