import React from 'react';
import PropTypes from 'prop-types';
import {
    Alpha,
    Beta,
    Column,
    FloatingButton,
    Row,
    Header,
    Icon,
    Median,
    TextInput,
    Popover,
    Menu,
} from "@omaxwellanderson/react-components";
import '@omaxwellanderson/react-components/dist/main.css';
import '@omaxwellanderson/style/dist/main.css';
const navy = '#2E486F';

class Navbar extends React.Component {
    onAddClick = (selection) => {
        const { onAddClick } = this.props;
        onAddClick(selection);
    };

    render() {
        const { onSearch } = this.props;
        return (
            <Row spacing="md"/* Navbar */>
                <Column col={12}>
                    <div style={{ color: 'white', paddingLeft: '16px', paddingRight: '16px', backgroundColor: navy }}>
                        <Median spacing="none" verticalAlign>
                            <Alpha>
                                <Header h={1} spacing="md">Spoiler Free Zone</Header>
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
                                                    'Chapter',
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
            </Row>
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
