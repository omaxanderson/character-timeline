import React from 'react';
import ReactDOM from 'react-dom';
import Character from '../components/Character';
import Search from '../components/Search';
import get from 'lodash/get';

class Home extends React.Component {
    render() {
        const page = get(window, 'page', 'character');
        return page === 'character'
            ? <Character />
            : <Search />;
    }
}

ReactDOM.render((
    <Home />
), document.getElementById('Home'));

