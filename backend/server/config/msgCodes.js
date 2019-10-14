const MSG = {
  errorToken1: {
    ru: "Токен не был получен. Ошибка авторизации."
  },
  errorToken2: {
    ru: "Не удалось проверить токен."
  },
  internalServerErr: {
    ru: "Произошла ошибка. Пожалуйста, попробуйте еще раз."
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
  },
  userFoundButNotVerified: {
    ru:
      "Пользователь с такими данными зарегистрирован но не подтвердил email адрес. Если это вы, то проверьте свою почту. Если почту не подтвердить то через 3 дня после регистрации аккаунт будет удален. Если вы видите это сообщение значит аккаут еще существует."
  },
  bookOutOfStock: {
    ru: "Свободных книг больше нет."
  },
  bookBooked: {
    ru: "Книга забронирована."
  },
  errorWhenFindBookedBooks: {
    ru: "Произошла ошибка сервера при поиске забронированных книг."
  },
  successFindBookedBooks: {
    ru: "Поиск забронированных книг прошел успешно."
  },
  errorWhenBookABook: {
    ru: "Произошла ошибка при бронировании книги."
  },
  bookNotFound: {
    ru: "Такой книги не существует."
  },
  youHaveMaxQuantityOfBooksOnYourHands: {
    ru:
      "Вы не можете забронировать больше книг. Максимальное кличество книг забронированных и на руках, в сумме, не может превышать пять книг."
  }
};

export default { ...MSG };
