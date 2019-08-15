import Baobab from "baobab";

export const PARAMS = {
  IS_AUTH_IN_PROGRESS: "is auth in progress",
  LOADED: "loading in progress",
  IS_USER_AUTHORIZED: "is user authorized",
  USER_INFO: "information about logged user",
  MENU: "menu",
  BOOK: "book which need to add into DB"
};

export const store = new Baobab({
  [PARAMS.IS_AUTH_IN_PROGRESS]: true,
  [PARAMS.IS_USER_AUTHORIZED]: false,
  [PARAMS.LOADED]: false,
  [PARAMS.USER_INFO]: {},
  [PARAMS.MENU]: {},
  [PARAMS.BOOK]: {
    kind: "books#volume",
    id: "cHeaDwAAQBAJ",
    etag: "GBdQOoW2V7c",
    selfLink: "https://www.googleapis.com/books/v1/volumes/cHeaDwAAQBAJ",
    volumeInfo: {
      title: "Нож",
      authors: ["Ю Несбё", "fghdfghgf"],
      publisher: "Азбука-Аттикус",
      publishedDate: "2019-05-28",
      description:
        "В Осло совершено жестокое убийство. В этом деле Харри Холе играет не совсем обычную роль — он возглавляет не расследование, а список подозреваемых. Сам он ничего не может сказать по данному поводу, поскольку переживает не лучшие времена и некоторые события последних дней напрочь выпали из его памяти. Правда, на момент убийства у него имеется алиби, но случайная находка, сделанная в своей квартире, заставляет Харри усомниться в нем. Он почти убежден в том, что виновен, и ведет собственное расследование — в первую очередь, это расследование темных глубин собственного «я»… Долгожданный 12-й роман из захватывающей серии о Харри Холе. Впервые на русском языке!",
      industryIdentifiers: [
        {
          type: "ISBN_13",
          identifier: "9785389166851"
        },
        {
          type: "ISBN_10",
          identifier: "538916685X"
        }
      ],
      readingModes: {
        text: true,
        image: true
      },
      pageCount: 576,
      printType: "BOOK",
      categories: ["Fiction"],
      maturityRating: "NOT_MATURE",
      allowAnonLogging: true,
      contentVersion: "1.1.1.0.preview.3",
      panelizationSummary: {
        containsEpubBubbles: false,
        containsImageBubbles: false
      },
      imageLinks: {
        smallThumbnail:
          "http://books.google.com/books/content?id=cHeaDwAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api",
        thumbnail:
          "http://books.google.com/books/content?id=cHeaDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
      },
      language: "ru",
      previewLink:
        "http://books.google.ru/books?id=cHeaDwAAQBAJ&pg=PT7&dq=978-5-389-16685-1&hl=&cd=1&source=gbs_api",
      infoLink:
        "https://play.google.com/store/books/details?id=cHeaDwAAQBAJ&source=gbs_api",
      canonicalVolumeLink:
        "https://play.google.com/store/books/details?id=cHeaDwAAQBAJ"
    },
    saleInfo: {
      country: "RU",
      saleability: "FOR_SALE",
      isEbook: true,
      listPrice: {
        amount: 274.8,
        currencyCode: "RUB"
      },
      retailPrice: {
        amount: 247.32,
        currencyCode: "RUB"
      },
      buyLink:
        "https://play.google.com/store/books/details?id=cHeaDwAAQBAJ&rdid=book-cHeaDwAAQBAJ&rdot=1&source=gbs_api",
      offers: [
        {
          finskyOfferType: 1,
          listPrice: {
            amountInMicros: 2.748e8,
            currencyCode: "RUB"
          },
          retailPrice: {
            amountInMicros: 2.4732e8,
            currencyCode: "RUB"
          }
        }
      ]
    },
    accessInfo: {
      country: "RU",
      viewability: "PARTIAL",
      embeddable: true,
      publicDomain: false,
      textToSpeechPermission: "ALLOWED",
      epub: {
        isAvailable: true,
        acsTokenLink:
          "http://books.google.ru/books/download/%D0%9D%D0%BE%D0%B6-sample-epub.acsm?id=cHeaDwAAQBAJ&format=epub&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api"
      },
      pdf: {
        isAvailable: true,
        acsTokenLink:
          "http://books.google.ru/books/download/%D0%9D%D0%BE%D0%B6-sample-pdf.acsm?id=cHeaDwAAQBAJ&format=pdf&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api"
      },
      webReaderLink:
        "http://play.google.com/books/reader?id=cHeaDwAAQBAJ&hl=&printsec=frontcover&source=gbs_api",
      accessViewStatus: "SAMPLE",
      quoteSharingAllowed: false
    },
    searchInfo: {
      textSnippet:
        "Е. Лавринайтис. — СПб. : Азбука, АзбукаАттикус, 2019. (Звезды мирового \u003cbr\u003e\nдетектива). ISBN \u003cb\u003e978-5-389-16685-1\u003c/b\u003e 16+ В Осло совершено жестокое \u003cbr\u003e\nубийство. В этом деле Харри Холе играет не совсем обычную роль — он \u003cbr\u003e\nвозглавляет&nbsp;..."
    }
  }
});

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
