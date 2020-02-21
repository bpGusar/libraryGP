import React, { Component } from "react";
import { Form, Segment, Item, Button } from "semantic-ui-react";
import _ from "lodash";
import { DateTime } from "luxon";
import { Link } from "react-router-dom";

import FormContainer from "@DUI/common/FormContainer";
import BookOptions from "@commonViews/BookOptions";
import ModalWindow from "@DUI/common/Modal";

import { isAdmin } from "@utils";

import axs from "@axios";

export default class ManageBlogPosts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      isLoading: false,
      options: {
        sort: "desc",
        limit: 10,
        page: 1,
        displayMode: "all"
      },
      searchQuery: {},
      maxElements: 0,
      deleteOrRestorePostId: ""
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

  hideOrRestorePost(hidePost, whatNeedToDo) {
    const { deleteOrRestorePostId } = this.state;

    const deleteBook = whatNeedToDo === "delete";
    const restoreBook = whatNeedToDo === "restore";

    if (hidePost) {
      this.setState({
        isLoading: true
      });
      axs({
        method: (deleteBook && "delete") || (restoreBook && "put"),
        url:
          (deleteBook && `/blog/${deleteOrRestorePostId}`) ||
          (restoreBook && `/blog/${deleteOrRestorePostId}/restore`)
      }).then(resp => {
        if (!resp.data.error) {
          this.setState(
            {
              deleteOrRestorePostId: "",
              isLoading: false,
              isHidePostModalOpen: false,
              isRestorePostModalOpen: false
            },
            () => this.handleGetPosts()
          );
        }
      });
    } else {
      this.setState({
        isHidePostModalOpen: false,
        isRestorePostModalOpen: false,
        deleteOrRestorePostId: ""
      });
    }
  }

  openHideOrRestorePostModal(postId, whichModalNeedOpen) {
    this.setState({
      [whichModalNeedOpen]: true,
      deleteOrRestorePostId: postId
    });
  }

  render() {
    const {
      isLoading,
      options,
      maxElements,
      posts,
      isHidePostModalOpen,
      isRestorePostModalOpen
    } = this.state;
    return (
      <>
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
                {posts.map(post => {
                  const isPostHidden = post.pseudoDeleted === "true";
                  return (
                    <Item
                      key={post._id}
                      style={{
                        backgroundColor: isPostHidden
                          ? "rgba(255, 0, 0, 0.08)"
                          : undefined
                      }}
                    >
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
                              text: !isPostHidden
                                ? "Скрыть"
                                : "Восстановить видимость",
                              icon: !isPostHidden ? "close" : "reply",
                              onClick: !isPostHidden
                                ? () =>
                                    this.openHideOrRestorePostModal(
                                      post._id,
                                      "isHidePostModalOpen"
                                    )
                                : () =>
                                    this.openHideOrRestorePostModal(
                                      post._id,
                                      "isRestorePostModalOpen"
                                    )
                            }
                          ]}
                          isAdmin={isAdmin()}
                        />
                        <Item.Description>
                          {DateTime.fromISO(post.createdAt)
                            .setLocale("ru")
                            .toFormat("dd MMMM yyyy")}{" "}
                          |{" "}
                          <Link
                            target="blanc"
                            to={`/profile/${post.userId._id}`}
                          >
                            {post.userId.login}
                          </Link>
                        </Item.Description>
                      </Item.Content>
                    </Item>
                  );
                })}
              </Item.Group>
            </Segment>
          )}
        />
        <ModalWindow
          header="Скрыть пост"
          open={isHidePostModalOpen}
          onCancelClick={() => this.hideOrRestorePost(false, "delete")}
          onRunClick={() => this.hideOrRestorePost(true, "delete")}
          firstPageContent={<p>Вы действительно хотите скрыть пост?</p>}
          showFirstPageContentIf
          isLoading={isLoading}
          disableRunButton={isLoading}
        />
        <ModalWindow
          header="Восстановить видимость поста"
          open={isRestorePostModalOpen}
          onCancelClick={() => this.hideOrRestorePost(false, "restore")}
          onRunClick={() => this.hideOrRestorePost(true, "restore")}
          firstPageContent={
            <p>Вы действительно хотите восстановить видимость поста?</p>
          }
          showFirstPageContentIf
          isLoading={isLoading}
          disableRunButton={isLoading}
        />
      </>
    );
  }
}
