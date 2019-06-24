import React from 'react';
import { Button, Icon, Image, Item, Label } from 'semantic-ui-react';

export default class SearchResults extends React.Component {
  render() {
    const { results } = this.props;
    return (
      <>
        {results.items.map((el, i) => {
          return (
            <Item.Group divided key={i}>
              <Item>
                <Item.Image src={el.volumeInfo.imageLinks.thumbnail} />

                <Item.Content>
                  <Item.Header>{el.volumeInfo.title}</Item.Header>
                  <Item.Meta>
                    <span className='cinema'>
                      {el.volumeInfo.publisher} | {el.volumeInfo.publishedDate}
                    </span>
                  </Item.Meta>
                  <Item.Description>{el.volumeInfo.description}</Item.Description>
                  <Item.Extra>
                    <Button primary floated='right'>
                      Добавить в базу
                      <Icon name='right chevron' />
                    </Button>
                    {el.volumeInfo.hasOwnProperty('authors') &&
                      el.volumeInfo.authors.map((el, i) => {
                        return <Label icon='pencil alternate' key={i}>{el}</Label>;
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
}
