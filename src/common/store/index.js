/* eslint-disable no-console */
import Baobab from "baobab";

export const PARAMS = {
  IS_AUTH_IN_PROGRESS: "is auth in progress?",
  LOADED: "loading in progress",
  IS_USER_AUTHORIZED: "is user authorized?",
  USER_INFO: "information about logged user",
  MENU: "menu",
  BOOK_TO_DB: "book to db",
  BOOK: "book",
  IS_BOOK_DATA_LOADED: "is book data loaded to store?",
  GLOBAL_PAGE_LOADER: "is some data is loading?",
  GLOBAL_PAGE_LOADER_BY_ACTION: "is some data is loading by action?",
  AUTHORS: "authors from db",
  CATEGORIES: "categories from db",
  LANGUAGES: "languages from db",
  PUBLISHERS: "publishers from db",
  INFO_PAGE: "info page text",
  USER_ROLES: "user roles"
};

export const getInitialState = () => ({
  [PARAMS.IS_AUTH_IN_PROGRESS]: true,
  [PARAMS.GLOBAL_PAGE_LOADER]: true, // true значит какие то данные загружаются
  [PARAMS.GLOBAL_PAGE_LOADER_BY_ACTION]: false, // true значит какому то действию необходим оверлей
  [PARAMS.IS_USER_AUTHORIZED]: false,
  [PARAMS.LOADED]: false,
  [PARAMS.USER_INFO]: {},
  [PARAMS.INFO_PAGE]: {
    text: "",
    type: ""
  },
  [PARAMS.MENU]: {},
  [PARAMS.IS_BOOK_DATA_LOADED]: false,
  [PARAMS.AUTHORS]: [],
  [PARAMS.CATEGORIES]: [],
  [PARAMS.LANGUAGES]: [],
  [PARAMS.PUBLISHERS]: [],
  [PARAMS.BOOK]: {},
  [PARAMS.USER_ROLES]: {
    notLogged: "notLogged",
    user: 0,
    admin: 1
  },
  [PARAMS.BOOK_TO_DB]: {
    userIdWhoAddedBookInDb: "",
    dateAdded: "",
    bookInfo: {
      title: "",
      authors: [],
      publisher: "",
      publishedDate: "",
      description: "",
      industryIdentifiers: [
        {
          type: "ISBN_13",
          identifier: ""
        },
        {
          type: "ISBN_10",
          identifier: ""
        }
      ],
      pageCount: 0,
      categories: [],
      maturityRating: "",
      imageLinks: {
        poster: ""
      },
      language: []
    },
    stockInfo: {
      freeForBooking: 0,
      maxAvailableBooks: 0
    }
  }
});

export const store = new Baobab(getInitialState());

if (process.env.NODE_ENV === "development") {
  store.on("update", e => {
    const eventData = e.data;
    const titleLog = `color: black; font-weight: bold;`;
    const blueLog = `color: blue; font-style: italic;`;

    console.groupCollapsed(
      "Store changed:  ",
      eventData.paths.map(path => path[0]).join(", ")
    );
    // console.log('Affected paths', eventData.paths);
    console.log("%cCurrent data:", titleLog, eventData.currentData);
    console.log("%cPrevious data:", titleLog, eventData.previousData);
    // console.log('Transaction details:', eventData.transaction);
    console.group("Transaction details: ");
    eventData.transaction.forEach(t => {
      console.groupCollapsed("transaction: ");
      console.log(`%cchange type: %c${t.type};`, titleLog, blueLog);
      console.log(`%cchanged param: %c${t.path.join(", ")}`, titleLog, blueLog);
      console.log(`%cnew value: %c${t.value}`, titleLog, blueLog);
      console.groupEnd();
    });
    console.groupEnd();
    console.groupEnd();
  });
}

export default store;
