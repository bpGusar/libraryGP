import React from "react";
import { Header, Segment, Icon, Divider } from "semantic-ui-react";
import _ from "lodash";

import CustomLoader from "@commonViews/Loader";
import Pagination from "@commonViews/Pagination";
import axs from "@axios";
import BlogItem from "./Item";

export default class BlogPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      options: {
        page: 1,
        limit: 5,
        sort: "desc"
      },
      maxElements: 0,
      isLoading: false
    };
  }

  componentDidMount() {
    this.getPosts();
  }

  getPosts = () => {
    const { options } = this.state;
    this.setState({
      isLoading: true,
      posts: []
    });
    axs.get(`/blog`, { params: { options } }).then(resp => {
      if (!resp.data.error) {
        this.setState({
          posts: resp.data.payload,
          isLoading: false,
          maxElements: resp.headers["max-elements"]
        });
      }
    });
  };

  handlePageChange = data =>
    this.setState(
      prevState => ({
        options: {
          ...prevState.options,
          page: data.activePage
        }
      }),
      () => this.getPosts()
    );

  render() {
    const { posts, isLoading, options, maxElements } = this.state;
    return (
      <>
        <Header as="h1">Блог</Header>
        <Divider />
        {!isLoading && _.isEmpty(posts) && (
          <Segment placeholder>
            <Header icon>
              <Icon name="list" />
              Ничего здесь нет, пока что....
            </Header>
          </Segment>
        )}
        {isLoading && <CustomLoader />}
        {!_.isEmpty(posts) &&
          posts.map(post => (
            <BlogItem
              key={post._id}
              header={post.header}
              link={`/blog/${post._id}`}
              jsonData={post.text}
            />
          ))}
        <br />
        {Number(maxElements) > options.limit && (
          <Pagination
            page={options.page}
            limit={options.limit}
            maxElements={maxElements}
            onPageChange={this.handlePageChange}
          />
        )}
      </>
    );
  }
}
