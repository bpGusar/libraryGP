import React from "react";

import AddNewElement from "@DUI/common/AddNewElement";

export default function AddPublisher() {
  return (
    <AddNewElement
      dbPropertyName="publisherName"
      formHeaderText="Добавить издателя"
      postLink="/book-publishers"
      inputLabel="Введите название издателя"
    />
  );
}
