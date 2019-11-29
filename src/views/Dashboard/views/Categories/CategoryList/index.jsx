import React from "react";

import ShowElements from "@DUI/common/ShowElements";

export default function CategoryList() {
  return (
    <ShowElements
      linkPrefix="/book-categories/"
      inputLabel="Название категории"
      formHeaderText="Категории"
      dbPropertyName="categoryName"
    />
  );
}
