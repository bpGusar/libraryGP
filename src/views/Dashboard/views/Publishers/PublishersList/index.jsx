import React from "react";

import ShowElements from "@DUI/common/ShowElements";

function PublishersList() {
  return (
    <ShowElements
      linkPrefix="/book-publishers/"
      inputLabel="Название издателя"
      formHeaderText="Издатели"
      dbPropertyName="publisherName"
    />
  );
}

export default PublishersList;
