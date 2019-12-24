/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Route } from "react-router";
import _ from "lodash";
import { branch } from "baobab-react/higher-order";

import AccessDenied from "@views/common/AccessDenied";

import { PARAMS } from "@store";

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
function PrivateRoute({ component: Component, layout: Layout, ...rest }) {
  const {
    checkAuth,
    user,
    isAuthInProgressStored,
    globalPageLoader,
    isUserAuthorized
  } = rest;
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
              rest.accessRole.filter(el => el === user.userGroup).length === 0
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
        return false;
      }}
    />
  );
}

export default branch(
  {
    globalPageLoader: PARAMS.IS_SOME_DATA_LOADING,
    user: PARAMS.USER_INFO,
    pageTitle: PARAMS.PAGE_TITLE,
    isAuthInProgressStored: PARAMS.IS_AUTH_IN_PROGRESS,
    isUserAuthorized: PARAMS.IS_USER_AUTHORIZED
  },
  PrivateRoute
);
