import React, { Component } from "react";

import FormContainer from "@DUI/common/FormContainer";

export default class ManageBlogPosts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    };
  }

  render() {
    const { isLoading } = this.state;
    return (
      <FormContainer formHeader="Все посты блога" loading={isLoading}>
        fdgsfdgsdfgsfdg
      </FormContainer>
    );
  }
}
