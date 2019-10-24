import React from "react";
import { Form, Icon, Accordion } from "semantic-ui-react";

import UniqueDropdown from "@src/common/components/UniqueDropdown/UniqueDropdown";

import { PARAMS } from "@store";

export default function Filters(props) {
  const { activeAccordionIndex, _this } = props;
  return (
    <Accordion className="mb-3">
      <Accordion.Title
        active={activeAccordionIndex === 0}
        index={0}
        onClick={_this.handleClick}
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
            onChange={value =>
              _this.handleChangeSearchQuery(value, "bookInfo.authors")
            }
            label="Автор"
            dropdownValueName="authorName"
            showClear
          />
          <UniqueDropdown
            axiosGetLink="/book-publishers"
            axiosPostLink="/book-publishers"
            storeParam={PARAMS.PUBLISHERS}
            multiple
            required
            onChange={value =>
              _this.handleChangeSearchQuery(value, "bookInfo.publisher")
            }
            label="Издательство"
            dropdownValueName="publisherName"
            showClear
          />
          <UniqueDropdown
            axiosGetLink="/book-categories"
            axiosPostLink="/book-categories"
            storeParam={PARAMS.CATEGORIES}
            multiple
            required
            onChange={value =>
              _this.handleChangeSearchQuery(value, "bookInfo.categories")
            }
            label="Категория"
            dropdownValueName="categoryName"
            showClear
          />
          <UniqueDropdown
            axiosGetLink="/book-languages"
            axiosPostLink="/book-languages"
            storeParam={PARAMS.LANGUAGES}
            multiple
            required
            onChange={value =>
              _this.handleChangeSearchQuery(value, "bookInfo.language")
            }
            label="Язык"
            dropdownValueName="languageName"
            showClear
          />
        </Form.Group>
      </Accordion.Content>
    </Accordion>
  );
}
