import React from "react";

import AddNewElement from "@DUI/common/AddNewElement";

export default function AddAuthor() {
  return (
    <AddNewElement
      dbPropertyName="authorName"
      formHeaderText="Добавить автора"
      postLink="/book-authors"
      inputLabel="Введите имя автора"
    />
  );
}
