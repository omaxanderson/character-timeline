import db from "../database/db";
import {
    getAttributesByCharacterId,
    getCharacterDataById,
    getCharacterIdByName,
    getNotesByCharacterId
} from "./databaseFunctions";

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
    book_number = 1,
    chapter_number = 1,
    include_chapter = true,
} : Params) => {
    const characterId = await getCharacterIdByName(character_name);

    return Promise.all([
        getCharacterDataById(characterId),
        getAttributesByCharacterId(characterId, book_number, chapter_number, include_chapter),
        getNotesByCharacterId(characterId, book_number, chapter_number, include_chapter),
    ]);
};

export default getCharacterData;
