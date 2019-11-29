import React from 'react';
import {
    Row,
    Column,
    Header,
    Align,
    TextInput,
    Button,
} from '@omaxwellanderson/react-components';

class AddSeries extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
        };
    }

    onSeriesNameChange = (e, value) => {
        this.setState({ name: value });
    };

    onSubmit = async () => {
        const { name } = this.state;

        const results = await fetch('/api/series', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                series_name: name,
            }),
        });
    };

    render() {
        return (
            <div>
                <Row>
                    <Column col={6} offset={3}>
                        <Align horizontal>
                            <Header h={1}>Add Series</Header>
                        </Align>
                    </Column>
                </Row>
                <Row>
                    <Column col={8} offset={2}>
                        <TextInput label="Series Name" onChange={this.onSeriesNameChange}/>
                    </Column>
                </Row>
                <Row>
                    <Column col={8} offset={2}>
                        <Button onClick={this.onSubmit}>Submit</Button>
                    </Column>
                </Row>
            </div>
        );
    }
}

export default AddSeries;