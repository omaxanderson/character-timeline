import React from 'react';
import ReactDOM from 'react-dom';
import Button from '@omaxwellanderson/react-components';

class Home extends React.Component {
   render() {
      console.log('Button', Button);
      return <Button>Hello!</Button>;
   }
}

ReactDOM.render((
   <Home />
), document.getElementById('Home'));

