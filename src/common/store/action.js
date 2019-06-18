import { PARAMS } from './index';

export function authStatus(store, status) {
  store.set(PARAMS.IS_USER_AUTHORIZED, status);
}

export function isAuthInProgress(store, status) {
  store.set(PARAMS.IS_AUTH_IN_PROGRESS, status);
}

export function isLoadingInProgress(store, status) {
  store.set(PARAMS.IS_LOADING_IN_PROGRESS, status);
}

export function setUserInfo(store, info) {
  console.log(info);
  store.set(PARAMS.USER_INFO, info);
}
