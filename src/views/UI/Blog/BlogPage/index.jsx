import React, { Component } from "react";
import { Header } from "semantic-ui-react";
import BlogItem from "./components/Item";

// eslint-disable-next-line react/prefer-stateless-function
export default class BlogPage extends Component {
  render() {
    return (
      <div>
        <Header as="h1">Блог</Header>
        <hr />
        <BlogItem
          header="Название"
          link="/fdgfdgfd"
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum."
        />
      </div>
    );
  }
}
