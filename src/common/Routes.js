import React from "react";
import { Switch, Route } from "react-router";
import _ from "lodash";
import { branch } from "baobab-react/higher-order";

/** обертки */
import MainLayout from "@views/Layouts/Main";
import BookTemplate from "@views/Layouts/Book";
import LoginAndRegister from "@views/Layouts/LoginAndRegister";
import Dashboard from "@views/Layouts/Dashboard/index";

/** вьюхи сайта */
import LoginPage from "@UI/Users/LoginPage";
import RegistrationPage from "@UI/Users/RegistrationPage";
import MainPage from "@UI/MainPage";
import FindBookPage from "@UI/Books/AddBookPage";
import AddBookForm from "@UI/Books/AddBookPage/AddBookForm/index";
import AccessDenied from "@views/Common/AccessDenied";
import InfoPage from "@views/Common/InfoPage";
import BookPage from "@UI/Books/BookPage";
import EmailVerify from "@UI/Users/EmailVerify";
import ProfilePage from "@UI/Users/ProfilePage";

/** вьюхи дашборда */
import ManageBookedBooks from "@DUI/views/Books/ManageBookedBooks";
import ManageOrderedBooks from "@DUI/views/Books/ManageOrderedBooks";
import AllBooks from "@DUI/views/Books/AllBooks";
import AddNewUser from "@DUI/views/Users/AddNew";
import DashboardPage from "@DUI";

import { PARAMS } from "@store";

// eslint-disable-next-line react/prefer-stateless-function
class AppRotes extends React.Component {
  render() {
    const {
      checkAuth,
      user,
      userRoles,
      isAuthInProgressStored,
      globalPageLoader,
      isUserAuthorized
    } = this.props;

    /**
     * Приватный роут.
     *
     * Принимает все стандартные пропсы reac-router.
     * В процессе проверит авторизацию пользователя. Если роль для доступа не подходит будет выполнен редирект на главную.
     * Так же, если пользователь залогинен и его в это же время удалили из базы то его токен не пройдет проверку.
     * Тогда его токен будет удален из хранилища и будет произведен редирект на главную.
     *
     * Дополнительные пропсы:
     * @param {Array} accessRole массив с названиями ролей пользователей
     * @param {Component} layout родительский компонент-обертка.
     */
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
            if (!isAuthInProgressStored && !globalPageLoader) {
              checkAuth().then(resp => {
                if (resp.isError) {
                  localStorage.removeItem("token");
                  document.location.href = "/";
                }
              });

              if (isUserAuthorized) {
                if (
                  _.has(rest, "accessRole") &&
                  rest.accessRole.filter(el => el === user.userGroup).length ===
                    0
                ) {
                  accessGranted = false;
                }

                return accessGranted ? (
                  <Layout {...routeProps} accessGranted={accessGranted}>
                    <Component {...routeProps} />
                  </Layout>
                ) : (
                  <Layout {...routeProps} accessGranted={accessGranted}>
                    <AccessDenied />
                  </Layout>
                );
              }
              routeProps.history.push("/");
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
        <PrivateRoute
          exact
          layout={Dashboard}
          accessRole={[userRoles.admin]}
          path="/dashboard/books/new"
          component={AddBookForm}
        />
        <PrivateRoute
          exact
          layout={Dashboard}
          accessRole={[userRoles.admin]}
          path="/dashboard/books/orders-management"
          component={ManageOrderedBooks}
        />
        <PrivateRoute
          exact
          layout={Dashboard}
          accessRole={[userRoles.admin]}
          path="/dashboard/books/booking-management"
          component={ManageBookedBooks}
        />
        <PrivateRoute
          exact
          layout={Dashboard}
          accessRole={[userRoles.admin]}
          path="/dashboard"
          component={DashboardPage}
        />
        <PrivateRoute
          exact
          layout={Dashboard}
          accessRole={[userRoles.admin]}
          path="/dashboard/books/find"
          component={FindBookPage}
        />
        <PrivateRoute
          exact
          layout={Dashboard}
          accessRole={[userRoles.admin]}
          path="/dashboard/users/new"
          component={AddNewUser}
        />
        <PrivateRoute
          exact
          layout={Dashboard}
          accessRole={[userRoles.admin]}
          path="/dashboard/books/book-list"
          component={AllBooks}
        />
        <PrivateRoute
          exact
          layout={MainLayout}
          accessRole={[userRoles.admin, userRoles.user]}
          path="/profile"
          component={ProfilePage}
        />
        <AppRoute exact path="/" layout={MainLayout} component={MainPage} />
        <AppRoute
          exact
          path="/email-verify"
          layout={MainLayout}
          component={EmailVerify}
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
    userRoles: PARAMS.USER_ROLES,
    globalPageLoader: PARAMS.GLOBAL_PAGE_LOADER
  },
  AppRotes
);
