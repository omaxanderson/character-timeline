import React from 'react';
import debounce from 'lodash/debounce';
import {
    Button,
    Column,
    Row,
    Header,
    TextInput,
    Menu,
    Popover,
    Select,
} from "@omaxwellanderson/react-components";

class AddChapter extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            seriesName: '',
            chapterName: '',
            chapterNumber: '',
            seriesOptions: [],
            selectedSeries: {},
            book: {},
        };
    }

    onSubmit = async () => {
        const {
            selectedSeries,
            chapterName,
            chapterNumber,
            book,
        } = this.state;
        console.log('selectedSeries',selectedSeries);
        console.log('chapterName', chapterName);
        console.log('chapterNumber', chapterNumber);
        console.log('book', book);
        /*
        const results = await fetch('/api/character', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({
                series_name: seriesName,
            }),
        });
         */

        // TODO display an error or success message
    };

    searchSeries = async (value) => {
        const results = await fetch(`/api/series?q=${value}&columns=books`);
        const data = await results.json();
        this.setState({ seriesOptions: data });
    };

    debouncedSearch = debounce(this.searchSeries, 500);

    onValueChange = (name, value) => {
        if (name === 'seriesName') {
            this.debouncedSearch(value);
        } else if (name === 'chapterNumber') {
            if (!isNaN(value)) { // gotta love those double negatives
                this.setState({ chapterNumber: value });
            }
            return;
        }
        this.setState({ [name]: value });
    };

    onSeriesSelect = (value) => {
        const { seriesOptions } = this.state;
        const series = seriesOptions.find(s => s.title === value);
        this.setState({ selectedSeries: series, seriesName: value });
    };

    onBookSelect = (e) => {
        const { value } = e.target;
        const { seriesOptions, selectedSeries } = this.state;
        const series = seriesOptions.find(s => s.title === selectedSeries.title);
        const book = series.books.find(book => book.title === value);
        this.setState({ book });
    };

    render() {
        const {
            seriesOptions,
            selectedSeries,
            seriesName,
            chapterNumber,
        } = this.state;
        const series = seriesOptions.find(s => s.title === selectedSeries.title);
        const rowStyles = { marginBottom: '20px' };
        return (
            <div>
                <Row>
                    <Column col={4} offset={4} >
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Header h={1}>
                                Add Character
                            </Header>
                        </div>
                    </Column>
                </Row>
                <Row>
                    <Column col={7} offset={2} style={rowStyles}>
                        <Popover
                            isOpen={seriesOptions.length > 0 && selectedSeries.series_id === undefined}
                        >
                            <TextInput
                                label="Series"
                                onChange={(e, value) => this.onValueChange('seriesName', value)}
                                value={seriesName}
                            />
                            <Menu
                                options={seriesOptions.map(opt => opt.title)}
                                onClick={this.onSeriesSelect}
                            />
                        </Popover>
                    </Column>
                    <Column col={1} style={{ display: 'flex', alignItems: 'center' }}>
                        <Button onClick={() => this.setState({ selectedSeries: {}, seriesName: '', seriesOptions: [] })}>Clear</Button>
                    </Column>
                </Row>
                { selectedSeries.series_id !== undefined && (
                    <Row>
                        <Column col={4} offset={2} style={rowStyles}>
                            <Select onChange={this.onBookSelect}>
                                <option>Select Book</option>
                                {series?.books?.map(book => <option>{book.title}</option>)}
                            </Select>
                        </Column>
                    </Row>
                )}
                <Row>
                    <Column col={4} offset={2} style={rowStyles}>
                        <TextInput
                            label="Chapter Name"
                            onChange={(e, value) => this.onValueChange('chapterName', value)}
                        />
                    </Column>
                    <Column col={4} style={rowStyles}>
                        <TextInput
                            label="Chapter Number"
                            onChange={(e, value) => this.onValueChange('chapterNumber', value)}
                            value={chapterNumber}
                        />
                    </Column>
                </Row>
                <Row>
                    <Column col={8} offset={2} style={rowStyles}>
                        <div style={{ marginTop: '15px' }}>
                            <Button onClick={this.onSubmit}>Submit</Button>
                        </div>
                    </Column>
                </Row>
            </div>
        );
    }
}

export default AddChapter;
