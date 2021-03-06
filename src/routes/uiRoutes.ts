import express from 'express';

const app = express.Router();

app.get('/:character_name', (req, res) => {
    const { character_name: character } = req.params;
    //const { book_number, chapter_number, include_chapter } = req.query;
    res.render('test', { character });
});

app.get('/series/add', (req, res) => {
    res.render('AddSeries');
});

export default app;
