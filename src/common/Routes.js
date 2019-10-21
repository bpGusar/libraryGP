import React from "react";
import { Switch, Route } from "react-router";
import _ from "lodash";
import { branch } from "baobab-react/higher-order";

import MainLayout from "@views/Layouts/Main";
import BookTemplate from "@views/Layouts/Book";
import LoginAndRegister from "@views/Layouts/LoginAndRegister";
import Dashboard from "@views/Layouts/Dashboard/index";

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
import ManageBookedBooks from "@views/Dashboard/components/ManageBookedBooks";
import ManageOrderedBooks from "@views/Dashboard/components/ManageOrderedBooks";

import { PARAMS } from "@store";

// eslint-disable-next-line react/prefer-stateless-function
class AppRotes extends React.Component {
  render() {
    const { checkAuth, user, isUserAuthorized, userRoles } = this.props;

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

            if (!_.isEmpty(user)) {
              if (user.userGroup !== userRoles.admin) {
                if (
                  _.has(rest, "accessRole") &&
                  rest.accessRole !== user.userGroup
                ) {
                  accessGranted = false;
                }
              }

              return isUserAuthorized && accessGranted ? (
                <Layout {...routeProps} accessGranted={accessGranted}>
                  <Component {...routeProps} />
                </Layout>
              ) : (
                <Layout {...routeProps} accessGranted={accessGranted}>
                  <AccessDenied />
                </Layout>
              );
            }
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
          path="/email-verify"
          layout={MainLayout}
          component={EmailVerify}
        />
        <PrivateRoute
          exact
          layout={Dashboard}
          accessRole={userRoles.admin}
          path="/dashboard/add-book"
          component={AddBookForm}
        />
        <PrivateRoute
          exact
          layout={Dashboard}
          accessRole={userRoles.admin}
          path="/dashboard/orders-management"
          component={ManageOrderedBooks}
        />
        <PrivateRoute
          exact
          layout={Dashboard}
          accessRole={userRoles.admin}
          path="/dashboard/booking-management"
          component={ManageBookedBooks}
        />
        <PrivateRoute
          exact
          layout={Dashboard}
          accessRole={userRoles.admin}
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
          path="/info-page"
          layout={MainLayout}
          component={InfoPage}
        />
        <PrivateRoute
          exact
          layout={Dashboard}
          accessRole={userRoles.admin}
          path="/dashboard/find-book"
          component={FindBookPage}
        />
        <PrivateRoute
          exact
          layout={MainLayout}
          accessRole={userRoles.admin}
          path="/secret"
          component={() => <div>dsfdasfasd</div>}
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

export default branch(
  {
    userRoles: PARAMS.USER_ROLES
  },
  AppRotes
);
