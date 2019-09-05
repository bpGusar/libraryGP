import React from "react";
import _ from "lodash";
import { root, branch } from "baobab-react/higher-order";
import { Switch, Route, Router } from "react-router";
import { Segment, Dimmer, Loader, Image, Container } from "semantic-ui-react";
import { createBrowserHistory } from "history";
import "dotenv/config";

import LoginPage from "@views/LoginPage";
import MainPage from "@views/MainPage";
import Header from "@views/Header";
import FindBookPage from "@views/AddBookPage";
import AddBookForm from "@views/AddBookPage/AddBookForm/index";
import AccessDenied from "@views/AccessDenied";
import InfoPage from "@views/InfoPage";
import axs from "@axios";

import store, { PARAMS } from "@store";
import { isAuthInProgress, storeData } from "@act";

const history = createBrowserHistory();

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      roles: {
        notLogged: "notLogged",
        admin: 1
      }
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    if (localStorage.getItem("token") !== null) {
      this.checkAuth();
      this.getUserInfo();
    } else {
      dispatch(storeData, PARAMS.IS_USER_AUTHORIZED, false);
      dispatch(isAuthInProgress, false);
    }
  }

  getUserInfo() {
    const { dispatch } = this.props;
    axs
      .post("/getUserInfo/")
      .then(res => {
        dispatch(storeData, PARAMS.USER_INFO, res.data.payload.user);
      })
      .catch(err => {
        console.error(err);
      });
  }

  checkAuth() {
    const { dispatch } = this.props;
    axs
      .post("/auth/checkAuth/")
      .then(res => {
        if (res.data.error) {
          dispatch(storeData, PARAMS.IS_USER_AUTHORIZED, false);
          dispatch(isAuthInProgress, false);
        } else {
          dispatch(storeData, PARAMS.IS_USER_AUTHORIZED, true);
          dispatch(isAuthInProgress, false);
        }
      })
      .catch(() => {
        dispatch(storeData, PARAMS.IS_USER_AUTHORIZED, false);
        dispatch(isAuthInProgress, false);
      });
  }

  render() {
    const {
      user,
      isUserAuthorized,
      pageLoaded,
      globalPageLoader,
      isAuthInProgresStored
    } = this.props;

    const { roles } = this.state;

    const PrivateRoute = ({ component: Component, ...rest }) => {
      let accessGranted = true;
      return (
        <Route
          {...rest}
          render={props => {
            this.checkAuth();

            if (user.role !== roles.admin) {
              if (_.has(rest, "accessRole") && rest.accessRole !== user.role) {
                accessGranted = false;
              }
            }

            return isUserAuthorized && accessGranted ? (
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
        <Dimmer active={globalPageLoader} page inverted>
          <Loader />
        </Dimmer>
        <Container style={{ margin: 20 }}>
          <Header />
          <Segment>
            <Switch>
              {isAuthInProgresStored || pageLoaded ? (
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
                  <Route exact path="/infoPage" component={InfoPage} />
                  <PrivateRoute
                    exact
                    path="/secret"
                    component={() => <div>секретная страница</div>}
                  />
                  <PrivateRoute
                    exact
                    accessRole={roles.admin}
                    path="/findBook"
                    component={FindBookPage}
                  />
                  <PrivateRoute
                    exact
                    accessRole={roles.admin}
                    path="/addBook"
                    component={AddBookForm}
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
      isAuthInProgressStored: PARAMS.IS_AUTH_IN_PROGRESS,
      globalPageLoader: PARAMS.GLOBAL_PAGE_LOADER,
      pageLoaded: PARAMS.LOADED,
      isUserAuthorized: PARAMS.IS_USER_AUTHORIZED,
      user: PARAMS.USER_INFO
    },
    App
  )
);
