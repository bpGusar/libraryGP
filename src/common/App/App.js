import React from 'react';
import { root, branch } from 'baobab-react/higher-order';
import { Container } from 'react-bootstrap';
import { Switch, Route, Router } from 'react-router';
import { createBrowserHistory } from 'history';

import MainPage from '@views/mainPage';

import store, { PARAMS } from '../store/index';

const history = createBrowserHistory();

class App extends React.Component {
  render() {
    return (
      <Container>
        <Router history={history}>
          <Switch>
            <Route path='/' component={MainPage} />
          </Switch>
        </Router>
      </Container>
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
