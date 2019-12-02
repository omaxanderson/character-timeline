import React from 'react';
import ReactDOM from 'react-dom'
import Navbar from '../components/Navbar';
import AddSeries from '../components/AddSeries';

const AddSeriesPage = () => {
    return (
        <React.Fragment>
            <Navbar />
            <AddSeries />
        </React.Fragment>
    )
};

ReactDOM.render(<AddSeriesPage />, document.getElementById('AddSeries'));
