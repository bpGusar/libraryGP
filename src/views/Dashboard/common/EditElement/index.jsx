import React, { Component } from "react";
import { Form, Button } from "semantic-ui-react";

import axs from "@axios";

export default class EditElement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updateData: props.element
    };
  }

  handleSubmitChanges = () => {
    const { linkPrefix, element, onEditSubmit } = this.props;
    const { updateData } = this.state;
    axs.put(`${linkPrefix}${element._id}`, updateData).then(resp => {
      if (!resp.data.error) {
        onEditSubmit();
      }
    });
  };

  render() {
    const { updateData } = this.state;
    const { dbPropertyName } = this.props;
    return (
      <Form onSubmit={this.handleSubmitChanges}>
        <Form.Input
          type="text"
          id={dbPropertyName}
          value={updateData[dbPropertyName]}
          name={dbPropertyName}
          onChange={(e, { value }) =>
            this.setState({
              updateData: {
                ...updateData,
                [dbPropertyName]: value
              }
            })
          }
          required
          fluid
          icon="pencil"
          iconPosition="left"
        />
        <Button type="submit">Сохранить</Button>
      </Form>
    );
  }
}
