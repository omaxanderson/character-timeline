import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Grid, GridColumn } from '@omaxwellanderson/react-components';
import '@omaxwellanderson/react-components/dist/main.css';
import '@omaxwellanderson/style/dist/main.css';

class Home extends React.Component {
   render() {
      return (
          <React.Fragment>
              <Grid>
                  <GridColumn col={12}>
                      <div style={{ height: '60px', backgroundColor: 'red' }}>Navbar</div>
                  </GridColumn>
              </Grid>
              <Grid>
                  <GridColumn col={8} offset={2}>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <h1>Rand al'Thor</h1>
                      </div>
                  </GridColumn>
              </Grid>
          </React.Fragment>
      );
   }
}

ReactDOM.render((
   <Home />
), document.getElementById('Home'));

