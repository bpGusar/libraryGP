import React, { Component } from "react";
import { Button, Modal, Form, Icon } from "semantic-ui-react";
import _ from "lodash";

import axs from "@axios";

export default class MessageButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msgValue: "",
      isSending: false,
      modalOpen: false
    };
  }

  handleModal = e => {
    e.preventDefault();
    this.setState(ps => ({
      modalOpen: !ps.modalOpen
    }));
  };

  handleSendMessage = () => {
    const { msgValue } = this.state;
    const { userId } = this.props;

    if (_.isEmpty(msgValue)) return;

    this.setState({
      isSending: true
    });

    axs
      .post(`/chats/messages`, {
        message: msgValue,
        toId: userId
      })
      .then(resp => {
        if (!resp.data.error) {
          this.setState({
            isSending: false,
            modalOpen: false,
            msgValue: ""
          });
        }
      });
  };

  handleChangeMsg(e) {
    const elem = e.currentTarget;

    this.setState({
      msgValue: elem.value
    });
  }

  render() {
    const { msgValue, isSending, modalOpen } = this.state;
    return (
      <Modal
        open={modalOpen}
        size="tiny"
        trigger={
          <Button color="blue" fluid onClick={this.handleModal}>
            Отправить сообщение
          </Button>
        }
      >
        <Modal.Header>Сообщение</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Form onSubmit={this.handleSendMessage}>
              <div className="field">
                <textarea
                  rows="3"
                  value={msgValue}
                  onChange={e => this.handleChangeMsg(e)}
                />
              </div>
              <div>
                <Button
                  icon
                  floated="right"
                  disabled={isSending}
                  onClick={this.handleModal}
                >
                  <Icon name="close" />
                </Button>
                <Button
                  floated="left"
                  content="Отправить"
                  labelPosition="left"
                  icon="edit"
                  primary
                  disabled={isSending}
                />
              </div>
              <br />
              <br />
            </Form>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }
}
