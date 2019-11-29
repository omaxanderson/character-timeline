import express from 'express';
import db from "../database/db";

type Request = express.Request;
type Response = express.Response;

const app = express.Router();

app.get('/', async (req: Request, res: Response) => {
    const { q } = req.query;
    const sql = db.format(`select character_id, characters.name, series.title as series_title, book.title as book_title
      from characters
         LEFT JOIN series USING (series_id)
         LEFT JOIN book USING (book_id)
      where characters.name LIKE ?`, [`%${q}%`]);

    const imageSql = db.format(`
      select character_id, image_url
      from characters
      join character_image using (character_id)
      where characters.name LIKE ?
   `, [`%${q}%`]);
    console.log(sql);
    const [characters, images]: Array<any> = await Promise.all([
        db.query(sql),
        db.query(imageSql),
    ]);

    const massaged = characters.map(character => ({
        ...character,
        images: images.filter(image => image.character_id === character.character_id).map(image => image.image_url),
    }));

    res.send(massaged);
});

export default app;
