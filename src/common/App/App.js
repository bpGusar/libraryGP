import React from 'react';
import { root, branch } from 'baobab-react/higher-order';
import { Container } from 'react-bootstrap';
import { Switch, Route, Router } from 'react-router';
import { Link } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import LoginPage from '@views/loginPage';
import MainPage from '@views/mainPage';

import store, { PARAMS } from '../store/index';

import withAuth from '../../views/withAuth';

require('dotenv').config();

const history = createBrowserHistory();

class App extends React.Component {
  render() {
    return (
      <Router history={history}>
        <Container>
          ШАПКА
          <Link to='/login'>Вход</Link>
          <Link to='/'>Главная</Link>
          <Link to='/secret'>Секрет</Link>
          <Switch>
            <Route exact path='/' component={MainPage} />
            <Route exact path='/login' component={withAuth(LoginPage, false)} />
            <Route
              exact
              path='/secret'
              component={withAuth(
                () => (
                  <div>секретная страница</div>
                ),
                true,
              )}
            />
          </Switch>
          ФУТЕР
        </Container>
      </Router>
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
