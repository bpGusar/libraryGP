import React, { Component } from "react";
import { Form, Segment, Item, Button } from "semantic-ui-react";
import _ from "lodash";
import { DateTime } from "luxon";
import { Link } from "react-router-dom";

import FormContainer from "@DUI/common/FormContainer";
import BookOptions from "@commonViews/BookOptions";

import { isAdmin } from "@utils";

import axs from "@axios";

export default class ManageBlogPosts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      isLoading: false,
      options: {
        fetch_type: 1,
        sort: "desc",
        limit: 10,
        page: 1,
        displayMode: "all"
      },
      searchQuery: {},
      maxElements: 0
    };
  }

  componentDidMount() {
    this.handleGetPosts();
  }

  onEditClick(postId) {
    const { history } = this.props;

    history.push(`/dashboard/blog/new?mode=edit&postId=${postId}`);
  }

  handleGetPosts() {
    const { options, searchQuery } = this.state;

    this.setState({
      posts: [],
      isLoading: true
    });

    axs.get(`/blog`, { params: { options, searchQuery } }).then(resp => {
      if (!resp.data.error) {
        this.setState({
          posts: resp.data.payload,
          isLoading: false,
          maxElements: resp.headers["max-elements"]
        });
      }
    });
  }

  handleChangeSearchQuery(value) {
    this.setState({
      searchQuery: {
        header: {
          $regex: value,
          $options: "i"
        }
      }
    });
  }

  render() {
    const { isLoading, options, maxElements, posts } = this.state;
    return (
      <FormContainer
        formHeader="Посты блога"
        formLoading={isLoading}
        resultLoading={isLoading}
        showPagination
        pagMaxElements={maxElements}
        pagLimit={options.limit}
        pagPage={options.page}
        pagOnPageChange={this.handlePageChange}
        form={() => (
          <Form>
            <Form.Input
              label="Название"
              onChange={(e, { value }) => this.handleChangeSearchQuery(value)}
            />
            <Button primary onClick={() => this.handleGetPosts()}>
              Поиск
            </Button>
          </Form>
        )}
        result={() => (
          <Segment placeholder={_.isEmpty(posts)}>
            <Item.Group divided>
              {posts.map(post => (
                <Item key={post._id}>
                  <Item.Content>
                    <Item.Header
                      as="a"
                      href={`/blog/${post._id}`}
                      target="blanc"
                    >
                      {post.header}
                    </Item.Header>
                    <BookOptions
                      options={[
                        {
                          text: "Редактировать",
                          icon: "pencil alternate",
                          onClick: () => this.onEditClick(post._id)
                        },
                        {
                          text: !(post.pseudoDeleted === "true")
                            ? "Скрыть"
                            : "Восстановить видимость",
                          icon: !(post.pseudoDeleted === "true")
                            ? "close"
                            : "reply",
                          onClick: !(post.pseudoDeleted === "true")
                            ? () => this.onDeleteClick()
                            : () => this.onRestoreClick()
                        }
                      ]}
                      isAdmin={isAdmin()}
                    />
                    <Item.Description>
                      {DateTime.fromISO(post.createdAt)
                        .setLocale("ru")
                        .toFormat("dd MMMM yyyy")}{" "}
                      |{" "}
                      <Link target="blanc" to={`/profile/${post.userId._id}`}>
                        {post.userId.login}
                      </Link>
                    </Item.Description>
                  </Item.Content>
                </Item>
              ))}
            </Item.Group>
          </Segment>
        )}
      />
    );
  }
}
