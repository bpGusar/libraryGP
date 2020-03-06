/* eslint-disable react/prefer-stateless-function */
import React, { Component } from "react";
import {
  Segment,
  Grid,
  List,
  Image,
  Comment,
  Form,
  Button,
  Divider,
  Icon
} from "semantic-ui-react";
import { branch } from "baobab-react/higher-order";
import _ from "lodash";
import { DateTime } from "luxon";
import io from "socket.io-client";
import uniqid from "uniqid";
import cn from "classnames";

import axs from "@axios";

import { PARAMS } from "@store";

import s from "./index.module.scss";

class ImPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chats: [],
      selectedChat: {},
      messages: [],
      msgValue: "",
      messagesWhichIsNotUpload: []
    };

    this.socket = io.connect();

    this.socket.on("chat.new_msg", data => this.handleReceiveNewMessage(data));

    this.messagesContainerRef = React.createRef();
  }

  componentDidMount() {
    this.handleFetchChatsList();
  }

  componentDidUpdate() {
    const messagesContainer = this.messagesContainerRef;
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  handleReceiveNewMessage(data) {
    const { selectedChat, chats } = this.state;
    let chatsCloned = _.cloneDeep(chats);
    if (!_.isEmpty(selectedChat)) {
      chatsCloned.splice(chatsCloned.indexOf(selectedChat._id), 1);

      chatsCloned = [
        { ...selectedChat, lastMessage: data.newMessage },
        ...chatsCloned
      ];

      this.setState(ps => ({
        messages: [...ps.messages, data.newMessage],
        chats: chatsCloned
      }));
    }
  }

  handleSelectChat(chat) {
    axs
      .get(`/chats/messages`, {
        params: {
          toId: chat.peer._id
        }
      })
      .then(resp => {
        if (!resp.data.error) {
          this.setState({
            selectedChat: chat,
            messages: resp.data.payload.messages
          });
          this.socket.emit("room.join", chat._id);
        }
      });
  }

  handleFetchChatsList() {
    axs.get(`/chats`).then(resp => {
      if (!resp.data.error) {
        this.setState({
          chats: resp.data.payload
        });
      }
    });
  }

  handleGetSenderInfo(message) {
    const { selectedChat } = this.state;
    const { currentUser } = this.props;
    let selectedUser = {};
    if (currentUser._id === message.from) {
      selectedUser = currentUser;
    } else if (selectedChat.peer._id === message.from) {
      selectedUser = selectedChat.peer;
    }

    return selectedUser;
  }

  handleChangeMsg(value) {
    this.setState({
      msgValue: value
    });
  }

  handleSendMessage() {
    const { msgValue, selectedChat, messagesWhichIsNotUpload } = this.state;
    const { currentUser } = this.props;

    const newMsg = {
      _id: uniqid(),
      message: msgValue,
      from: currentUser._id,
      createdAt: new Date().toISOString()
    };

    this.setState(ps => ({
      msgValue: "",
      messages: [...ps.messages, newMsg],
      messagesWhichIsNotUpload: [...ps.messagesWhichIsNotUpload, newMsg._id]
    }));

    axs
      .post(`/chats/messages`, {
        message: msgValue,
        toId: selectedChat.peer._id
      })
      .then(resp => {
        if (!resp.data.error) {
          const { messages, chats } = this.state;

          const messagesWhichIsNotUploadCloned = _.cloneDeep(
            messagesWhichIsNotUpload
          );
          const messagesCloned = _.cloneDeep(messages);
          let chatsCloned = _.cloneDeep(chats);

          messagesWhichIsNotUploadCloned.splice(
            messagesWhichIsNotUploadCloned.indexOf(newMsg._id),
            1
          );

          messagesCloned.splice(messagesCloned.indexOf(newMsg._id), 1);

          chatsCloned.splice(chatsCloned.indexOf(selectedChat._id), 1);

          chatsCloned = [
            { ...selectedChat, lastMessage: newMsg },
            ...chatsCloned
          ];

          this.setState({
            messages: messagesCloned,
            messagesWhichIsNotUpload: messagesWhichIsNotUploadCloned,
            chats: chatsCloned
          });
        }
      });
  }

  render() {
    const {
      chats,
      selectedChat,
      messages,
      msgValue,
      messagesWhichIsNotUpload
    } = this.state;

    return (
      <Segment>
        <Grid columns={2} className={s.messageContainer}>
          <Grid.Column width={5} className={s.userListColumn}>
            <List divided relaxed>
              {chats.map(chat => (
                <List.Item
                  key={chat._id}
                  onClick={() => this.handleSelectChat(chat)}
                  className={cn(
                    s.userListItem,
                    selectedChat._id === chat._id && s.active
                  )}
                >
                  <Image avatar src={chat.peer.avatar} />
                  <List.Content>
                    <List.Header>
                      {chat.peer.firstName} {chat.peer.lastName}{" "}
                      {chat.peer.patronymic}
                    </List.Header>
                    <List.Description>
                      {chat.lastMessage.message}
                    </List.Description>
                  </List.Content>
                </List.Item>
              ))}
            </List>
          </Grid.Column>
          <Grid.Column width={11} className={s.messagesBlock}>
            {!_.isEmpty(selectedChat) && (
              <>
                <Comment.Group className={s.recipientBlock}>
                  <Comment>
                    <Comment.Avatar
                      className={s.recipientBlockAvatar}
                      src={selectedChat.peer.avatar}
                    />
                    <Comment.Content className={s.recipientBlockContent}>
                      <Comment.Author as="a">
                        {selectedChat.peer.firstName}{" "}
                        {selectedChat.peer.lastName}{" "}
                        {selectedChat.peer.patronymic}
                      </Comment.Author>
                    </Comment.Content>
                  </Comment>
                </Comment.Group>
                <Divider className={s.divider} />
              </>
            )}
            <div
              className={cn(
                "ui comments",
                !_.isEmpty(messages) && s.messagesContainer
              )}
              // eslint-disable-next-line no-return-assign
              ref={el => (this.messagesContainerRef = el)}
            >
              {!_.isEmpty(messages) &&
                messages.map(message => (
                  <Comment key={message._id} className={s.messageItem}>
                    <Comment.Avatar
                      src={this.handleGetSenderInfo(message).avatar}
                    />
                    <Comment.Content>
                      <Comment.Author as="a">
                        {messagesWhichIsNotUpload.find(
                          el => el === message._id
                        ) && <Icon loading name="spinner" />}
                        {this.handleGetSenderInfo(message).firstName}
                      </Comment.Author>
                      <Comment.Metadata>
                        <div>
                          {DateTime.fromISO(message.createdAt)
                            .setLocale("ru")
                            .toFormat("hh:mm dd MMMM yyyy")}
                        </div>
                      </Comment.Metadata>
                      <Comment.Text>{message.message}</Comment.Text>
                    </Comment.Content>
                  </Comment>
                ))}
            </div>
            {!_.isEmpty(messages) && (
              <Form reply className={s.messageForm}>
                <Form.TextArea
                  className={s.messageTextArea}
                  onChange={(e, { value }) => this.handleChangeMsg(value)}
                  value={msgValue}
                />
                <Button
                  content="Отправить"
                  labelPosition="left"
                  icon="edit"
                  primary
                  onClick={() => this.handleSendMessage()}
                />
              </Form>
            )}
          </Grid.Column>
        </Grid>
      </Segment>
    );
  }
}

export default branch({ currentUser: PARAMS.USER_INFO }, ImPage);
