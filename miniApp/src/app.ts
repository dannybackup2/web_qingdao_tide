import { Component } from 'react';
import './app.scss';

class App extends Component {
  componentDidMount() {
    console.log('Qingdao Tide MiniApp started');
  }

  render() {
    return this.props.children;
  }
}

export default App;
