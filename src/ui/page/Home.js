import React from 'react';
import ReactDOM from 'react-dom';
import Character from '../components/Character';
import Search from '../components/Search';
import {
    Alpha,
    Beta,
    Column,
    Grid,
    Header,
    Median,
    TextInput,
    FloatingButton,
    Icon,
} from "@omaxwellanderson/react-components";
const navy = '#2E486F';

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

    render() {
        const { page, search } = this.state;
        return (
            <React.Fragment>
                <Grid /* Navbar */>
                    <Column col={12}>
                        <div style={{ color: 'white', paddingLeft: '16px', paddingRight: '16px', backgroundColor: navy }}>
                            <Median spacing="none" verticalAlign>
                                <Alpha>
                                    <Header h={1} spacing="sm">Spoiler Free Zone</Header>
                                </Alpha>
                                <Beta>
                                    <div style={{ display: 'inline-flex' }}>
                                        <div style={{ marginRight: '20px' }}>
                                            <FloatingButton size="small">
                                                <Icon name="add2" size="small" />
                                            </FloatingButton>
                                        </div>
                                        <TextInput onSubmit={this.onSearch} placeholder="Search" />
                                    </div>
                                </Beta>
                            </Median>
                        </div>
                    </Column>
                </Grid>

                {page === 'character' ? <Character /> : <Search onClick={this.onCharacterSelect} search={search} />}
            </React.Fragment>
        )
    }
}

ReactDOM.render((
    <Home />
), document.getElementById('Home'));

