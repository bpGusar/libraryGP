import React from "react";
import { Item, Label, Icon, Dropdown } from "semantic-ui-react";

export default function BookItem(props) {
  const { book } = props;
  return (
    <Item>
      <Item.Image
        as="a"
        href={`/book/${book._id}`}
        target="blanc"
        size="tiny"
        src={book.bookInfo.imageLinks.poster}
      />
      <Item.Content>
        <Item.Header target="blanc">
          <Dropdown text={book.bookInfo.title}>
            <Dropdown.Menu>
              <Dropdown.Item text="Редактировать" icon="pencil alternate" />
              <Dropdown.Divider />
              <Dropdown.Item text="Удалить" icon="close" />
            </Dropdown.Menu>
          </Dropdown>
        </Item.Header>
        <Item.Meta>
          <span className="cinema">
            {book.bookInfo.authors.map(el => el.authorName).join(", ")}
          </span>
        </Item.Meta>
        <Item.Extra>
          <Label>
            <Icon name="calendar" />
            Опубликовано: {book.bookInfo.publishedDate}
          </Label>
          <Label>
            <Icon name="calendar" />
            Добавлено: {book.dateAdded}
          </Label>
          <Label>
            <Icon name="window restore" />
            Издатель:{" "}
            {book.bookInfo.publisher.map(el => el.publisherName).join(", ")}
          </Label>
          <Label>
            <Icon name="unordered list" />
            Категория:{" "}
            {book.bookInfo.categories.map(el => el.categoryName).join(", ")}
          </Label>
          <Label>
            <Icon name="language" />
            Язык: {book.bookInfo.language.map(el => el.languageName).join(", ")}
          </Label>
        </Item.Extra>
      </Item.Content>
    </Item>
  );
}
