import React from 'react';

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
    }

    render() {
        const { search } = this.props;
        const { data } = this.state;
        return (
            <div>
                {data.map(result => <div>{JSON.stringify(result, null, 2)}</div>)}
            </div>
        );
    }
}

export default Search;