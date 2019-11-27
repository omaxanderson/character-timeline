import React from 'react';
import { Grid, Column, Median, Alpha, Beta } from '@omaxwellanderson/react-components';

class Search extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
        };
    }
    componentDidMount() {
        this.getSearchData();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { search } = this.props;
        if (prevProps.search !== search) {
            this.getSearchData();
        }
    }

    getSearchData = async () => {
        const { search } = this.props;
        const result = await fetch(`http://localhost:3000/api/search?q=${search}`);
        const data = await result.json();
        this.setState({ data });
    };

    onClick = (name) => {
        console.log('yo');
        window.character = name;
        this.props.onClick();
    }

    getCard = (data) => {
        const { name, series_title, images } = data;
        return (
            <Grid>
                <Column col={8} offset={2}>
                    <div onClick={() => this.onClick(name)} style={{ border: '1px solid black' }}>
                        {images.length > 0 && <img height="100px" src={images[0]} alt={`Image of ${name}`} />}
                        <div>{name}</div>
                        <div>{series_title}</div>
                    </div>
                </Column>
            </Grid>
        )
    };

    render() {
        const { search } = this.props;
        const { data } = this.state;
        return (
            <div>
                {data.map(result => this.getCard(result))}
            </div>
        );
    }
}

export default Search;