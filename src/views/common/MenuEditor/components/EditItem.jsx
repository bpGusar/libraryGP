import React from "react";
import { Button, Popup, Icon, Form } from "semantic-ui-react";

import s from "../index.module.scss";

export default class EditItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      itemData: {
        id: "",
        icon: "",
        text: "",
        to: ""
      }
    };
  }

  handleShow = () => {
    const { element } = this.props;
    this.setState(ps => ({
      open: !ps.open,
      itemData: {
        id: element.id,
        icon: element.icon,
        text: element.text,
        to: element.to
      }
    }));
  };

  handleSubmit(data) {
    const { onSaveEdit } = this.props;

    onSaveEdit(data);

    this.setState({
      open: false
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
    const { open, itemData } = this.state;
    const { element } = this.props;

    const isDrop = element.type === "dropdown";

    return (
      <Popup
        on="click"
        open={open}
        trigger={
          <Button className={s.button} icon size="mini">
            <Icon className={s.icon} name="pencil" />
          </Button>
        }
        flowing
        onOpen={this.handleShow}
        onClose={this.handleShow}
        position="bottom right"
        style={{
          width: 500
        }}
        inverted
      >
        <Form inverted onSubmit={() => this.handleSubmit(itemData)}>
          <Form.Group widths="equal">
            <Form.Input
              fluid
              onChange={(e, { value, name }) =>
                this.handleChangeValue({ value, name })
              }
              value={itemData.icon}
              label="Иконка"
              placeholder="Иконка"
              name="icon"
            />
            <Form.Input
              fluid
              onChange={(e, { value, name }) =>
                this.handleChangeValue({ value, name })
              }
              value={itemData.text}
              label="Заголовок"
              placeholder="Заголовок"
              name="text"
            />
            {!isDrop && (
              <Form.Input
                fluid
                onChange={(e, { value, name }) =>
                  this.handleChangeValue({ value, name })
                }
                value={itemData.to}
                label="URL"
                placeholder="URL"
                name="to"
              />
            )}
          </Form.Group>
          <Form.Button color="green">Сохранить</Form.Button>
        </Form>
      </Popup>
    );
  }
}
