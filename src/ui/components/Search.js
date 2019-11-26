import React from 'react';

class Search extends React.Component {
    render() {
        const { search } = this.props;
        return (
            <div>{search}</div>
        );
    }
}

export default Search;