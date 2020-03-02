/* eslint-disable class-methods-use-this */
import React from "react";
import { root, branch } from "baobab-react/higher-order";
import { Router } from "react-router";
import { Segment, Dimmer, Loader, Image } from "semantic-ui-react";
import { SemanticToastContainer } from "react-semantic-toasts";
import "react-semantic-toasts/styles/react-semantic-alert.css";
import { createBrowserHistory } from "history";
import "dotenv/config";
import _ from "lodash";

import AppRoutes from "../Router/Routes";

import axs from "@axios";

import store, { PARAMS } from "@store";
import { isAuthInProgress, storeData } from "@act";

const history = createBrowserHistory();

class App extends React.Component {
  componentDidMount() {
    this.getSiteSettings(() => this.checkAuth());
  }

  getSiteSettings(cb) {
    const { dispatch } = this.props;
    axs.get(`/settings`).then(resp => {
      if (!resp.data.error) {
        dispatch(storeData, PARAMS.SETTINGS, {
          ...resp.data.payload.settings
        });
        cb();
      }
    });
  }

  async checkAuth() {
    const { dispatch, user } = this.props;
    let isError = false;

    if (localStorage.getItem("token") !== null) {
      await axs.get("/users/service/auth-status").then(resp => {
        if (!resp.data.error) {
          if (!_.isEqual(user, resp.data.payload)) {
            dispatch(storeData, PARAMS.USER_INFO, resp.data.payload);
          }
          dispatch(storeData, PARAMS.IS_USER_AUTHORIZED, true);
          isError = resp.data.error;
        } else {
          isError = resp.data.error;
          dispatch(storeData, PARAMS.IS_USER_AUTHORIZED, false);
        }
      });

      dispatch(isAuthInProgress, false);
    } else {
      isError = true;
      dispatch(storeData, PARAMS.IS_USER_AUTHORIZED, false);
      dispatch(isAuthInProgress, false);
    }
    return { isError };
  }

  render() {
    const { pageLoaded, globalPageLoader, isAuthInProgresStored } = this.props;

    return (
      <Router history={history}>
        <Dimmer active={globalPageLoader} page>
          <Loader />
        </Dimmer>
        {isAuthInProgresStored || pageLoaded || globalPageLoader ? (
          <Segment>
            <Dimmer active>
              <Loader />
            </Dimmer>

            <Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" />
          </Segment>
        ) : (
          <AppRoutes
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
      globalPageLoader: PARAMS.IS_SOME_DATA_LOADING,
      pageLoaded: PARAMS.LOADED,
      user: PARAMS.USER_INFO
    },
    App
  )
);
