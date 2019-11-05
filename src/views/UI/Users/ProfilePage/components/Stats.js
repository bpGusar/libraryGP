import React, { Component } from "react";

import { Statistic, Icon } from "semantic-ui-react";

import axs from "@axios";

export default class Stats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      bookedBooks: []
    };
  }

  componentDidMount() {
    const { userId } = this.props;
    axs.get(`/users/${userId}/booked-books`, { params: {} }).then(resp => {
      if (!resp.data.error) {
        this.setState({
          isLoading: false,
          bookedBooks: resp.data.payload
        });
      }
    });
  }

  render() {
    const { isLoading, bookedBooks } = this.state;
    return (
      <Statistic>
        <Statistic.Value>
          {isLoading ? <Icon loading name="spinner" /> : bookedBooks.length}
        </Statistic.Value>
        <Statistic.Label>Арендовано книг</Statistic.Label>
      </Statistic>
    );
  }
}
