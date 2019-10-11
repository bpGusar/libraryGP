import React from "react";

const MSG = {
  serverError: {
    type: "error",
    title: "Ошибка загрузки данных!",
    description: <p>Попробуйте позже</p>,
    time: 100000,
    onDismiss: () => true
  },
  bookDoesntAvailableAnymore: title => ({
    type: "error",
    title,
    time: 10000,
    onDismiss: () => true
  }),
  errorWhenFindBookedBooks: title => ({
    type: "error",
    title,
    time: 60000,
    onDismiss: () => true
  }),
  bookDoesntAvailableRibbon: {
    color: "red",
    content: "Нет в наличии",
    ribbon: true
  },
  orderBookModalInfo: {
    messageHeader:
      "Ваш уникальный идентификатор бронирования книги это ваше Ф.И.О",
    messageText: "Назовите его в библиотеке для получения книги",
    messageSubText:
      "Вы также можете посмотреть все свои брони и выданные книги в личном кабинете",
    modalHeader: "Бронирование книги",
    contentHeader: "Книга успешно забронирована.",
    contentText:
      "Вы можете взять книгу не более чем на месяц за один раз и не более 5-ти книг всего. За 3 дня до окончания периода аренды Вам на электронную почту поступит письмо с предупреждением. Если не вернуть книгу в срок, на Ваш аккаунт будет наложена блокировка. После этого с Вами свяжутся через электронную почту."
  }
};

export default MSG;
