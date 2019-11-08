import React, { Component } from "react";

import { Statistic, Icon } from "semantic-ui-react";

import axs from "@axios";

export default class Stats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      bookedBooks: [],
      isError: false
    };
  }

  componentDidMount() {
    const { reqTo } = this.props;
    axs.get(reqTo).then(resp => {
      this.setState({
        isError: resp.data.error,
        isLoading: false,
        bookedBooks: resp.data.error ? [] : resp.data.payload
      });
    });
  }

  render() {
    const { isLoading, bookedBooks, isError } = this.state;
    const { label } = this.props;
    return (
      <Statistic color={isError ? "red" : "black"}>
        <Statistic.Value>
          {isLoading ? <Icon loading name="spinner" /> : bookedBooks.length}
        </Statistic.Value>
        <Statistic.Label>{label}</Statistic.Label>
      </Statistic>
    );
  }
}
