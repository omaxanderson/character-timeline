import React from 'react';
import PropTypes from 'prop-types';
import {
    Alpha,
    Beta,
    Column,
    FloatingButton,
    Grid,
    Header,
    Icon,
    Median,
    TextInput,
    Popover,
    Menu,
} from "@omaxwellanderson/react-components";
const navy = '#2E486F';

class Navbar extends React.Component {
    onAddClick = (selection) => {
        const { onAddClick } = this.props;
        onAddClick(selection);
        switch (selection) {
            case 'Character':
                console.log('adding a new character');
                break;
            case 'Book':
                console.log('adding a new book');
                break;
            case 'Series':
                console.log('adding a new Series');
                break;
            default:
                console.log('invalid selection');
        }
    };

    render() {
        const { onSearch } = this.props;
        return (
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
                                        <Popover>
                                            <FloatingButton size="small" light>
                                                <Icon name="add2" size="small" />
                                            </FloatingButton>
                                            <Menu
                                                options={[
                                                    'Character',
                                                    'Book',
                                                    'Series',
                                                ]}
                                                 onClick={this.onAddClick}
                                            />
                                        </Popover>
                                    </div>
                                    <TextInput onSubmit={onSearch} placeholder="Search" />
                                </div>
                            </Beta>
                        </Median>
                    </div>
                </Column>
            </Grid>
        )
    }
}

Navbar.propTypes = {
    onAddClick: PropTypes.func,
};

Navbar.defaultProps = {
    onAddClick: () => {},
};

export default Navbar;
