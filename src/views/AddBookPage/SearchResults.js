import React from "react";
import { Button, Icon, Item, Label, Segment, Header } from "semantic-ui-react";

export default function SearchResults(props) {
  const { results } = props;
  console.log(results);
  return (
    <>
      {results.totalItems !== 0 ? (
        results.items.map(el => (
          <Item.Group divided key={el}>
            <Item>
              <Item.Image
                src={
                  Object.prototype.hasOwnProperty.call(
                    el.volumeInfo,
                    "imageLinks"
                  )
                    ? el.volumeInfo.imageLinks.thumbnail
                    : "https://react.semantic-ui.com/images/wireframe/image.png"
                }
              />

              <Item.Content>
                <Item.Header>{el.volumeInfo.title}</Item.Header>
                <Item.Meta>
                  <span className="cinema">
                    {el.volumeInfo.publisher} | {el.volumeInfo.publishedDate}
                  </span>
                </Item.Meta>
                <Item.Description>{el.volumeInfo.description}</Item.Description>
                <Item.Extra>
                  <Button primary floated="right">
                    Добавить в базу
                    <Icon name="right chevron" />
                  </Button>
                  {Object.prototype.hasOwnProperty.call(
                    el.volumeInfo,
                    "authors"
                  ) &&
                    el.volumeInfo.authors.map(author => {
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
