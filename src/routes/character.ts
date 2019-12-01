import express from 'express';
import db from "../database/db";
import BodyParser from 'body-parser';
import getCharacterData from '../functions/getCharacterData';

type Request = express.Request;
type Response = express.Response;

const bodyParser = BodyParser.json();
const app = express.Router();

app.get('/:character_name', async (req: Request, res: Response) => {
    const { character_name } = req.params;
    const { book_number, chapter_number } = req.query;
    const [meta, attributes, notes] = await getCharacterData({ character_name, book_number, chapter_number });
    const formatted = {
        meta,
        attributes,
        notes,
    };

    res.send(formatted);
});

app.get('/:character_name/series', async (req: Request, res: Response) => {
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

app.post('/', bodyParser, async (req: Request, res: Response) => {
    const {
        character_name,
        series_name,
        book_name,
        book_number,
        is_series,
    } = req.body;

    if (!character_name || (!series_name && !book_name)) {
        const missing = [];
        character_name === undefined && missing.push('character name');
        series_name === undefined && missing.push('series name');
        book_name === undefined && missing.push('book name');
        res.status(400).send({ message: `Missing ${missing.join(', ')}` });
    }

    if (is_series) {
        // get series id first
        const { series_id } = (await db.fetchOne(
            'SELECT series_id FROM series WHERE title = ?',
            [series_name],
        )) || {};

        if (!series_id) {
            return res.status(404).send({ success: false, message: `No series found for ${series_name}.`});
        }

        const book_id = null;

        const insertSql = db.format('INSERT INTO characters (name, series_id, book_id) ' +
            'VALUES (?, ?, ?);', [character_name, series_id, book_id]);
        const insertResult = await db.query(insertSql);
        res.send(insertResult);
    } else {
        // get book info and stuff
        // for now though we're just gonna error out
        res.status(400).send({ message: 'Bad. Can\'t do that yet.' });
    }
});


export default app;
