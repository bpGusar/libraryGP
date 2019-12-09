/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Switch, Route } from "react-router";
import { branch } from "baobab-react/higher-order";

/** обертки */
import MainLayout from "@views/Layouts/Main";
import BookTemplate from "@views/Layouts/Book";
import LoginAndRegister from "@views/Layouts/LoginAndRegister";
import Dashboard from "@views/Layouts/Dashboard/index";

/** вьюхи сайта */
import LoginPage from "@UI/Users/LoginPage";
import RegistrationPage from "@UI/Users/RegistrationPage/index";
import ResetPasswordPage from "@UI/Users/ResetPasswordPage";
import MainPage from "@UI/MainPage";
import InfoPage from "@views/common/InfoPage";
import BookPage from "@UI/Books/BookPage";
import EmailVerify from "@UI/Users/EmailVerify";
import ProfilePage from "@UI/Users/ProfilePage";

/** вьюхи дашборда */
import AddAuthor from "@DUI/views/Authors/AddAuthor";
import AuthorsList from "@DUI/views/Authors/AuthorsList";
import LangList from "@DUI/views/Languages/LangList";
import AddLang from "@DUI/views/Languages/AddLang";
import AddPublisher from "@DUI/views/Publishers/AddPublisher";
import PublishersList from "@DUI/views/Publishers/PublishersList";
import AddCategory from "@DUI/views/Categories/AddCategory";
import CategoryList from "@DUI/views/Categories/CategoryList";
import FindBookPage from "@DUI/views/Books/AddBookPage";
import AddBookForm from "@DUI/views/Books/AddBookPage/Form/index";
import ManageBookedBooks from "@DUI/views/Books/ManageBookedBooks";
import ManageOrderedBooks from "@DUI/views/Books/ManageOrderedBooks";
import ManageBooks from "@DUI/views/Books/ManageBooks";
import OrdersArchive from "@DUI/views/Books/OrdersArchive";
import AddNewUser from "@DUI/views/Users/AddNew";
import MenusPage from "@DUI/views/MenusPage";
import UsersList from "@DUI/views/Users/UsersListPage";
import DashboardPage from "@DUI";

import PrivateRoute from "./PrivateRoute";

import { PARAMS } from "@store";

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

// eslint-disable-next-line react/prefer-stateless-function
function AppRotes(props) {
  const { userRoles, checkAuth } = props;

  return (
    <Switch>
      <PrivateRoute
        exact
        layout={Dashboard}
        accessRole={[userRoles.admin.value]}
        checkAuth={checkAuth}
        path="/dashboard/books/new"
        component={AddBookForm}
      />
      <PrivateRoute
        exact
        layout={Dashboard}
        accessRole={[userRoles.admin.value]}
        checkAuth={checkAuth}
        path="/dashboard/books/orders-management"
        component={ManageOrderedBooks}
      />
      <PrivateRoute
        exact
        layout={Dashboard}
        accessRole={[userRoles.admin.value]}
        checkAuth={checkAuth}
        path="/dashboard/books/booking-management"
        component={ManageBookedBooks}
      />
      <PrivateRoute
        exact
        layout={Dashboard}
        accessRole={[userRoles.admin.value]}
        checkAuth={checkAuth}
        path="/dashboard"
        component={DashboardPage}
      />
      <PrivateRoute
        exact
        layout={Dashboard}
        accessRole={[userRoles.admin.value]}
        checkAuth={checkAuth}
        path="/dashboard/books/find"
        component={FindBookPage}
      />
      <PrivateRoute
        exact
        layout={Dashboard}
        accessRole={[userRoles.admin.value]}
        checkAuth={checkAuth}
        path="/dashboard/users/new"
        component={AddNewUser}
      />
      <PrivateRoute
        exact
        layout={Dashboard}
        accessRole={[userRoles.admin.value]}
        checkAuth={checkAuth}
        path="/dashboard/users/list"
        component={UsersList}
      />
      <PrivateRoute
        exact
        layout={Dashboard}
        accessRole={[userRoles.admin.value]}
        checkAuth={checkAuth}
        path="/dashboard/books/book-list"
        component={ManageBooks}
      />
      <PrivateRoute
        exact
        layout={Dashboard}
        accessRole={[userRoles.admin.value]}
        checkAuth={checkAuth}
        path="/dashboard/books/orders-archive"
        component={OrdersArchive}
      />
      <PrivateRoute
        exact
        layout={Dashboard}
        accessRole={[userRoles.admin.value]}
        checkAuth={checkAuth}
        path="/dashboard/info-page"
        component={InfoPage}
      />
      <PrivateRoute
        exact
        layout={Dashboard}
        accessRole={[userRoles.admin.value]}
        checkAuth={checkAuth}
        path="/dashboard/menus"
        component={MenusPage}
      />
      <PrivateRoute
        exact
        layout={Dashboard}
        accessRole={[userRoles.admin.value]}
        checkAuth={checkAuth}
        path="/dashboard/authors/new"
        component={AddAuthor}
      />
      <PrivateRoute
        exact
        layout={Dashboard}
        accessRole={[userRoles.admin.value]}
        checkAuth={checkAuth}
        path="/dashboard/authors/list"
        component={AuthorsList}
      />
      <PrivateRoute
        exact
        layout={Dashboard}
        accessRole={[userRoles.admin.value]}
        checkAuth={checkAuth}
        path="/dashboard/categories/new"
        component={AddCategory}
      />
      <PrivateRoute
        exact
        layout={Dashboard}
        accessRole={[userRoles.admin.value]}
        checkAuth={checkAuth}
        path="/dashboard/categories/list"
        component={CategoryList}
      />
      <PrivateRoute
        exact
        layout={Dashboard}
        accessRole={[userRoles.admin.value]}
        checkAuth={checkAuth}
        path="/dashboard/publishers/list"
        component={PublishersList}
      />
      <PrivateRoute
        exact
        layout={Dashboard}
        accessRole={[userRoles.admin.value]}
        checkAuth={checkAuth}
        path="/dashboard/publishers/new"
        component={AddPublisher}
      />
      <PrivateRoute
        exact
        layout={Dashboard}
        accessRole={[userRoles.admin.value]}
        checkAuth={checkAuth}
        path="/dashboard/languages/list"
        component={LangList}
      />
      <PrivateRoute
        exact
        layout={Dashboard}
        accessRole={[userRoles.admin.value]}
        checkAuth={checkAuth}
        path="/dashboard/languages/new"
        component={AddLang}
      />
      <PrivateRoute
        exact
        layout={MainLayout}
        accessRole={[userRoles.admin.value, userRoles.user.value]}
        checkAuth={checkAuth}
        path="/profile/:userId"
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
        path="/reset-password"
        layout={LoginAndRegister}
        component={ResetPasswordPage}
      />
      <AppRoute
        exact
        path="/info-page"
        layout={MainLayout}
        component={InfoPage}
      />
      <AppRoute
        exact
        path="/book/:id"
        layout={BookTemplate}
        component={BookPage}
      />
      <AppRoute
        exact
        path="/logout"
        layout={MainLayout}
        component={() => {
          localStorage.removeItem("token");
          document.location.href = "/";
        }}
      />
    </Switch>
  );
}

export default branch(
  {
    userRoles: PARAMS.USER_ROLES
  },
  AppRotes
);
