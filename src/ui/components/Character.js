import React from 'react';
import get from 'lodash/get';
import {
    Select,
    Row,
    Column,
    Median,
    Alpha,
    Beta,
    TextInput,
    Header,
    Button,
    TextArea,
} from '@omaxwellanderson/react-components';
import '@omaxwellanderson/react-components/dist/main.css';
import '@omaxwellanderson/style/dist/main.css';

// color palette
// navy 2e486f
// purp 3d3374
// green 266c5e
const navy = '#2E486F';
const purple = '#3d3374';
const green = '#266c5e';

class Character extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: {},
            // TODO initialize this with localstorage
            book_number: 1,
            chapter_number: 1,
            series_info: [],
            isAddingNote: false,
        };

        this.noteAddRef = React.createRef();
    }

    componentDidMount() {
        // make backend request
        Promise.all([
            this.getCharacterData(),
            this.getSeriesMetadata(),
        ]).then(this.setDefaultVals);
    }

    setDefaultVals = () => {
        const { data } = this.state;
        const { title: series_title, name: character_name } = get(data, 'meta', {});

        if (!series_title || !character_name) {
            return;
        }

        const { book, chapter } = (() => {
            if (typeof Storage !== 'undefined') {
                const result = localStorage.getItem(`${series_title}:${character_name}`);
                return result ? JSON.parse(result) : {};
            }
            return {};
        })();
        console.log('book', book);
        console.log('chapter', chapter);

        this.setState(Object.assign(
            {},
            book !== undefined ? { book_number: book }: {},
            chapter !== undefined ? { chapter_number: chapter } : {}
        ), this.getCharacterData);
    };

    getSeriesMetadata = async () => {
        const { character } = window;
        const result = await fetch(`http://localhost:3000/api/character/${character}/series?`);
        const data = await result.json();
        this.setState({ series_info: data });
    };

    getCharacterData = async () => {
        console.log('getting that shit');
        const { character } = window;
        const { book_number, chapter_number } = this.state;

        if (isNaN(book_number) || isNaN(chapter_number)) {
            return;
        }

        const results = await fetch(
            `http://localhost:3000/api/character/${character}?book_number=${book_number}&chapter_number=${chapter_number}`
        );
        const data = await results.json();
        this.setState({ data });
    };

    getFirstChapter = (book_number) => {
        const { series_info } = this.state;
        const book = series_info.find(b => b.book_number === book_number);
        if (!book) {
            return 1;
        }
        const minFarshaw = book.chapters.reduce(
            (acc, cur) => cur.chapter_number < acc ? cur.chapter_number : acc,
            book.chapters.length,
        );
        return minFarshaw;
    };

    storeInfo = () => {
        const {
            data: { meta: { name: character_name, title: series_title }},
            book_number,
            chapter_number,
        } = this.state;
        if (typeof Storage !== 'undefined') {
            // set character, book, chapter
            localStorage.setItem(
                `${series_title}:${character_name}`,
                JSON.stringify({ chapter: chapter_number, book: book_number }),
            );
        }
    };

    onChange = (e, varToChange) => {
        const { value } = e.target;
        // if changing books, flip chapter back to 1
        this.setState(
            {
                [`${varToChange}`]: parseInt(value, 10),
                ...(varToChange === 'book_number'
                        ? { chapter_number: this.getFirstChapter(parseInt(value, 10)) }
                        : {}
                ),
            },
            () => {
                this.getCharacterData();
                this.storeInfo();
            }
        );
    };

    onNoteAdd = async () => {
        const content = get(this.noteAddRef, 'current.value', '');
        const {
            chapter_number,
            book_number,
        } = this.state;
        const character_id = get(this.state, 'data.meta.character_id', 0);
        const series_id = get(this.state, 'data.meta.series_id', 0);
        if (!character_id || !series_id) {
            console.error('what the fuck man');
            return null;
        }
        const results = await fetch('/api/note', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({
                chapter_number,
                book_number,
                character_id,
                series_id,
                content,
            }),
        });
        this.setState({ isAddingNote: false });
        console.log('results', results);
        this.getCharacterData();
    };

    render() {
        const {
            data,
            series_info: books,
            book_number,
            chapter_number,
            isAddingNote,
        } = this.state;
        const book = books.find(book => book.book_number === book_number) || {};
        const chapter_name = get(get(book, 'chapters', []).find(c => c.chapter_number === chapter_number), 'chapter_title');
        console.log(chapter_name);
        const chapters = (get(book, 'chapters', []) || [])
            .sort((a, b) => a.chapter_number - b.chapter_number)
            .map(chapter => (
                <option
                    value={chapter.chapter_number}
                    selected={chapter.chapter_number === chapter_number}
                    key={`chapter_${chapter.chapter_number}`}
                >
                    {chapter.chapter_number} - {chapter.chapter_title}
                </option>
            ));

        return (
            <React.Fragment>
                <Row>
                    <Column col={2} offset={2} /* Book Select */>
                        <div style={{ display: 'Row', RowTemplateRows: '1fr 2fr 1fr' }}>
                            <div style={{ RowRowStart: '2' }}>
                                <Select value={book_number} onChange={(e) => this.onChange(e, 'book_number')}>
                                    <option>Book</option>
                                    {books.map(book => (
                                        <option
                                            value={book.book_number}
                                            selected={book.book_number === book_number}
                                            key={`book_${book.book_number}`}
                                        >
                                            {book.book_number} - {book.book_title}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                    </Column>
                    <Column col={2} offset={1} /* Character Name */>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Header h={1} noSpacing>{get(data, 'meta.name', '')}</Header>
                        </div>
                    </Column>
                    <Column col={2} offset={1} /* Chapter Select */>
                        <div style={{ display: 'Row', RowTemplateRows: '1fr 2fr 1fr' }}>
                            <div style={{ RowRowStart: '2' }}>
                                <Select value={chapter_number} onChange={(e) => this.onChange(e, 'chapter_number')}>
                                    <option>Chapter</option>
                                    {chapters}
                                </Select>
                            </div>
                        </div>
                    </Column>
                </Row>
                <Row /* Series Title */>
                    <Column col={6} offset={3}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0' }}>
                            <Header h={4} spacing="sm">{get(data, 'meta.title', '')}</Header>
                        </div>
                    </Column>
                </Row>
                <Row /* Add Notes */>
                    <Column col={6} offset={2}>
                        <div style={{ marginBottom: '10px' }}>
                            <Button onClick={() => this.setState({ isAddingNote: !this.state.isAddingNote })}>Add Note</Button>
                        </div>
                    </Column>
                </Row>
                <Row>
                    <Column col={6} offset={2} /* Note area */>
                        {isAddingNote && (
                            <React.Fragment>
                                <TextArea ref={this.noteAddRef}/>
                                <Button onClick={this.onNoteAdd}>Submit</Button>
                            </React.Fragment>
                        )}
                        {get(data, 'notes', []).length ? get(data, 'notes', []).map((note) => (
                                <div key={`note_${note.note_id}`} style={{ padding: '10px', border: '1px solid #777777', marginBottom: '20px' }}>
                                    <div>
                                        Book: {note.book_id}
                                    </div>
                                    <div>
                                        Chapter: {note.chapter_number}
                                    </div>
                                    <p>{note.content}</p>
                                </div>
                            )) :
                            <div>
                                There are no notes for {get(data, 'meta.name', 'this character')} in {chapter_name} yet!
                                Go ahead and add some notes to help yourself and fellow readers out.
                            </div>
                        }
                    </Column>
                    <Column col={2}>
                        <div style={{ padding: '10px', border: '1px solid black' }}>
                            <img
                                src={get(data, 'meta.image_url', '')}
                                width="100%"
                            />
                            <div>Location: Emond's Field</div>
                            <div>Age: 17</div>
                        </div>
                    </Column>
                </Row>
            </React.Fragment>
        );
    }
}

export default Character;
