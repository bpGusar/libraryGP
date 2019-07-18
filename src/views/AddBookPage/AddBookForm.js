import React from "react";
import { Button, Icon, Item, Label } from "semantic-ui-react";

export default function SearchResults(props) {
  const { results } = props;
  return (
    <>
      {results.items.map(item => {
        return (
          <Item.Group divided key={item.volumeInfo.title}>
            <Item>
              <Item.Image src={item.volumeInfo.imageLinks.thumbnail} />

              <Item.Content>
                <Item.Header>{item.volumeInfo.title}</Item.Header>
                <Item.Meta>
                  <span className="cinema">
                    {item.volumeInfo.publisher} |{" "}
                    {item.volumeInfo.publishedDate}
                  </span>
                </Item.Meta>
                <Item.Description>
                  {item.volumeInfo.description}
                </Item.Description>
                <Item.Extra>
                  <Button primary floated="right">
                    Добавить в базу
                    <Icon name="right chevron" />
                  </Button>
                  {Object.prototype.hasOwnProperty.call(
                    item.volumeInfo,
                    "authors"
                  ) &&
                    item.volumeInfo.authors.map(author => {
                      return (
                        <Label icon="pencil alternate" key={author}>
                          {author}
                        </Label>
                      );
                    })}
                </Item.Extra>
              </Item.Content>
            </Item>
          </Item.Group>
        );
      })}
    </>
  );
}
