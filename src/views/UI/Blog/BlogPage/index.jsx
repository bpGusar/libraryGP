import React from "react";
import { Header, Segment, Icon } from "semantic-ui-react";
import _ from "lodash";

import BlogItem from "./components/Item";

import axs from "@axios";

export default class BlogPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: []
    };
  }

  componentDidMount() {
    this.getPosts();
  }

  getPosts = () => {
    axs
      .get(`/blog`, { params: { page: 1, limit: 99, sort: "desc" } })
      .then(resp => {
        if (!resp.data.error) {
          this.setState({
            posts: resp.data.payload
          });
        }
      });
  };

  render() {
    const { posts } = this.state;
    console.log(posts);
    return (
      <div>
        <Header as="h1">Блог</Header>
        <hr />
        {_.isEmpty(posts) ? (
          <Segment placeholder>
            <Header icon>
              <Icon name="list" />
              Ничего здесь нет, пока что....
            </Header>
          </Segment>
        ) : (
          posts.map(post => (
            <BlogItem
              header={post.header}
              link={`/blog/${post._id}`}
              text={post.text}
            />
          ))
        )}
      </div>
    );
  }
}
