import React from 'react';
import { root, branch } from 'baobab-react/higher-order';
import axios from 'axios';

import store, { PARAMS } from '../store/index';

import s from './App.css';

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
    console.log(this.props.loaded);
    return (
      <div>
        {this.state.data.map((el, key) => {
          return (
            <div className={s.App} key={el._id}>
              {el.sname}
            </div>
          );
        })}
      </div>
    );
  }
}

export default root(
  store,
  branch(
    {
      loaded: PARAMS.LOADED,
    },
    App,
  ),
);
