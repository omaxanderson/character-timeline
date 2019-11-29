import db from "../database/db";

interface Params {
    character_name: string;
    series_id?: number;
    book_id?: number;
    book_number?: number;
    chapter_number?: number;
    include_chapter?: boolean;
};

const getCharacterData = async ({
    character_name,
    series_id = 0,
    book_id = 0,
    book_number = 1,
    chapter_number = 1,
    include_chapter = true,
} : Params) => {
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
      ORDER BY book_number DESC, chapter_number DESC, note_id DESC
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
      SELECT characters.character_id, characters.name, series.title, series_id, image_url
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

export default getCharacterData;
