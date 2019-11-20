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

app.get('/series/:series_name', async (req, res) => {
   const { series_name } = req.params;
   const results = await db.query(
      `SELECT * 
      FROM series join series_book using (series_id) join book using (book_id) 
      where series.title = '${series_name}'`
   );
   res.send(results);
});

// Start the server
(async () => {
   const port = 3000;
   const address = '127.0.0.1';
   await app.listen(port, address);
   console.log(`Listening at ${address}/${port}`);
})();
