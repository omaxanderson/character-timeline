import React from 'react';
import { Median, Alpha, Beta } from '@omaxwellanderson/react-components';

const Note = (props) => {
    const {
        note,
    } = props;

    return (
        <div key={`note_${note.note_id}`} style={{ padding: '10px', border: '1px solid #CCCCCC', marginBottom: '20px' }}>
            <Median spacing="none">
                <Alpha>{note.book_id}.{note.chapter_number}</Alpha>
                <Beta>{note.book_title} - <span style={{ color: '#777' }}>{note.chapter_title}</span></Beta>
            </Median>
            <p style={{ marginBottom: '0px'}}>{note.content}</p>
        </div>
    );
};

export default Note;