import express from 'express';
import db from "../database/db";
import BodyParser from 'body-parser';
import getData from '../functions/getData';

type Request = express.Request;
type Response = express.Response;

const bodyParser = BodyParser.json();
const app = express.Router();

app.get('/:series_id/:book_id/:chapter_number', async (req: Request, res: Response) => {
    const {
        series_id,
        book_id,
        chapter_number,
    } = req.params;
    const { include_chapter } = req.query;
    const results = await getData(
        parseInt(series_id, 10),
        parseInt(book_id, 10),
        parseInt(chapter_number, 10),
        Boolean(parseInt(include_chapter, 10)),
    );
    res.send(results);
});

app.post('/', bodyParser, async (req: Request, res: Response) => {
    const {
        character_id,
        series_id,
        book_number,
        chapter_number,
        content,
    } = req.body;
    const { book_id } = await db.fetchOne(db.format(`
      SELECT book_id
      from book JOIN series_book USING (book_id)
      WHERE series_id = ? AND book_number = ?`, [series_id, book_number]));
    console.log('book_id', book_id);

    const insertSql = db.format(`
      INSERT INTO note (character_id, series_id, book_id, chapter_number, content)
      VALUES (?, ?, ?, ?, ?);
   `, [character_id, series_id, book_id, chapter_number, content]);
    console.log('insert sql', insertSql);
    const result = await db.query(insertSql);

    console.log(JSON.stringify(req.body, null, 2));
    res.send(result);
});

export default app;
