import React from 'react';
import './App.css';
import axios from 'axios';

class App extends React.Component {
  state = {
    data: [],
  };

  componentDidMount() {
    const instance = axios.create({
      baseURL: 'http://localhost:4000',
    });

    instance.get('/').then((resp) => {
      this.setState({
        data: resp.data,
      });
    });
  }

  render() {
    return (
      <div>
        {this.state.data.map((el, key) => {
          return <div>{el.sname}</div>;
        })}
      </div>
    );
  }
}

export default App;
