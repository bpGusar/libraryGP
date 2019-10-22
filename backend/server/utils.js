// eslint-disable-next-line import/prefer-default-export
export function convertDate(date) {
  const newDate = new Date(date);
  return `${newDate.getDate()}.${newDate.getMonth() +
    1}.${newDate.getFullYear()}`;
}
