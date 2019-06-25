import React from 'react';
import { branch } from 'baobab-react/higher-order';
import { Button, Divider, Grid, Header, Icon, Segment, Form, Popup } from 'semantic-ui-react';
import axios from 'axios';

import SearchResults from '@views/AddBookPage/SearchResults.js';

class AddBookPage extends React.Component {
  state = {
    searchQuery: '',
    loading: false,
    showResults: false,
    results: [],
    popUpISBN: false,
  };

  componentDidMount() {
    localStorage.getItem('popUpISBN') === 'false' &&
      this.setState({
        popUpISBN: true,
      });
  }

  handleSubmit = () => {
    const { searchQuery } = this.state;

    this.setState({
      loading: !this.state.loading,
      showResults: false,
    });

    axios.get(`https://www.googleapis.com/books/v1/volumes?q=${searchQuery}`).then((res) => {
      this.setState({
        loading: !this.state.loading,
        showResults: true,
        results: res.data,
      });
    });
  };

  _hidePopup4eva() {
    localStorage.setItem('popUpISBN', false);
    this.setState({
      popUpISBN: true,
    });
  }

  render() {
    const { searchQuery, loading, showResults, results, popUpISBN } = this.state;
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
                      disabled={popUpISBN}
                      trigger={
                        <Form.Input
                          placeholder='Введите запрос'
                          name='searchQuery'
                          value={searchQuery}
                          onChange={(e) => this.setState({ [e.target.name]: e.target.value })}
                        />
                      }
                      children={
                        <>
                          <div className='header'>Поиск с помощью Google Books</div>
                          <div className='content'>
                            Введите номер searchQuery в исходном формате. Для более точного поиска попробуйте ввести searchQuery без тире.
                          </div>
                          <br />
                          <Button size='small' onClick={() => this._hidePopup4eva()}>
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
