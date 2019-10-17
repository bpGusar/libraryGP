import React, { Component } from "react";
import { Button, Segment, Form, Header, Divider } from "semantic-ui-react";

export default class ManageOrderedBooks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isDataLoading: false,
      readerId: ""
    };
  }

  // handleSubmitForm(e, getQuery) {}

  render() {
    const { isDataLoading, readerId } = this.state;
    return (
      <>
        <Header as="h3" attached="top">
          Управление выданными книгами
        </Header>
        <Segment attached loading={isDataLoading}>
          <Form onSubmit={e => this.handleSubmitForm(e, { readerId })}>
            <Form.Group widths="equal">
              <Form.Input
                type="number"
                value={readerId}
                onChange={(e, { name, value }) =>
                  this.setState({
                    [name]: value
                  })
                }
                fluid
                name="readerId"
                label="Номер читательского билета"
                required
              />
              <Button type="submit" primary>
                Найти
              </Button>
            </Form.Group>
            <Divider />
            <Button onClick={e => this.handleSubmitForm(e, {})} primary>
              Показать все
            </Button>
            <Divider />
          </Form>
        </Segment>
      </>
    );
  }
}
