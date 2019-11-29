import React from 'react';
import {
    Button,
    Column,
    Grid,
    Header,
    TextInput,
    Switch,
} from "@omaxwellanderson/react-components";

class AddCharacter extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            characterName: '',
            seriesName: '',
            bookName: '',
            bookNumber: 0,
            isSeries: true,
        };
    }
    onSubmit = async () => {
        const {
            characterName,
            seriesName,
            bookName,
            isSeries,
        } = this.state;
        console.log('info');
        console.log('Character name:', characterName);
        console.log('Series Name:', seriesName);
        console.log('Book name:', bookName);
        console.log('isSeries', isSeries);
        const results = await fetch('/api/character', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({
                series_name: seriesName,
                character_name: characterName,
                is_series: isSeries,
            }),
        });
    };

    onValueChange = (varName, value) => {
        this.setState({ [varName]: value });
    }

    onSwitch = (isSeries) => {
        console.log('val', isSeries);
        this.setState({ isSeries });
    }

    render() {
        const { isSeries } = this.state;
        const label = isSeries ? 'Series' : 'Book';
        const rowStyles = { marginBottom: '20px' };
        return (
            <div>
                <Grid>
                    <Column col={4} offset={4} >
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Header h={1}>
                                Add Character
                            </Header>
                        </div>
                    </Column>
                </Grid>
                <Grid>
                    <Column col={8} offset={2} style={{ ...rowStyles, ...{ display: 'flex', alignItems: 'center', transform: 'translateY(7px)' }}}>
                        <Switch default={isSeries} onChange={this.onSwitch} labelOn="Series" labelOff="Book" />
                    </Column>
                </Grid>
                <Grid>
                    <Column col={isSeries ? 4 : 8} offset={2} style={rowStyles}>
                        <TextInput
                            label={label}
                            onChange={(e, value) => this.onValueChange(`${label.toLowerCase()}Name`, value)}
                        />
                    </Column>
                    {isSeries && (
                        <Column col={4}>
                            <TextInput
                                label="Book Number"
                                onChange={(e, value) => this.onValueChange('bookNumber', value)}
                            />
                        </Column>
                    )}
                </Grid>
                <Grid>
                    <Column col={4} offset={2} style={rowStyles}>
                        <TextInput
                            label="Name"
                            onChange={(e, value) => this.onValueChange('characterName', value)}
                        />
                    </Column>
                </Grid>
                <Grid>
                    <Column col={8} offset={2} style={rowStyles}>
                        <div style={{ marginTop: '15px' }}>
                            <Button onClick={this.onSubmit}>Submit</Button>
                        </div>
                    </Column>
                </Grid>
            </div>
        );
    }
}

export default AddCharacter;