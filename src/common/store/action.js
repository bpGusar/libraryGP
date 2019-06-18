import { PARAMS } from './index';

export function authStatus(store, status) {
  store.set(PARAMS.IS_USER_AUTHORIZED, status);
}

export function isAuthInProgress(store, status) {
  store.set(PARAMS.IS_AUTH_IN_PROGRESS, status);
}
