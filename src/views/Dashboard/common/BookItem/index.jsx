import React from "react";
import { Item, Label, Icon, Divider } from "semantic-ui-react";

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
  return (
    <Item
      style={{
        backgroundColor:
          book.pseudoDeleted === "true" ? "rgba(255, 0, 0, 0.08)" : undefined
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
            onEditClick={() => onEditClick(book)}
            onDeleteClick={() => onDeleteClick(book)}
            onRestoreClick={() => onRestoreClick(book)}
            isBookHidden={book.pseudoDeleted === "true"}
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
