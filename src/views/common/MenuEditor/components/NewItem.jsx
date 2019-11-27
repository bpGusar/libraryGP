/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from "react";
import { Segment, Form, Button, Icon } from "semantic-ui-react";
import uniqid from "uniqid";
import cn from "classnames";

import s from "../index.module.scss";

const initialState = {
  isOpen: false,
  itemData: {
    id: `${uniqid()}_${uniqid()}`,
    icon: "",
    text: "",
    to: "",
    type: "simple"
  }
};

export default class NewItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  handleCloseOpen = () => {
    this.setState(ps => ({
      isOpen: !ps.isOpen
    }));
  };

  handleSubmit(element, itemData) {
    const { onSubmit } = this.props;
    onSubmit(element, itemData);

    this.setState({
      ...initialState,
      itemData: {
        ...initialState.itemData,
        id: `${uniqid()}_${uniqid()}`
      }
    });
  }

  handleChangeValue({ value, name }) {
    this.setState(ps => ({
      itemData: {
        ...ps.itemData,
        [name]: value
      }
    }));
  }

  render() {
    const { isOpen, itemData } = this.state;
    const { element, buttonClassName } = this.props;
    return (
      <>
        <Button
          onClick={this.handleCloseOpen}
          className={cn(s.addNewItemButton, buttonClassName, s.addButton)}
          size="tiny"
          icon
        >
          <Icon name="plus" />
        </Button>
        {isOpen && (
          <Segment inverted>
            <Form
              inverted
              onSubmit={() => this.handleSubmit(element, itemData)}
            >
              <Form.Group widths="equal">
                <Form.Input
                  fluid
                  label="Иконка"
                  placeholder="Стандартная иконка FontAwesome"
                  value={itemData.icon}
                  name="icon"
                  onChange={(ev, { value, name }) =>
                    this.handleChangeValue({ value, name })
                  }
                />
                <Form.Input
                  fluid
                  required
                  label="Заголовок"
                  placeholder="Заголовок"
                  value={itemData.text}
                  name="text"
                  onChange={(ev, { value, name }) =>
                    this.handleChangeValue({ value, name })
                  }
                />
                <Form.Input
                  fluid
                  label="URL"
                  placeholder="URL"
                  value={itemData.to}
                  name="to"
                  onChange={(ev, { value, name }) =>
                    this.handleChangeValue({ value, name })
                  }
                />
              </Form.Group>
              <Form.Button color="green">Добавить</Form.Button>
            </Form>
          </Segment>
        )}
      </>
    );
  }
}
