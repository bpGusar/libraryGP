/* eslint-disable import/prefer-default-export */
export function declension(condition, ifTrue, ifFalse) {
  return condition ? ifTrue : ifFalse;
}

export function convertDate(date) {
  const newDate = new Date(date);
  return `${newDate.getDate()}.${newDate.getMonth() +
    1}.${newDate.getFullYear()}`;
}
