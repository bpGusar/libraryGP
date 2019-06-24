import React from 'react';
import { branch } from 'baobab-react/higher-order';
import { Button, Divider, Grid, Header, Icon, Search, Segment } from 'semantic-ui-react';

class AddBookPage extends React.Component {
  render() {
    return (
      <Segment placeholder>
        <Grid columns={2} stackable textAlign='center'>
          <Divider vertical>Или</Divider>

          <Grid.Row verticalAlign='middle'>
            <Grid.Column>
              <Header icon>
                <Icon name='search' />
                Добавить книгу автоматически
              </Header>

              <Search placeholder='Введите ISBN' />
            </Grid.Column>

            <Grid.Column>
              <Header icon>
                <Icon name='pencil alternate' />
                Add New Country
              </Header>
              <Button primary>Ввести данные вручную</Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
}

export default branch({}, AddBookPage);
