import React from "react";
import { root, branch } from "baobab-react/higher-order";
import { Switch, Route, Router } from "react-router";
import { Segment, Dimmer, Loader, Image, Container } from "semantic-ui-react";
import { createBrowserHistory } from "history";
import "dotenv/config";

import LoginPage from "@views/LoginPage";
import MainPage from "@views/MainPage";
import Header from "@views/Header";
import AddBookPage from "@views/AddBookPage";
import AccessDenied from "@views/AccessDenied";
import axs from "@axios";

import store, { PARAMS } from "@store";
import { authStatus, isAuthInProgress, setUserInfo } from "@act";

const history = createBrowserHistory();

class App extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    if (localStorage.getItem("token") !== null) {
      this.checkAuth();
      this.getUserInfo();
    } else {
      dispatch(authStatus, false);
      dispatch(isAuthInProgress, false);
    }
  }

  getUserInfo() {
    const { dispatch } = this.props;
    axs()
      .post("/getUserInfo/")
      .then(res => {
        dispatch(setUserInfo, res.data.user);
      })
      .catch(err => {
        console.error(err);
      });
  }

  checkAuth() {
    const { dispatch } = this.props;
    axs()
      .post("/checkAuth/")
      .then(res => {
        if (res.status === 200) {
          dispatch(authStatus, true);
          dispatch(isAuthInProgress, false);
        } else {
          dispatch(authStatus, false);
          dispatch(isAuthInProgress, false);
        }
      })
      .catch(() => {
        dispatch(authStatus, false);
        dispatch(isAuthInProgress, false);
      });
  }

  render() {
    const { user, isUserAuthorized, pageLoaded } = this.props;

    const PrivateRoute = ({ component: Component, ...rest }) => {
      let accGrnt = true;
      return (
        <Route
          {...rest}
          render={props => {
            this.checkAuth();

            if (user.role !== 1) {
              if (
                Object.prototype.hasOwnProperty.call(rest, "accessRole") &&
                rest.accessRole !== user.role
              ) {
                accGrnt = false;
              }
            }

            return isUserAuthorized && accGrnt ? (
              <Component {...props} />
            ) : (
              <AccessDenied />
            );
          }}
        />
      );
    };
    return (
      <Router history={history}>
        <Container style={{ margin: 20 }}>
          <Header />
          <Segment>
            <Switch>
              {isAuthInProgress || pageLoaded ? (
                <Segment>
                  <Dimmer active>
                    <Loader />
                  </Dimmer>

                  <Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" />
                </Segment>
              ) : (
                <div className="m-3">
                  <Route exact path="/" component={MainPage} />
                  <Route exact path="/login" component={LoginPage} />
                  <PrivateRoute
                    exact
                    path="/secret"
                    component={() => <div>секретная страница</div>}
                  />
                  <PrivateRoute
                    exact
                    accessRole={1}
                    path="/addBook"
                    component={AddBookPage}
                  />
                </div>
              )}
            </Switch>
          </Segment>
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
      isAuthInProgress: PARAMS.IS_AUTH_IN_PROGRESS,
      pageLoaded: PARAMS.LOADED,
      isUserAuthorized: PARAMS.IS_USER_AUTHORIZED,
      user: PARAMS.USER_INFO
    },
    App
  )
);
