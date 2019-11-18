import React from "react";
import { Item, Label, Icon, Dropdown } from "semantic-ui-react";

export default function BookItem(props) {
  const { book, onDeleteClick, onEditClick } = props;
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
              <Dropdown.Item
                text="Редактировать"
                icon="pencil alternate"
                onClick={() => onEditClick(book)}
              />
              <Dropdown.Divider />
              <Dropdown.Item
                text="Удалить"
                icon="close"
                onClick={() => onDeleteClick(book)}
              />
            </Dropdown.Menu>
          </Dropdown>
        </Item.Header>
        <Item.Meta>
          <span className="cinema">
            {book.bookInfo.authors.map(el => el.authorName).join(", ")}
          </span>
        </Item.Meta>
        <Item.Description>
          {book.bookInfo.description.substring(0, 200)}...
        </Item.Description>
        <Item.Extra>
          <Label color="blue">
            <Icon name="calendar" />
            Опубликовано: {book.bookInfo.publishedDate}
          </Label>
          <Label color="brown">
            <Icon name="calendar" />
            Добавлено: {book.dateAdded}
          </Label>
          <Label color="black">
            <Icon name="window restore" />
            Издатель:{" "}
            {book.bookInfo.publisher.map(el => el.publisherName).join(", ")}
          </Label>
          <Label color="green">
            <Icon name="unordered list" />
            Категория:{" "}
            {book.bookInfo.categories.map(el => el.categoryName).join(", ")}
          </Label>
          <Label color="orange">
            <Icon name="language" />
            Язык: {book.bookInfo.language.map(el => el.languageName).join(", ")}
          </Label>
        </Item.Extra>
      </Item.Content>
    </Item>
  );
}
