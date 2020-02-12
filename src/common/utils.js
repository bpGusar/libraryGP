/* eslint-disable import/prefer-default-export */
import { PARAMS, store } from "@store";

export function declension(condition, ifTrue, ifFalse) {
  return condition ? ifTrue : ifFalse;
}

export function convertDate(date) {
  const newDate = new Date(date);
  return `${newDate.getDate()}.${newDate.getMonth() +
    1}.${newDate.getFullYear()}`;
}

export function isAdmin() {
  const userInfo = store.get()[PARAMS.USER_INFO];

  return userInfo.userGroup === 1;
}
