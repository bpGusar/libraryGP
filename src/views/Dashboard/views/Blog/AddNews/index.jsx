/* eslint-disable react/prefer-stateless-function */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component } from "react";
import { Segment, Header as SemHeader, Form, Button } from "semantic-ui-react";
import uniqid from "uniqid";
import _ from "lodash";
import { branch } from "baobab-react/higher-order";
import { withRouter } from "react-router-dom";

import TextEditor from "@commonViews/TextEditor";

import { PARAMS } from "@store";
import { storeData } from "@act";

import axs from "@axios";

class AddNews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postData: {
        header: "",
        text: {}
      }
    };
  }

  onSubmit = () => {
    const { postData } = this.state;
    const { dispatch, history } = this.props;
    if (!_.isEmpty(postData.text) && !_.isEmpty(postData.header)) {
      axs.post(`/blog`, { postData }).then(resp => {
        if (!resp.data.error) {
          dispatch(storeData, PARAMS.INFO_PAGE, {
            text: resp.data.message,
            type: "success"
          });
          history.push("/dashboard/info-page");
        }
      });
    }
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
        <SemHeader as="h3" attached="top">
          Добавить запись
        </SemHeader>
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
          <Segment>
            <TextEditor
              onChange={value => this.handleOnChange("text", value)}
            />
          </Segment>
          <br />
          <Button
            type="submit"
            disabled={_.isEmpty(postData.text) || _.isEmpty(postData.header)}
            onClick={this.onSubmit}
          >
            Опубликовать
          </Button>
        </Segment>
      </>
    );
  }
}

export default withRouter(branch({}, AddNews));
