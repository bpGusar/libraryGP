/* eslint-disable react/destructuring-assignment */
import React, { Component } from "react";
import { Button, Message, Form, Segment, Header } from "semantic-ui-react";
import { isEmpty } from "lodash";

import axs from "@axios";

export default class AddAuthor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      langData: {
        languageName: "",
        langCode: ""
      },
      isLoading: false,
      addedElement: "",
      errorData: {
        error: false,
        value: ""
      }
    };
  }

  handlePost = () => {
    const { postLink } = this.props;
    const { langData } = this.state;
    this.setState({
      isLoading: true,
      addedElement: "",
      errorData: {
        error: false,
        value: ""
      }
    });

    axs.post(postLink, langData).then(resp => {
      if (!resp.data.error) {
        this.setState(ps => ({
          langData: {
            languageName: "",
            langCode: ""
          },
          isLoading: false,
          addedElement: ps.langData.languageName
        }));
      } else {
        this.setState(ps => ({
          isLoading: false,
          errorData: {
            error: true,
            value: ps.langData.languageName
          }
        }));
      }
    });
  };

  render() {
    const { isLoading, addedElement, errorData, langData } = this.state;
    const { formHeaderText } = this.props;
    const { languageName, langCode } = langData;
    return (
      <>
        <Header as="h3" attached="top">
          {formHeaderText}
        </Header>
        <Segment attached loading={isLoading}>
          <Form
            onSubmit={this.handlePost}
            success={!isEmpty(addedElement)}
            error={errorData.error}
          >
            <Form.Input
              fluid
              required
              label="Название языка"
              name="languageName"
              placeholder="Название языка"
              value={languageName}
              onChange={(e, { name, value }) =>
                this.setState({ langData: { ...langData, [name]: value } })
              }
            />
            <Form.Input
              fluid
              required
              label="Код языка"
              name="langCode"
              placeholder="Код языка"
              value={langCode}
              onChange={(e, { name, value }) =>
                this.setState({ langData: { ...langData, [name]: value } })
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
            {errorData.error && (
              <Message
                error
                header="Ошибка"
                content={
                  <p>
                    Элемент <b>{errorData.value}</b> не может быть добавлен так
                    как он не уникален!
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
