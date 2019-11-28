import React from "react";

import ShowElements from "@DUI/common/ShowElements";

function AuthorsList() {
  return (
    <ShowElements
      linkPrefix="/book-authors/"
      inputLabel="Имя автора"
      formHeaderText="Авторы"
      dbPropertyName="authorName"
    />
  );
}

export default AuthorsList;
