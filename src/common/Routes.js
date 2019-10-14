import React from "react";
import { Switch, Route } from "react-router";
import _ from "lodash";

import MainLayout from "@views/Layouts/Main";
import BookTemplate from "@views/Layouts/Book";
import LoginAndRegister from "@views/Layouts/LoginAndRegister";
import Dashboard from "@views/Layouts/Dashboard";

import LoginPage from "@views/LoginPage";
import RegistrationPage from "@views/RegistrationPage";
import MainPage from "@views/MainPage";
import FindBookPage from "@views/AddBookPage";
import AddBookForm from "@views/AddBookPage/AddBookForm/index";
import AccessDenied from "@views/AccessDenied";
import InfoPage from "@views/InfoPage";
import BookPage from "@views/BookPage";
import EmailVerify from "@views/EmailVerify";
import DashboardPage from "@views/Dashboard";

export default class AppRotes extends React.Component {
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

  render() {
    const { checkAuth, user, isUserAuthorized } = this.props;
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
          render={routeProps => {
            checkAuth();

            if (user.userGroup !== roles.admin) {
              if (
                _.has(rest, "accessRole") &&
                rest.accessRole !== user.userGroup
              ) {
                accessGranted = false;
              }
            }

            return isUserAuthorized && accessGranted ? (
              <Layout>
                <Component {...routeProps} />
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
        render={routeProps => (
          <Layout>
            <Component {...routeProps} />
          </Layout>
        )}
      />
    );
    return (
      <Switch>
        <AppRoute exact path="/" layout={MainLayout} component={MainPage} />
        <AppRoute
          exact
          path="/emailVerify"
          layout={MainLayout}
          component={EmailVerify}
        />
        <PrivateRoute
          exact
          layout={Dashboard}
          accessRole={roles.admin}
          path="/dashboard/addBook"
          component={AddBookForm}
        />
        <PrivateRoute
          exact
          layout={Dashboard}
          accessRole={roles.admin}
          path="/dashboard"
          component={DashboardPage}
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
          layout={Dashboard}
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
    );
  }
}
