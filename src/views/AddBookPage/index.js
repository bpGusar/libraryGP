import React from 'react';
import { branch } from 'baobab-react/higher-order';
import { Button, Divider, Grid, Header, Icon, Segment, Form, Popup } from 'semantic-ui-react';
import axios from 'axios';

import SearchResults from '@views/AddBookPage/SearchResults.js';

class AddBookPage extends React.Component {
  state = {
    ISBN: '',
    loading: false,
    showResults: false,
    results: [],
  };

  handleSubmit = () => {
    const { ISBN } = this.state;

    this.setState({
      loading: !this.state.loading,
      showResults: false,
    });

    axios.get(`https://www.googleapis.com/books/v1/volumes?q=${ISBN}`).then((res) => {
      this.setState({
        loading: !this.state.loading,
        showResults: true,
        results: res.data,
      });
    });
  };

  _hidePopup4eva() {
    localStorage.setItem('popUpISBN', false);
  }

  render() {
    const { ISBN, loading, showResults, results } = this.state;
    return (
      <>
        <Segment placeholder>
          <Grid columns={2} stackable textAlign='center'>
            <Divider vertical>Или</Divider>

            <Grid.Row verticalAlign='middle'>
              <Grid.Column>
                <Header icon>
                  <Icon name='search' />
                  Добавить книгу автоматически
                </Header>

                <Form onSubmit={this.handleSubmit} loading={loading}>
                  <Form.Group>
                    <Popup
                      disabled={localStorage.getItem('popUpISBN') === "false"}
                      trigger={
                        <Form.Input
                          placeholder='Введите ISBN книги'
                          name='ISBN'
                          value={ISBN}
                          onChange={(e) => this.setState({ [e.target.name]: e.target.value })}
                        />
                      }
                      header='Поиск с помощью Google Books'
                      children={
                        <>
                          <div class='header'>Поиск с помощью Google Books</div>
                          <div class='content'>Введите номер ISBN в исходном формате. Для более точного поиска попробуйте ввести ISBN без тире.</div>
                          <br />
                          <Button size='small' onClick={this._hidePopup4eva}>
                            Больше не показывать
                          </Button>
                        </>
                      }
                      on='click'
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Button primary>
                      <Icon name='search' /> Поиск
                    </Form.Button>
                  </Form.Group>
                </Form>
              </Grid.Column>

              <Grid.Column>
                <Header icon>
                  <Icon name='pencil alternate' />
                  Ввести данные вручную
                </Header>
                <Button primary>Ввести</Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        {showResults && <SearchResults results={results} />}
      </>
    );
  }
}

export default branch({}, AddBookPage);
