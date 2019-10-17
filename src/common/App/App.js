import React from "react";
import { root, branch } from "baobab-react/higher-order";
import { Router } from "react-router";
import { Segment, Dimmer, Loader, Image } from "semantic-ui-react";
import { SemanticToastContainer } from "react-semantic-toasts";
import "react-semantic-toasts/styles/react-semantic-alert.css";
import { createBrowserHistory } from "history";
import "dotenv/config";

import AppRoutes from "../Routes";

import axs from "@axios";

import store, { PARAMS } from "@store";
import { isAuthInProgress, storeData } from "@act";

const history = createBrowserHistory();

class App extends React.Component {
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
   * такое бывает если пользователя удалили из базы и он не разлогинился до этого
   */
  getUserInfo() {
    const { dispatch } = this.props;
    axs.post("/getUserInfo/").then(resp => {
      if (resp.data.payload !== null) {
        dispatch(storeData, PARAMS.USER_INFO, resp.data.payload);
      } else {
        localStorage.removeItem("token");
      }
    });
  }

  checkAuth() {
    const { dispatch } = this.props;
    axs
      .post("/auth/status/")
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
      pageLoaded,
      globalPageLoader,
      isAuthInProgresStored,
      globalPageLoaderByAction
    } = this.props;

    return (
      <Router history={history}>
        <Dimmer active={globalPageLoader || globalPageLoaderByAction} page>
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
          <AppRoutes
            {...this.props}
            {...this.stae}
            // eslint-disable-next-line react/jsx-no-bind
            checkAuth={this.checkAuth.bind(this)}
          />
        )}
        <SemanticToastContainer position="top-right" />
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
      globalPageLoaderByAction: PARAMS.GLOBAL_PAGE_LOADER_BY_ACTION,
      pageLoaded: PARAMS.LOADED,
      isUserAuthorized: PARAMS.IS_USER_AUTHORIZED,
      user: PARAMS.USER_INFO
    },
    App
  )
);
