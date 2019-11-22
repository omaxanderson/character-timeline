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
                          <h1>Egwene al'Vere</h1>
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
                      <div style={{ height: '600px', border: '1px solid black' }}>
                          <img
                              //src="https://vignette.wikia.nocookie.net/wot/images/5/57/Rand_al%27thor_by_reddera-d761cuv_%281%29.jpg/revision/latest?cb=20160605153830"
                              src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/53a4419a-a77b-48a9-8518-9f8858732d52/d993rru-1284d359-133e-4a12-a46f-8e5794a58f3a.jpg/v1/fill/w_800,h_1000,q_75,strp/egwene_al_vere__the_flame_of_tar_valon_by_reddera_d993rru-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTAwMCIsInBhdGgiOiJcL2ZcLzUzYTQ0MTlhLWE3N2ItNDhhOS04NTE4LTlmODg1ODczMmQ1MlwvZDk5M3JydS0xMjg0ZDM1OS0xMzNlLTRhMTItYTQ2Zi04ZTU3OTRhNThmM2EuanBnIiwid2lkdGgiOiI8PTgwMCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.yWQqlrOPTNOOK7mMUrUSl-boLdTZ0ot2lUrWrDlg8zU"
                              width="100%"
                          />
                          <div>Location: Emond's Field</div>
                          <div>Age: 17</div>
                      </div>
                  </Column>
              </Grid>
          </React.Fragment>
      );
   }
}

ReactDOM.render((
   <Home />
), document.getElementById('Home'));

