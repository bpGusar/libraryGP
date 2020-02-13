/* eslint-disable react/prefer-stateless-function */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component } from "react";
import { Segment, Header, Form, Button } from "semantic-ui-react";
import uniqid from "uniqid";
import _ from "lodash";
import TextEditor from "@commonViews/TextEditor";

import axs from "@axios";

export default class AddNews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postData: {
        header: "",
        text: ""
      }
    };
  }

  onSubmit = () => {
    console.log(this.state);
    const { postData } = this.state;
    axs.post(`/blog`, { postData }).then(resp => {
      if (!resp.data.error) {
        console.log(resp.data);
      }
    });
  };

  handleOnChange(name, val) {
    const { postData } = this.state;
    const postDataCloned = _.cloneDeep(postData);

    _.set(postDataCloned, name, val);

    this.setState({
      postData: postDataCloned
    });
  }

  render() {
    const { postData } = this.state;

    return (
      <>
        <Header as="h3" attached="top">
          Добавить запись
        </Header>
        <Segment attached>
          <Form.Input
            fluid
            required
            label="Заголовок"
            name="header"
            value={postData.header}
            onChange={(e, { name, value }) => this.handleOnChange(name, value)}
          />
          <br />
          <label htmlFor={uniqid(`description_`)}>Описание</label>
          <TextEditor onChange={val => this.handleOnChange("text", val)} />
          <br />
          <Button type="submit" onClick={this.onSubmit}>
            Опубликовать
          </Button>
        </Segment>
      </>
    );
  }
}
