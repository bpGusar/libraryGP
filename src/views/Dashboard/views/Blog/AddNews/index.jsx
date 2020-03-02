/* eslint-disable react/prefer-stateless-function */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component } from "react";
import { Segment, Header as SemHeader, Button, Input } from "semantic-ui-react";
import uniqid from "uniqid";
import _ from "lodash";
import { branch } from "baobab-react/higher-order";
import { withRouter } from "react-router-dom";
import qStr from "query-string";

import TextEditor from "@commonViews/TextEditor";

import { PARAMS } from "@store";
import { storeData } from "@act";

import axs from "@axios";

class AddNews extends Component {
  constructor(props) {
    super(props);

    const { location } = props;
    const query = qStr.parse(location.search);

    this.state = {
      postData: {
        header: "",
        text: {}
      },
      postId: "",
      isLoading: false,
      isEdit: query.mode === "edit"
    };
  }

  componentDidMount() {
    const { location } = this.props;
    const query = qStr.parse(location.search);

    if (
      query.mode === "edit" &&
      _.has(query, "postId") &&
      !_.isEmpty(query.postId)
    ) {
      this.handleGetPostInfo(query.postId);
    }
  }

  handleGetPostInfo = postId => {
    this.setState({
      isLoading: true
    });
    axs.get(`/blog/${postId}`).then(resp => {
      if (!resp.data.error) {
        this.setState({
          isLoading: false,
          postData: {
            header: resp.data.payload[0].header,
            text: resp.data.payload[0].text
          },
          postId: resp.data.payload[0]._id
        });
      }
    });
  };

  onSubmit = () => {
    const { postData, isEdit, postId } = this.state;
    const { dispatch, history } = this.props;
    this.setState({
      isLoading: true
    });
    if (!_.isEmpty(postData.text) && !_.isEmpty(postData.header)) {
      axs({
        method: isEdit ? "put" : "post",
        url: "/blog",
        data: isEdit ? { postData, postId } : { postData }
      }).then(resp => {
        if (!resp.data.error) {
          this.setState({
            isLoading: false
          });
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
    const { postData, isLoading, isEdit } = this.state;

    return (
      <>
        <SemHeader as="h3" attached="top">
          {isEdit ? "Редактировать запись" : "Добавить запись"}
        </SemHeader>
        <Segment attached loading={isLoading}>
          <Input
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
            {!isLoading && (
              <TextEditor
                onChange={value => this.handleOnChange("text", value)}
                data={postData.text}
              />
            )}
          </Segment>
          <br />
          <Button
            type="submit"
            disabled={_.isEmpty(postData.text) || _.isEmpty(postData.header)}
            onClick={this.onSubmit}
            color="blue"
          >
            {isEdit ? "Сохранить" : "Опубликовать"}
          </Button>
        </Segment>
      </>
    );
  }
}

export default withRouter(branch({}, AddNews));
