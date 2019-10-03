const MSG = {
  errorToken1: {
    ru: "Токен не был получен."
  },
  errorToken2: {
    ru: "Не удалось проверить токен."
  },
  internalErr500: {
    ru: "Внутренняя ошибка. Пожалуйста, попробуйте еще раз."
  },
  wrongAuthCred: {
    ru: "Не правильный e-mail или пароль."
  },
  wrongEmail: {
    ru: "Не правильный e-mail при поиске пользователя."
  },
  accessForbiddenByRole: {
    ru: "В доступе отказано. Не достаточно прав."
  },
  cannotFindMenu: {
    ru:
      "Запрошенное меню не найдено. Проверьте данные по которым вы пытаетесь найти меню."
  },
  cannotUpdateMenu: {
    ru: "Произошла ошибка при обновлении."
  },
  menuWasUpdated: {
    ru: "Меню успешно обновлено."
  },
  registrationError: {
    ru: "Ошибка при регистрации."
  },
  registrationSuccess: {
    ru: "Успешная регистрация."
  },
  cantFindAuthor: {
    ru: "Такого автора в базе данных нет."
  },
  cantAddAuthor: {
    ru: "Ошибка добавления автора."
  },
  authorMustBeUnique: {
    ru: "Имя автора должно быть уникальным. Такой автор уже существует."
  },
  categoryNameMustBeUnique: {
    ru: "Имя категории должно быть уникальным."
  },
  languageMustBeUnique: {
    ru: "Новый язык должен быть уникальным."
  },
  publisherMustBeUnique: {
    ru: "Имя издательства должно быть уникальным."
  },
  cantAddNewBookCategory: {
    ru: "Ошибка добавления категории книги."
  },
  cantAddNewBookLanguage: {
    ru: "Ошибка добавления языка книги."
  },
  cannotUploadPoster: {
    ru: "Ошибка загрузки постера."
  },
  bookAddedSuccessfully: {
    ru: "Книга успешно добавлена."
  },
  cantAddNewBook: {
    ru: "Произошла ошибка при добавлении книги."
  },
  thisCredsAreFree: {
    ru: "Введенные данные сободны."
  },
  weFindSameCreds: {
    ru: "Введенные данные не уникальны."
  },
  cantVerifyEmailByToken: {
    ru: "При верификации email адреса произошла ошибка."
  },
  emailSuccessfullyVerified: {
    ru:
      "Email адрес успешно подтвержден. Теперь вы можете войти в свой аккаунт."
  },
  emailAlreadyVerified: {
    ru: "Email адрес уже был успешно подтвержден ранее."
  }
};

export default { ...MSG };
