const menus = {
  dashboardMain: [
    {
      type: "simple",
      text: "Главная",
      to: "/dashboard",
      icon: ""
    },
    {
      type: "dropdown",
      text: "Книги",
      items: [
        {
          type: "simple",
          text: "Добавить новую",
          to: "/dashboard/books/find",
          icon: "add"
        },
        {
          type: "simple",
          text: "Управление бронированием",
          to: "/dashboard/books/booking-management",
          icon: "book"
        },
        {
          type: "simple",
          text: " Управление выданными книгами",
          to: "/dashboard/books/orders-management",
          icon: "book"
        },
        {
          type: "simple",
          text: "Все книги",
          to: "/dashboard/books/book-list",
          icon: "list"
        }
      ]
    },
    {
      type: "dropdown",
      text: "Пользователи",
      items: [
        {
          type: "simple",
          text: "Добавить нового",
          to: "/dashboard/users/new",
          icon: "add"
        }
      ]
    }
  ]
};

export default { ...menus };
