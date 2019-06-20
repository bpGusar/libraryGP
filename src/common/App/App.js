import React from 'react';
import { root, branch } from 'baobab-react/higher-order';
import { Container, Spinner, Row, Col, Card } from 'react-bootstrap';
import { Switch, Route, Router } from 'react-router';
import { Redirect } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import 'dotenv/config';
import { axs } from '@axios';

import LoginPage from '@views/loginPage';
import MainPage from '@views/mainPage';
import Header from '@views/header';

import store, { PARAMS } from '../store/index';
import { authStatus, isAuthInProgress, setUserInfo } from '@act';

const history = createBrowserHistory();

class App extends React.Component {
  componentDidMount() {
    if (localStorage.getItem('token') !== undefined) {
      this.checkAuth();
      this.getUserInfo();
    } else {
      this.props.dispatch(authStatus, false);
      this.props.dispatch(isAuthInProgress, false);
    }
  }

  checkAuth() {
    axs
      .get('/checkAuthStatus/')
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

  getUserInfo() {
    axs
      .get('/getUserInfo/')
      .then((res) => {
        this.props.dispatch(setUserInfo, res.data.login);
      })
      .catch((err) => {});
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
        </Container>
        <Container className='mt-3 mb-3'>
          <Row>
            <Col lg={12}>
              <Card>
                <Switch>
                  {this.props.isAuthInProgress || this.props.pageLoaded ? (
                    <div className='m-3'>
                      <Spinner animation='border' variant='danger' />
                    </div>
                  ) : (
                    <div className='m-3'>
                      <Route exact path='/' component={MainPage} />
                      <Route exact path='/login' component={LoginPage} />
                      <PrivateRoute exact path='/secret' component={() => <div>секретная страница</div>} />
                    </div>
                  )}
                </Switch>
              </Card>
            </Col>
          </Row>
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
      pageLoaded: PARAMS.LOADED,
      isUserAuthorized: PARAMS.IS_USER_AUTHORIZED,
    },
    App,
  ),
);
