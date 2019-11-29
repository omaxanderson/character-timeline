import db from "../database/db";

const getData = async (
    series_id: number,
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

export default getData;
