import React from "react";
import { Form, Icon, Accordion } from "semantic-ui-react";
import _ from "lodash";

import UniqueDropdown from "@views/common/UniqueDropdown/UniqueDropdown";

import { PARAMS } from "@store";

export default function Filters(props) {
  const {
    activeAccordionIndex,
    onChangeSearchQuery,
    onClickAccorion,
    searchQuery
  } = props;
  return (
    <Accordion className="mb-3">
      <Accordion.Title
        active={activeAccordionIndex === 0}
        index={0}
        onClick={(e, titleProp) => onClickAccorion(e, titleProp)}
      >
        <Icon name="dropdown" />
        Дополнительные фильтры
      </Accordion.Title>
      <Accordion.Content active={activeAccordionIndex === 0}>
        <Form.Group widths="equal">
          <UniqueDropdown
            axiosGetLink="/book-authors"
            axiosPostLink="/book-authors"
            storeParam={PARAMS.AUTHORS}
            multiple
            required
            onChange={value => onChangeSearchQuery(value, "bookInfo.authors")}
            label="Автор"
            dropdownValueName="authorName"
            showClear
            currentValue={
              _.has(searchQuery["bookInfo.authors"], "$in")
                ? searchQuery["bookInfo.authors"].$in
                : []
            }
          />
          <UniqueDropdown
            axiosGetLink="/book-publishers"
            axiosPostLink="/book-publishers"
            storeParam={PARAMS.PUBLISHERS}
            multiple
            required
            onChange={value => onChangeSearchQuery(value, "bookInfo.publisher")}
            label="Издательство"
            dropdownValueName="publisherName"
            showClear
            currentValue={
              _.has(searchQuery["bookInfo.publisher"], "$in")
                ? searchQuery["bookInfo.publisher"].$in
                : []
            }
          />
          <UniqueDropdown
            axiosGetLink="/book-categories"
            axiosPostLink="/book-categories"
            storeParam={PARAMS.CATEGORIES}
            multiple
            required
            onChange={value =>
              onChangeSearchQuery(value, "bookInfo.categories")
            }
            label="Категория"
            dropdownValueName="categoryName"
            showClear
            currentValue={
              _.has(searchQuery["bookInfo.categories"], "$in")
                ? searchQuery["bookInfo.categories"].$in
                : []
            }
          />
          <UniqueDropdown
            axiosGetLink="/book-languages"
            axiosPostLink="/book-languages"
            storeParam={PARAMS.LANGUAGES}
            multiple
            required
            onChange={value => onChangeSearchQuery(value, "bookInfo.language")}
            label="Язык"
            dropdownValueName="languageName"
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
