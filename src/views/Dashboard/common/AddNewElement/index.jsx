/* eslint-disable react/destructuring-assignment */
import React, { Component } from "react";
import { Button, Message, Form, Segment, Header } from "semantic-ui-react";
import { isEmpty } from "lodash";

import axs from "@axios";

export default class AddAuthor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      [props.dbPropertyName]: "",
      isLoading: false,
      addedElement: ""
    };
  }

  handlePost = () => {
    const { postLink, dbPropertyName } = this.props;
    this.setState({
      isLoading: true,
      addedElement: ""
    });
    axs
      .post(postLink, { [dbPropertyName]: this.state[dbPropertyName] })
      .then(resp => {
        if (!resp.data.error) {
          this.setState(ps => ({
            [dbPropertyName]: "",
            isLoading: false,
            addedElement: ps[dbPropertyName]
          }));
        }
      });
  };

  render() {
    const { isLoading, addedElement } = this.state;
    const { dbPropertyName, formHeaderText, inputLabel } = this.props;
    const inputValue = this.state[dbPropertyName];
    return (
      <>
        <Header as="h3" attached="top">
          {formHeaderText}
        </Header>
        <Segment attached loading={isLoading}>
          <Form onSubmit={this.handlePost} success={!isEmpty(addedElement)}>
            <Form.Input
              fluid
              label={inputLabel}
              name={dbPropertyName}
              placeholder={inputLabel}
              value={inputValue}
              onChange={(e, { name, value }) =>
                this.setState({ [name]: value })
              }
            />
            {!isEmpty(addedElement) && (
              <Message
                success
                header="Успешно"
                content={
                  <p>
                    Элемент <b>{addedElement}</b> успешно добавлен!
                  </p>
                }
              />
            )}
            <Button type="submit" color="green">
              Добавить
            </Button>
          </Form>
        </Segment>
      </>
    );
  }
}
