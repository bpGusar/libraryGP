import React from "react";
import _ from "lodash";
import { Button, Icon, Item, Label, Segment, Header } from "semantic-ui-react";

import { setBookIntoStore } from "@act";

export default function SearchResults(props) {
  const { results, dispatch } = props;

  function addBookToStore(book) {
    const { history } = props;
    dispatch(setBookIntoStore, book);
    history.push("/dashboard/add-book");
  }

  return (
    <>
      {results.totalItems !== 0 ? (
        results.items.map(resultItem => (
          <Item.Group divided key={resultItem.id}>
            <Item>
              <Item.Image
                src={
                  _.has(resultItem.volumeInfo, "imageLinks")
                    ? resultItem.volumeInfo.imageLinks.thumbnail
                    : "https://react.semantic-ui.com/images/wireframe/image.png"
                }
              />

              <Item.Content>
                <Item.Header>{resultItem.volumeInfo.title}</Item.Header>
                <Item.Meta>
                  <span className="cinema">
                    {resultItem.volumeInfo.publisher} |{" "}
                    {resultItem.volumeInfo.publishedDate}
                  </span>
                </Item.Meta>
                <Item.Description>
                  {resultItem.volumeInfo.description}
                </Item.Description>
                <Item.Extra>
                  <Button
                    primary
                    floated="right"
                    onClick={() => addBookToStore(resultItem)}
                  >
                    Открыть в редакторе
                    <Icon name="right chevron" />
                  </Button>
                  {_.has(resultItem.volumeInfo, "authors") &&
                    resultItem.volumeInfo.authors.map(author => {
                      return (
                        <Label
                          icon="pencil alternate"
                          content={author}
                          key={author}
                        />
                      );
                    })}
                </Item.Extra>
              </Item.Content>
            </Item>
          </Item.Group>
        ))
      ) : (
        <Segment placeholder>
          <Header icon>
            <Icon name="search" color="blue" />
            Поиск не дал результатов.
          </Header>
        </Segment>
      )}
    </>
  );
}
