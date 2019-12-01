import express from 'express';
import BodyParser from 'body-parser';
import db from "../database/db";
import { getMissingParams } from "../functions/util";
import {getSeriesTitleById, getSeriesById, getCharactersBySeriesId} from "../functions/databaseFunctions";

type Request = express.Request;
type Response = express.Response;

const bodyParser = BodyParser.json();
const app = express.Router();

app.get('/test', async (req, res) => {
    const { columns = '' }: { columns: string; } = req.query;
    const a = await getCharactersBySeriesId(1, columns.split(','));
    res.send(a);
});

app.get('/', async (req, res) => {
    const results = await db.select('SELECT * from chapter');
    res.send(results);
});

app.post('/', bodyParser, async (req, res) => {
    const {
        book_id,
        chapter_name,
        chapter_number,
    } = req.body;

    const missing = getMissingParams({ book_id, chapter_name, chapter_number });
    if (missing.length > 0) {
        return res.status(400).send({ message: `Missing ${missing.join(', ')}`});
    }

    const sql = 'INSERT INTO chapter(title, chapter_number) VALUES (?, ?);';

    const { insertId: chapter_id } = await db.insert(sql, [chapter_name, chapter_number]);

    // need to insert into book chapter
    const sql2 = 'INSERT INTO book_chapter(book_id, chapter_id) VALUES (?, ?)';
    const results = await db.insert(sql2, [book_id, chapter_id]);

    res.send(results);
});

export default app;
