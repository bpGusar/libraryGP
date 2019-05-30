import React from 'react';
import { root, branch } from 'baobab-react/higher-order';
import axios from 'axios';

import store, { PARAMS } from '../store/index';

import s from './index.module.css';
import Button from 'react-bootstrap/Button';

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
        <Button>dsfgds</Button>
        {this.state.data.map((el, key) => {
          return (
            <div className={s.app} key={el._id}>
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
