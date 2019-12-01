import db, { databaseFactory } from '../database/db';

/***************** SERIES ****************************
/**
 *
 * @param series_id
 * @param columns
 */
export const getSeriesById = async (series_id: number, columns: string[] = []) => {
    const data: { [key: string]: any } = {};
    data.series_title = await getSeriesTitleById(series_id);

    if (columns.includes('books')) {
        // do book stuff
        data.books = await getBooksBySeriesId(series_id, columns.includes('chapters') ? ['chapters'] : []);
    }

    if (columns.includes('characters')) {
        data.characters = await getCharactersBySeriesId(series_id, columns);
    }

    const sql = `SELECT series.title AS series_title, `;
    return data;
};

export const getCharactersBySeriesId = async (series_id: number, columns: string[] = []) => {
    const characters = await db.select(`
        select character_id, name as character_name
        from characters
        where series_id = ?;
    `, [series_id]);

    // TODO make this into a nested for...of loop over the columns
    // Use a mapping somehow to map the sql and property name
    if (columns.includes('notes')) {
        // Using our own db connection to prevent creating and destroying many connections
        const dbConnection = databaseFactory();
        for (const character of characters) {
            try {
                const notes = await dbConnection.query(
                    `select *
                        from note
                        where character_id = ?;`,
                    [character.character_id],
                );
                character.notes = notes;
            } catch (e) {
                dbConnection.closeConnection();
                throw new Error(e);
            }
        }
        dbConnection.closeConnection();
    }

    if (columns.includes('attributes')) {
        // Using our own db connection to prevent creating and destroying many connections
        const dbConnection = databaseFactory();
        for (const character of characters) {
            try {
                const attributes = await dbConnection.query(
                    `select *
                        from custom_attribute
                        where character_id = ?;`,
                    [character.character_id],
                );
                character.attributes = attributes;
            } catch (e) {
                dbConnection.closeConnection();
                throw new Error(e);
            }
        }
        dbConnection.closeConnection();
    }

    return characters;
};

/**
 *
 * @param series_id
 */
export const getSeriesTitleById = async (series_id: number): Promise<string> => {
    try {
        const { title } = await db.fetchOne('SELECT title FROM series WHERE series_id = ?', [series_id]);
        return title;
    } catch (err) {
        return null;
    }
};

/************************** BOOK ****************************
/**
 *
 * @param series_id
 * @param columns
 */
export const getBooksBySeriesId = async (series_id: number, columns: string[] = []) => {
    try {
        const books = await db.select(
            `SELECT book_id, title, book_number
            from series_book
            join book using (book_id)
            where series_id = ?`,
            [series_id],
        );

        if (columns.includes('chapters')) {
            // Using our own db connection to prevent creating and destroying many connections
            const dbConnection = databaseFactory();
            for (const book of books) {
                try {
                    const chapters = await dbConnection.query(
                        `select chapter_id, title as chapter_title, chapter_number from book_chapter
                    join chapter using (chapter_id)
                    where book_id = ?;`,
                        [book.book_id],
                    );
                    book.chapters = chapters;
                } catch (e) {
                    dbConnection.closeConnection();
                    throw new Error(e);
                }
            }
            dbConnection.closeConnection();
        }
        return books;
    } catch (err) {
        return null;
    }
};

/************************** NOTES ****************************
 *
 *
 * @param character_id
 * @param book_number
 * @param chapter_number
 */
export const getNotesByCharacterId = async (
    character_id: number,
    book_number: number = 1,
    chapter_number: number = 1,
    include_chapter: boolean = false,
) => {
    const noteSql = db.format(`
      SELECT note_id, content, book.book_id, book.title AS book_title, book_number, chapter.chapter_number, chapter.title AS chapter_title
      FROM characters
        JOIN note USING (character_id)
        JOIN book ON book.book_id = note.book_id
        JOIN book_chapter ON book.book_id = book_chapter.book_id
        JOIN chapter ON book_chapter.chapter_id = chapter.chapter_id AND note.chapter_number = chapter.chapter_number
      WHERE characters.character_id = ?
      AND book_number <= ?
      AND IF(book_number < ?, 1, chapter.chapter_number <${include_chapter ? '=' : ''} ?)
      ORDER BY book_number DESC, note.chapter_number DESC, note_id DESC
    `, [character_id, book_number, book_number, chapter_number]);

    return db.select(noteSql);
};

export const getAttributesByCharacterId = async (
    character_id: number,
    book_number: number = 1,
    chapter_number: number = 1,
    include_chapter: boolean = false,
) => {
    const attributeSql = db.format(`
      SELECT attribute_name, value, custom_attribute.book_id, custom_attribute.chapter_number
      FROM characters
         JOIN custom_attribute USING (character_id)
         JOIN book ON custom_attribute.book_id = book.book_id
      WHERE characters.character_id = ?
      AND book_number <= ?
      AND IF(book_number < ?, 1, chapter_number <${include_chapter ? '=' : ''} ?)
    `, [character_id, book_number, book_number, chapter_number]);

    return db.select(attributeSql);
};

export const getCharacterImagesById = async (id) => {
    const images = await db.select('SELECT image_url FROM character_image WHERE character_id = ?', [id]);
    return images.map(image => image.image_url);
};

export const getCharacterDataById = async (character_id) => {
    const metaSql = db.format(`
      SELECT characters.character_id, characters.name, series.title, series_id
      FROM characters
        LEFT JOIN series USING (series_id)
      WHERE characters.character_id = ?
   `, [character_id]);

    const [ data, images ] = await Promise.all([
        db.select(metaSql),
        getCharacterImagesById(character_id),
    ]);

    return {
        ...data,
        images,
    };
};

export const getCharacterIdByName = async (name) => {
    const { character_id } = await db.fetchOne(
        `SELECT character_id
        FROM characters
        WHERE name = ?`,
        [name],
    );
    return character_id;
};

export const getCharacterNameById = async (id) => {
    const { name } = await db.fetchOne(
        `SELECT name
        FROM characters
        WHERE character_id = ?`,
        [id],
    );
    return name;
};