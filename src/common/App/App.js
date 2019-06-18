import React from 'react';
import { root, branch } from 'baobab-react/higher-order';
import { Container, Spinner } from 'react-bootstrap';
import { Switch, Route, Router } from 'react-router';
import { Link, Redirect } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import Cookies from 'js-cookie';
import 'dotenv/config';
import { axs } from '@axios';

import LoginPage from '@views/loginPage';
import MainPage from '@views/mainPage';
import Header from '@views/header';

import store, { PARAMS } from '../store/index';
import { authStatus, isAuthInProgress } from '@act';

const history = createBrowserHistory();

class App extends React.Component {
  componentDidMount() {
    this.checkAuth();
    if (Cookies.get('token') !== undefined) {
      setInterval(() => this.checkAuth(), 25000);
    }
  }

  checkAuth() {
    axs
      .get('/api/checkToken/', { headers: { 'x-access-token': Cookies.get('token') } })
      .then((res) => {
        if (res.status === 200) {
          this.props.dispatch(authStatus, true);
          this.props.dispatch(isAuthInProgress, false);
        } else {
          this.props.dispatch(authStatus, false);
          this.props.dispatch(isAuthInProgress, false);
        }
      })
      .catch((err) => {
        this.props.dispatch(authStatus, false);
        this.props.dispatch(isAuthInProgress, false);
      });
  }

  getUserInfo(){
    axs.get('api/getUserInfo/', )
  }

  render() {
    const PrivateRoute = ({ component: Component, ...rest }) => {
      return (
        <Route
          {...rest}
          render={(props) => {
            this.checkAuth();

            return this.props.isUserAuthorized ? (
              <Component {...props} />
            ) : (
              <Redirect
                to={{
                  pathname: '/login',
                  state: { from: props.location },
                }}
              />
            );
          }}
        />
      );
    };
    return (
      <Router history={history}>
        <Container>
          <Header />
          ШАПКА
          <Link to='/login'>Вход</Link>
          <Link to='/'>Главная</Link>
          <Link to='/secret'>Секрет</Link>
        </Container>
        <Container>
          <Switch>
            {this.props.isAuthInProgress ? (
              <Spinner animation='border' role='status'>
                <span className='sr-only'>Loading...</span>
              </Spinner>
            ) : (
              <>
                <Route exact path='/' component={MainPage} />
                <Route exact path='/login' component={LoginPage} />
                <PrivateRoute exact path='/secret' component={() => <div>секретная страница</div>} />
              </>
            )}
          </Switch>
        </Container>
        <Container>ФУТЕР</Container>
      </Router>
    );
  }
}

export default root(
  store,
  branch(
    {
      isAuthInProgress: PARAMS.IS_AUTH_IN_PROGRESS,
      isUserAuthorized: PARAMS.IS_USER_AUTHORIZED,
    },
    App,
  ),
);
