/* eslint-disable import/prefer-default-export */
export const ResetPasswordEmail = (to, password) => {
  return {
    from: "libraryGPbot@libraryGP.com",
    to,
    subject: "LibraryGP. Восстановление пароля.",
    text: `Здравствуйте. Новый пароль для имейла ${to} - ${password}. Обязательно смените его в своем личном кабинете на свой собственный.`
  };
};
