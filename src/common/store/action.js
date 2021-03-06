import { PARAMS } from "./index";

export function storeData(store, param, data) {
  store.set(param, data);
}

export function isAuthInProgress(store, status) {
  store.set(PARAMS.IS_AUTH_IN_PROGRESS, status);
  store.set(PARAMS.IS_SOME_DATA_LOADING, status);
}

export function setBookIntoStore(store, book) {
  store.set(PARAMS.BOOK_TO_DB, { ...book });
}
