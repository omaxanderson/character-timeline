import React from 'react';
import ReactDOM from 'react-dom';
import { Select, Grid, Column } from '@omaxwellanderson/react-components';
import '@omaxwellanderson/react-components/dist/main.css';
import '@omaxwellanderson/style/dist/main.css';

class Home extends React.Component {
   render() {
      return (
          <React.Fragment>
              <Grid /* Navbar */>
                  <Column col={12}>
                      <div style={{ height: '60px', backgroundColor: 'red' }}>Navbar</div>
                  </Column>
              </Grid>
              <Grid /* Character Name */>
                  <Column col={2} offset={5}>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <h1>Rand al'Thor</h1>
                      </div>
                  </Column>
                  <Column col={1} offset={1}>
                      <div style={{ display: 'grid', gridTemplateRows: '1fr 2fr 1fr' }}>
                          <div style={{ gridRowStart: '2' }}>
                              <Select>
                                  <option>Book</option>
                                  <option>1</option>
                                  <option>2</option>
                                  <option>3</option>
                                  <option>4</option>
                              </Select>
                          </div>
                      </div>
                  </Column>
                  <Column col={1}>
                      <div style={{ display: 'grid', gridTemplateRows: '1fr 2fr 1fr' }}>
                          <div style={{ gridRowStart: '2' }}>
                              <Select>
                                  <option>Chapter</option>
                                  <option>1</option>
                                  <option>2</option>
                                  <option>3</option>
                                  <option>4</option>
                              </Select>
                          </div>
                      </div>
                  </Column>
              </Grid>
              <Grid /* Text content */>
                  <Column col={6} offset={2}>
                      <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in nibh nunc. In porta fermentum mattis. Pellentesque ultrices tincidunt lacus, nec elementum ante mattis sit amet. Sed sodales elit sit amet ipsum interdum, sed dignissim lacus cursus. Vivamus eget ultricies purus. Morbi dignissim, arcu eu pellentesque malesuada, sapien neque vehicula risus, ac blandit odio ante ac risus. Praesent magna magna, venenatis quis vehicula at, volutpat et nisi. Morbi molestie, libero vitae condimentum gravida, nibh lorem efficitur lorem, at lobortis nisl erat sit amet sapien. Integer auctor mattis felis eget luctus.
                      </p>

                      <p>
                          Cras et molestie dui. Nullam fringilla convallis lorem, non porta mi semper vel. Cras scelerisque facilisis leo, eget congue ligula. Curabitur pellentesque ultricies tortor mollis convallis. Phasellus vitae erat vitae justo ultrices vestibulum. Integer elementum arcu eget posuere eleifend. Pellentesque lacinia tortor ultrices sodales hendrerit.
                      </p>
                  </Column>
                  <Column col={2}>
                      <div style={{ height: '600px', border: '1px solid black' }}></div>
                  </Column>
              </Grid>
          </React.Fragment>
      );
   }
}

ReactDOM.render((
   <Home />
), document.getElementById('Home'));

