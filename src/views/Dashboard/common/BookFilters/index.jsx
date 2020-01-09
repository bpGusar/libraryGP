import React, { useState } from "react";
import { Form, Icon, Accordion } from "semantic-ui-react";
import _ from "lodash";

import UniqueDropdown from "@views/common/UniqueDropdown/UniqueDropdown";

import { PARAMS } from "@store";

export default function Filters(props) {
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(-1);

  const handleShowOpenAccordion = titleProps => {
    const { index } = titleProps;
    const newIndex = activeAccordionIndex === index ? -1 : index;
    setActiveAccordionIndex(newIndex);
  };

  const { onChangeSearchQuery, searchQuery, permanentOpen } = props;
  return (
    <Accordion className="mb-3">
      {!permanentOpen && (
        <Accordion.Title
          active={activeAccordionIndex === 0}
          index={0}
          onClick={(e, titleProp) => handleShowOpenAccordion(titleProp)}
        >
          <Icon name="dropdown" />
          Дополнительные фильтры
        </Accordion.Title>
      )}
      <Accordion.Content
        active={permanentOpen ? true : activeAccordionIndex === 0}
      >
        <Form.Group widths="equal">
          <UniqueDropdown
            axsQuery={{ params: { options: { limit: 999 } } }}
            axiosGetLink="/book-authors"
            axiosPostLink="/book-authors"
            storeParam={PARAMS.AUTHORS}
            multiple
            required
            onChange={value => onChangeSearchQuery(value, "bookInfo.authors")}
            label="Автор"
            getValueFromProperty="authorName"
            showClear
            currentValue={
              _.has(searchQuery["bookInfo.authors"], "$in")
                ? searchQuery["bookInfo.authors"].$in
                : []
            }
          />
          <UniqueDropdown
            axsQuery={{ params: { options: { limit: 999 } } }}
            axiosGetLink="/book-publishers"
            axiosPostLink="/book-publishers"
            storeParam={PARAMS.PUBLISHERS}
            multiple
            required
            onChange={value => onChangeSearchQuery(value, "bookInfo.publisher")}
            label="Издательство"
            getValueFromProperty="publisherName"
            showClear
            currentValue={
              _.has(searchQuery["bookInfo.publisher"], "$in")
                ? searchQuery["bookInfo.publisher"].$in
                : []
            }
          />
          <UniqueDropdown
            axsQuery={{ params: { options: { limit: 999 } } }}
            axiosGetLink="/book-categories"
            axiosPostLink="/book-categories"
            storeParam={PARAMS.CATEGORIES}
            multiple
            required
            onChange={value =>
              onChangeSearchQuery(value, "bookInfo.categories")
            }
            label="Категория"
            getValueFromProperty="categoryName"
            showClear
            currentValue={
              _.has(searchQuery["bookInfo.categories"], "$in")
                ? searchQuery["bookInfo.categories"].$in
                : []
            }
          />
          <UniqueDropdown
            axsQuery={{ params: { options: { limit: 999 } } }}
            axiosGetLink="/book-languages"
            axiosPostLink="/book-languages"
            storeParam={PARAMS.LANGUAGES}
            multiple
            required
            onChange={value => onChangeSearchQuery(value, "bookInfo.language")}
            label="Язык"
            getValueFromProperty="languageName"
            showClear
            currentValue={
              _.has(searchQuery["bookInfo.language"], "$in")
                ? searchQuery["bookInfo.language"].$in
                : []
            }
          />
        </Form.Group>
      </Accordion.Content>
    </Accordion>
  );
}
