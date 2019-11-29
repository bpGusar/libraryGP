import React from "react";

import AddNewElement from "@DUI/common/AddNewElement";

export default function AddCategory() {
  return (
    <AddNewElement
      dbPropertyName="categoryName"
      formHeaderText="Добавить категорию"
      postLink="/book-categories"
      inputLabel="Введите имя категории"
    />
  );
}
