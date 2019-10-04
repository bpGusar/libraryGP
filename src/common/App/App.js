import React from "react";
import _ from "lodash";
import { root, branch } from "baobab-react/higher-order";
import { Switch, Route, Router } from "react-router";
import { Segment, Dimmer, Loader, Image } from "semantic-ui-react";
import { createBrowserHistory } from "history";
import "dotenv/config";

import MainLayout from "@views/Layouts/Main";
import BookTemplate from "@views/Layouts/Book";
import LoginAndRegister from "@views/Layouts/LoginAndRegister";

import LoginPage from "@views/LoginPage";
import RegistrationPage from "@views/RegistrationPage";
import MainPage from "@views/MainPage";
import FindBookPage from "@views/AddBookPage";
import AddBookForm from "@views/AddBookPage/AddBookForm/index";
import AccessDenied from "@views/AccessDenied";
import InfoPage from "@views/InfoPage";
import BookPage from "@views/BookPage";
import EmailVerify from "@views/EmailVerify";

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
        user: 0,
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

  /**
   * если в localStorage лежит токен и он валидный
   * то будет произведена его проверка
   * и если пользователя подходящего под токен в базе нет
   * то токен будет удален из localStorage
   *
   * такое бывает если пользователя удалили и он не разлогинился до этого
   */
  getUserInfo() {
    const { dispatch } = this.props;
    axs.post("/getUserInfo/").then(res => {
      if (res.data.payload !== null) {
        dispatch(storeData, PARAMS.USER_INFO, res.data.payload.user);
      } else {
        localStorage.removeItem("token");
      }
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

    const PrivateRoute = ({
      component: Component,
      layout: Layout,
      ...rest
    }) => {
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
              <Layout>
                <Component {...props} />
              </Layout>
            ) : (
              <Layout>
                <AccessDenied />
              </Layout>
            );
          }}
        />
      );
    };

    const AppRoute = ({ component: Component, layout: Layout, ...rest }) => (
      <Route
        {...rest}
        render={props => (
          <Layout>
            <Component {...props} />
          </Layout>
        )}
      />
    );

    return (
      <Router history={history}>
        <Dimmer active={globalPageLoader} page inverted>
          <Loader />
        </Dimmer>
        {isAuthInProgresStored || pageLoaded ? (
          <Segment>
            <Dimmer active>
              <Loader />
            </Dimmer>

            <Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" />
          </Segment>
        ) : (
          <>
            <Switch>
              <AppRoute
                exact
                path="/"
                layout={MainLayout}
                component={MainPage}
              />
              <AppRoute
                exact
                path="/emailVerify"
                layout={MainLayout}
                component={EmailVerify}
              />
              <PrivateRoute
                exact
                layout={MainLayout}
                accessRole={roles.admin}
                path="/dashboard/addBook"
                component={AddBookForm}
              />
              <AppRoute
                exact
                path="/login"
                layout={LoginAndRegister}
                component={LoginPage}
              />
              <AppRoute
                exact
                path="/signup"
                layout={LoginAndRegister}
                component={RegistrationPage}
              />
              <AppRoute
                exact
                path="/infoPage"
                layout={MainLayout}
                component={InfoPage}
              />
              <PrivateRoute
                exact
                layout={MainLayout}
                accessRole={roles.admin}
                path="/dashboard/findBook"
                component={FindBookPage}
              />
              <AppRoute
                exact
                path="/book-:id"
                layout={BookTemplate}
                component={BookPage}
              />
            </Switch>
          </>
        )}
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
