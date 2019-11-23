import React from 'react';
import ReactDOM from 'react-dom';
import get from 'lodash/get';
import { Select, Grid, Column } from '@omaxwellanderson/react-components';
import '@omaxwellanderson/react-components/dist/main.css';
import '@omaxwellanderson/style/dist/main.css';
import util from 'util';

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: {},
            // TODO initialize this with localstorage
            book_number: 1,
            chapter_number: 1,
            series_info: [],
        };
    }

    componentDidMount() {
        // make backend request
        this.getCharacterData();
        this.getSeriesMetadata();
    }

    getSeriesMetadata = async () => {
        const { character } = window;
        const result = await fetch(`http://localhost:3000/api/character/${character}/series?`);
        const data = await result.json();
        this.setState({ series_info: data });
    };

    getCharacterData = async () => {
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

    onBookChange = (e) => {
        const { value } = e.target;
        this.setState({ book_number: parseInt(value, 10) }, this.getCharacterData);
    };

    onChapterChange = (e) => {
        const { value } = e.target;
        this.setState({ chapter_number: parseInt(value, 10) }, this.getCharacterData);
    };

    render() {
        const { data, series_info: books, book_number } = this.state;
        const book = books.find(book => book.book_number === book_number) || {};
        const chapters = get(book, 'chapters', [])
            .sort((a, b) => a.chapter_number - b.chapter_number)
            .map(chapter => <option value={chapter.chapter_number}>{chapter.chapter_number} - {chapter.chapter_title}</option>);
        console.log('chaps', chapters);
        /*
        const chapters = (() => {
            const arr = [];
            for (let i = 0; i < num_chapters; i++) {
                arr.push(<option>{i}</option>);
            }
            return arr;
        })();
         */
        console.log('num chaps', chapters);
        return (
            <React.Fragment>
                <Grid /* Navbar */>
                    <Column col={12}>
                        <div style={{ height: '60px', backgroundColor: 'red' }}>Navbar</div>
                    </Column>
                </Grid>
                <Grid /* Character Name */>
                    <Column col={2} offset={2}>
                        <div style={{ display: 'grid', gridTemplateRows: '1fr 2fr 1fr' }}>
                            <div style={{ gridRowStart: '2' }}>
                                <Select onChange={this.onBookChange}>
                                    <option>Book</option>
                                    {books.map(book => <option>{book.book_number} - {book.book_title}</option>)}
                                </Select>
                            </div>
                        </div>
                    </Column>
                    <Column col={2} offset={1}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <h1>{get(data, 'meta.name', '')}</h1>
                        </div>
                    </Column>
                    <Column col={2} offset={1}>
                        <div style={{ display: 'grid', gridTemplateRows: '1fr 2fr 1fr' }}>
                            <div style={{ gridRowStart: '2' }}>
                                <Select onChange={this.onChapterChange}>
                                    <option>Chapter</option>
                                    {chapters}
                                </Select>
                            </div>
                        </div>
                    </Column>
                </Grid>
                <Grid /* Series Title */>
                    <Column col={6} offset={3}>
                        <h4 style={{ display: 'flex', justifyContent: 'center', marginTop: '0' }}>
                            {get(data, 'meta.title', '')}
                        </h4>
                    </Column>
                </Grid>
                <Grid /* Text content */>
                    <Column col={6} offset={2}>
                        {get(data, 'notes', []).map((note) => {
                            return (
                                <div style={{ padding: '10px', border: '1px solid #777777', marginBottom: '20px' }}>
                                    <div>
                                        Book: {note.book_id}
                                    </div>
                                    <div>
                                        Chapter: {note.chapter_number}
                                    </div>
                                    <p>{note.content}</p>
                                </div>
                            );
                        })}
                    </Column>
                    <Column col={2}>
                        <div style={{ padding: '10px', border: '1px solid black' }}>
                            <img
                                //src="https://vignette.wikia.nocookie.net/wot/images/5/57/Rand_al%27thor_by_reddera-d761cuv_%281%29.jpg/revision/latest?cb=20160605153830"
                                src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/53a4419a-a77b-48a9-8518-9f8858732d52/d993rru-1284d359-133e-4a12-a46f-8e5794a58f3a.jpg/v1/fill/w_800,h_1000,q_75,strp/egwene_al_vere__the_flame_of_tar_valon_by_reddera_d993rru-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTAwMCIsInBhdGgiOiJcL2ZcLzUzYTQ0MTlhLWE3N2ItNDhhOS04NTE4LTlmODg1ODczMmQ1MlwvZDk5M3JydS0xMjg0ZDM1OS0xMzNlLTRhMTItYTQ2Zi04ZTU3OTRhNThmM2EuanBnIiwid2lkdGgiOiI8PTgwMCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.yWQqlrOPTNOOK7mMUrUSl-boLdTZ0ot2lUrWrDlg8zU"
                                width="100%"
                            />
                            <div>Location: Emond's Field</div>
                            <div>Age: 17</div>
                        </div>
                    </Column>
                </Grid>
            </React.Fragment>
        );
    }
}

ReactDOM.render((
    <Home />
), document.getElementById('Home'));

