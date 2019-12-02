import React from "react";

import ShowElements from "../components/ShowElements";

export default function LangList() {
  return (
    <ShowElements
      linkPrefix="/book-languages/"
      inputLabel="Название языка"
      formHeaderText="Языки"
    />
  );
}
