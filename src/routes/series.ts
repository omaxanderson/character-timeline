import express from 'express';
import BodyParser from 'body-parser';
import db from '../database/db';

type Request = express.Request;
type Response = express.Response;

const app = express.Router();
const bodyParser = BodyParser.json();

// Get a series by id
app.get('/:series_id', async (req: Request, res: Response) => {
    const { series_id } = req.params;
    if (Number.isNaN(parseInt(series_id, 10))) {
        res.status(400).send({ message: 'Series ID must be a number' });
    }
    const results = await db.query(
        `SELECT *
      FROM series join series_book using (series_id) join book using (book_id) 
      where series.title = '${series_id}'`
    );
    res.send(results);
});

// Get a series by title
app.get('/', async (req: Request, res: Response) => {
    const { q, columns } = req.query;
    const results: any = await db.query(
        db.format(`SELECT series.series_id, series.title
      FROM series
      where series.title LIKE ?`, [`%${q}%`])
    );
    // for each result, get book info
    if (columns && columns.split(',').includes('books')) {
        const withBooks = results.map(async (series) => {
            const sql = db.format(
                `select book.book_id, title, book_number
                from series_book
                    join book using (book_id)
                where series_id = ?`,
                [series.series_id],
            );
            const data = await db.query(sql);
            return {
                ...series,
                books: data,
            };
        });

        const all = await Promise.all(withBooks);

        return res.send(all);
    }
    res.send(results);
});

app.post('/', bodyParser, async (req: Request, res: Response) => {
    const { series_name } = req.body;
    if (!series_name) {
        res.status(400).send({ message: 'Series name is required!'});
    }
    const insertSql = db.format('INSERT INTO series (title) VALUES (?)', [series_name]);
    const result = await db.query(insertSql);
    res.send(result);
});

export default app;
