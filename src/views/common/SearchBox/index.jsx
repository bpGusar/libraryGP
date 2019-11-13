import React, { Component } from "react";
import _ from "lodash";
import { Search } from "semantic-ui-react";

import { withRouter } from "react-router-dom";

import axs from "@axios";

class SearchBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      results: [],
      searchQuery: {},
      options: {
        fetch_type: 1,
        sort: "desc",
        limit: 10,
        page: 1
      }
    };
  }

  handleResultSelect = (e, { result }) => {
    const { history } = this.props;
    history.push(`/book/${result.key}`);
  };

  handleSearchChange = (e, { value }) => {
    const { searchQuery, options } = this.state;
    let searchQueryCloned = _.cloneDeep(searchQuery);

    this.setState(
      () => {
        searchQueryCloned = {
          ...searchQueryCloned,
          "bookInfo.title": {
            $regex: value,
            $options: "i"
          }
        };
        return {
          isLoading: true,
          searchQuery: { ...searchQueryCloned },
          results: []
        };
      },
      () => {
        if (searchQueryCloned["bookInfo.title"].$regex.length < 1)
          return this.setState({
            isLoading: false,
            results: [],
            searchQuery: {}
          });

        axs
          .get(`/books`, {
            params: {
              searchQuery: searchQueryCloned,
              options
            }
          })
          .then(resp => {
            if (!resp.data.error) {
              this.setState({
                results: !_.isEmpty(resp.data.payload)
                  ? resp.data.payload.map(book => ({
                      key: book._id,
                      title: book.bookInfo.title,
                      description: book.bookInfo.description.substring(0, 100),
                      image: book.bookInfo.imageLinks.poster
                    }))
                  : [],
                isLoading: false
              });
            }
          });
      }
    );
  };

  render() {
    const { isLoading, results, searchQuery } = this.state;
    return (
      <div>
        <Search
          noResultsMessage="Результатов нет."
          loading={isLoading}
          onResultSelect={this.handleResultSelect}
          onSearchChange={_.debounce(this.handleSearchChange, 500, {
            leading: true
          })}
          results={results}
          value={
            _.has(searchQuery["bookInfo.title"], "$regex")
              ? searchQuery["bookInfo.title"].$regex
              : ""
          }
        />
      </div>
    );
  }
}

export default withRouter(SearchBox);
