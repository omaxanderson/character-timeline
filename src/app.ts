import express from 'express';
import morgan from 'morgan';
import get from 'lodash/get';
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
};

const getCharacterData = async ({
                             character_name,
                             series_id = 0,
                             book_id = 0,
                             book_number = 1,
                             chapter_number = 1,
                             include_chapter = true,
                          } : {
   character_name: string,
   series_id?: number,
   book_id?: number,
   book_number?: number,
   chapter_number?: number,
   include_chapter?: boolean,
}) => {
   const chapterLogic = db.format(
       `AND IF(book_number < ?, 1, chapter_number <${include_chapter ? '=' : ''} ?)`,
       [book_number, chapter_number]
   );
   const noteSql = db.format(`
      SELECT note_id, content, book.book_id, book_number, chapter_number
      FROM characters
        JOIN note USING (character_id)
        JOIN book ON book.book_id = note.book_id
      WHERE characters.name = ?
      ${book_number ? db.format('AND book_number <= ?', [book_number]) : ''}
      ${chapter_number ? chapterLogic : ''}
    `, [character_name]);
   console.log('notesql', noteSql);

   const attributeSql = db.format(`
      SELECT attribute_name, value, custom_attribute.book_id, custom_attribute.chapter_number
      FROM characters
         JOIN custom_attribute USING (character_id)
         JOIN book ON custom_attribute.book_id = book.book_id
      WHERE characters.name = ?
      ${book_number ? db.format('AND book_number <= ?', [book_number]) : ''}
      ${chapter_number ? chapterLogic : ''}
   `, [character_name]);

   const metaSql = db.format(`
      SELECT characters.name, series.title, image_url
      FROM characters
        LEFT JOIN series USING (series_id)
        LEFT JOIN character_image USING (character_id)
      WHERE characters.name = ?
   `, [character_name]);

   return Promise.all([
      db.fetchOne(metaSql),
      db.query(attributeSql),
      db.query(noteSql),
   ]);
};

// Routes
app.get('/pug', (req, res) => {
   res.render('test');
});

app.get('/:character_name', (req, res) => {
   const { character_name: character } = req.params;
   const { book_number, chapter_number, include_chapter } = req.query;
   res.render('test', { character });
});

app.get('/api/character/:character_name', async (req, res) => {
   const { character_name } = req.params;
   const { book_number, book_id, chapter_number } = req.query;
   const [meta, attributes, notes] = await getCharacterData({ character_name, book_number, chapter_number });
   const formatted = {
      meta,
      attributes,
      notes,
   };

   res.send(formatted);
});

app.get('/api/character/:character_name/series', async (req, res) => {
    const { character_name } = req.params;

    const booksSql: string = db.format(`
         select
            book.title as book_title,
            group_concat(concat(chapter.chapter_number, '@', chapter.title) separator '|') as chapters,
            book.book_number
         from characters 
            join series_book using (series_id)
            join book on book.book_id = series_book.book_id
            left join book_chapter on book_chapter.book_id = book.book_id
            left join chapter on book_chapter.chapter_id = chapter.chapter_id
         where characters.name = ?
         group by series_book.book_id;`,
        [character_name]
    );
   const bookResults: any = await db.query(booksSql);
   // fix chapters
   const withChapters = bookResults.map(book => ({
      ...book,
      chapters: book.chapters
         ? book.chapters.split('|').map(str => {
             // yuck what the actual fuck is this
            const [chapter_number, chapter_title] = str.split('@');
            return { chapter_number: parseInt(chapter_number, 10), chapter_title };
         }) : [],
   }));

    res.send(withChapters);
});

// Get a series by id
app.get('/api/series/:series_id', async (req, res) => {
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

// Get a series by title
app.get('/api/series', async (req, res) => {
   const { q } = req.query;
   const results = await db.query(
       `SELECT *
      FROM series join series_book using (series_id) join book using (book_id) 
      where series.title = '${q}'`
   );
   res.send(results);
});

app.get('/api/search', async (req, res) => {
   const { q } = req.query;
   const sql = db.format(`select characters.name, series.title as series_title, book.title as book_title
        from characters
            LEFT JOIN series USING (series_id)
            LEFT JOIN book USING (book_id)
        where characters.name = ?`, [q]);
   console.log(sql);
   const results = await db.query(sql);
   console.log('results', results);
   res.send(results);
});

app.get('/api/notes/:series_id/:book_id/:chapter_number', async (req, res) => {
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
