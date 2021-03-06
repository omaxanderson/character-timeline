import React from 'react';
import ReactDOM from 'react-dom';
import Character from '../components/Character';
import Search from '../components/Search';
import Navbar from '../components/Navbar';
import AddCharacter from '../components/AddCharacter';
import AddSeries from "../components/AddSeries";
import AddBook from "../components/AddBook";
import AddChapter from "../components/AddChapter";

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            page: 'character',
            search: '',
        }
    }

    onSearch = (value) => {
        this.setState({ page: 'search', search: value });
    };

    onCharacterSelect = () => {
        console.log('nice');
        this.setState({ page: 'character' });
    };

    onAddClick = (selection) => {
        this.setState({ page: `add${selection}` });
    };

    render() {
        const { page, search } = this.state;
        return (
            <React.Fragment>
                <Navbar onSearch={this.onSearch} onAddClick={this.onAddClick}/>
                {page === 'character' && <Character />}
                {page === 'search' && <Search onClick={this.onCharacterSelect} search={search} />}
                {page === 'addCharacter' && <AddCharacter />}
                {page === 'addSeries' && <AddSeries />}
                {page === 'addBook' && <AddBook />}
                {page === 'addChapter' && <AddChapter />}
            </React.Fragment>
        )
    }
}

ReactDOM.render((
    <Home />
), document.getElementById('Home'));

