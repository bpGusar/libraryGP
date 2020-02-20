import React, { Component } from "react";
import _ from "lodash";

import { Header } from "semantic-ui-react";
import CustomLoader from "@commonViews/Loader";
import Text from "../components/Text";

import axs from "@axios";

export default class BlogFullPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post: {},
      isLoading: false
    };
  }

  componentDidMount() {
    this.handleGetPost();
  }

  handleGetPost() {
    const {
      match: {
        params: { id }
      }
    } = this.props;

    this.setState({
      isLoading: true
    });

    axs.get(`/blog/${id}`).then(resp => {
      if (!resp.data.error) {
        this.setState({
          isLoading: false,
          post: resp.data.payload[0]
        });
      }
    });
  }

  render() {
    const { post, isLoading } = this.state;
    return (
      <>
        {isLoading && <CustomLoader />}
        {!_.isEmpty(post) && (
          <>
            <Header as="h1">{post.header}</Header>
            <Text jsonData={post.text} />
          </>
        )}
      </>
    );
  }
}
