import React from 'react';
import { Button, Icon, Item, Label, Segment, Header } from 'semantic-ui-react';

export default class SearchResults extends React.Component {
  render() {
    const { results } = this.props;
    console.log(results);
    return (
      <>
        {results.totalItems !== 0 ? results.items.map((el, i) => (
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
                      return <Label icon='pencil alternate' content={el} key={i} />;
                    })}
                </Item.Extra>
              </Item.Content>
            </Item>
          </Item.Group>
        )) : (<Segment placeholder>
          <Header icon>
            <Icon name='search' color="blue" />
            Поиск не дал результатов.
          </Header>
        </Segment>)}
      </>
    );
  }
}
