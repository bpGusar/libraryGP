import React from "react";
import { Item, Label, Icon, Divider, Segment } from "semantic-ui-react";
import _ from "lodash";

import BookOptions from "@commonViews/BookOptions";

import { isAdmin } from "@utils";

export default function BookItem(props) {
  const {
    book,
    onDeleteClick,
    onEditClick,
    onRestoreClick,
    renderCustomInfo,
    dividedInfo,
    showOptions
  } = props;
  if (_.isNull(book)) {
    return (
      <Item>
        <Segment
          style={{
            width: "100%"
          }}
        >
          <Icon name="exclamation triangle" />
          Неизвестная книга, возможно она удалена и не может быть показана
        </Segment>
      </Item>
    );
  }
  const bookHidden = book.pseudoDeleted === "true";

  return (
    <Item
      style={{
        backgroundColor: bookHidden ? "rgba(255, 0, 0, 0.08)" : undefined
      }}
    >
      <Item.Image
        as="a"
        href={`/book/${book._id}`}
        target="blanc"
        size="tiny"
        src={book.bookInfo.imageLinks.poster}
      />
      <Item.Content>
        <Item.Header as="a" href={`/book/${book._id}`} target="blanc">
          {book.bookInfo.title}
        </Item.Header>
        {(onEditClick || onDeleteClick) && showOptions && (
          <BookOptions
            options={[
              {
                text: "Редактировать",
                icon: "pencil alternate",
                onClick: () => onEditClick(book)
              },
              {
                text: !bookHidden ? "Скрыть" : "Восстановить видимость",
                icon: !bookHidden ? "close" : "reply",
                onClick: !bookHidden
                  ? () => onDeleteClick(book)
                  : () => onRestoreClick(book)
              }
            ]}
            isAdmin={isAdmin()}
          />
        )}
        <Item.Meta>
          <span className="cinema">
            {book.bookInfo.authors.map(el => el.authorName).join(", ")}
          </span>
        </Item.Meta>
        <Item.Description>
          {book.bookInfo.description.substring(0, 200)}...
        </Item.Description>
        {dividedInfo && <Divider />}
        <Item.Extra>
          {renderCustomInfo ? (
            renderCustomInfo()
          ) : (
            <>
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
                Язык:{" "}
                {book.bookInfo.language.map(el => el.languageName).join(", ")}
              </Label>
            </>
          )}
        </Item.Extra>
      </Item.Content>
    </Item>
  );
}
