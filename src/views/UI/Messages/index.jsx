/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable no-plusplus */
/* eslint-disable class-methods-use-this */
import React, { Component } from "react";
import { Segment, Grid, List } from "semantic-ui-react";
import { branch } from "baobab-react/higher-order";
import _ from "lodash";
import io from "socket.io-client";
import uniqid from "uniqid";
import cn from "classnames";
import InfiniteScrollReverse from "react-infinite-scroll-reverse";

import CustomDimmer from "../../Common/CustomDimmer";

import axs from "@axios";

import { PARAMS } from "@store";

import s from "./index.module.scss";
import TextArea from "./components/TextArea";
import MessageItem from "./components/MessageItem";
import MessagesTopInfoBlock from "./components/MessagesTopInfoBlock";
import ChatItem from "./components/ChatItem";

class ImPage extends Component {
  constructor(props) {
    super(props);
    this.initialState = {
      chats: [],
      selectedChat: {},
      maxMessages: 0,
      messages: [],
      msgValue: "",
      isLoading: false,
      messagesWhichIsNotUpload: [],
      options: {
        limit: 25,
        page: 1
      },
      inputHeight: 37
    };

    this.state = this.initialState;

    this.socket = io.connect();

    this.socket.emit("room.join", `chatList#${props.currentUser._id}`);
    this.socket.on("chat.new_msg", data => this.handleReceiveNewMessage(data));
    this.socket.on("chat.new_chatItem", data =>
      this.handleReceiveNewChatItem(data)
    );

    this.textAreaRef = React.createRef();
  }

  componentDidMount() {
    this.handleFetchChatsList();
  }

  componentWillUnmount() {
    this.setState(this.initialState);
  }

  handleSendMessage = () => {
    const { msgValue, selectedChat, messagesWhichIsNotUpload } = this.state;
    const { currentUser } = this.props;
    if (msgValue !== "") {
      const newMsg = {
        _id: uniqid(),
        message: msgValue,
        from: currentUser._id,
        createdAt: new Date().toISOString()
      };

      this.textAreaRef.current.value = "";

      this.setState(ps => ({
        msgValue: "",
        inputHeight: this.initialState.inputHeight,
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
            const chatsCloned = _.cloneDeep(chats);
            messagesWhichIsNotUploadCloned.splice(
              messagesWhichIsNotUploadCloned.findIndex(
                message => message._id === newMsg._id
              ),
              1
            );
            messagesCloned.splice(
              messagesCloned.findIndex(message => message._id === newMsg._id),
              1
            );
            chatsCloned.splice(
              chatsCloned.findIndex(chat => chat._id === selectedChat._id),
              1,
              { ...selectedChat, lastMessage: newMsg }
            );
            this.setState({
              messages: messagesCloned,
              messagesWhichIsNotUpload: messagesWhichIsNotUploadCloned,
              chats: chatsCloned.sort(
                (a, b) =>
                  new Date(b.lastMessage.createdAt).getTime() -
                  new Date(a.lastMessage.createdAt).getTime()
              )
            });
          }
        });
    }
  };

  handleOnChange = e => {
    const keyCode = e.keyCode ? e.keyCode : e.which;
    if (keyCode === 13 && !e.shiftKey) {
      this.handleSendMessage();
      e.preventDefault();
      e.stopPropagation();
    }
    if (e.shiftKey && keyCode === 13) {
      this.setState(ps => ({
        inputHeight: ps.inputHeight <= 96 ? ps.inputHeight + 15 : ps.inputHeight
      }));
    }
    if (keyCode !== 13) {
      this.setState({
        msgValue: e.target.value
      });
    }
  };

  loadMoreMessages() {
    const { selectedChat } = this.state;
    this.setState(
      ps => ({
        options: {
          ...ps.options,
          page: ps.options.page + 1
        }
      }),
      () => this.handleGetMessagesFromChat(selectedChat)
    );
  }

  handleReceiveNewChatItem(data) {
    const { chats } = this.state;
    const chatsCloned = _.cloneDeep(chats);
    const indexOf = chatsCloned.findIndex(
      chat => chat._id === data.newChat._id
    );

    if (indexOf !== -1) {
      chatsCloned.splice(indexOf, 1, data.newChat);
    } else {
      chatsCloned.push(data.newChat);
    }

    this.setState({
      chats: chatsCloned.sort(
        (a, b) =>
          new Date(b.lastMessage.createdAt).getTime() -
          new Date(a.lastMessage.createdAt).getTime()
      )
    });
  }

  handleReceiveNewMessage(data) {
    const { selectedChat } = this.state;
    if (!_.isEmpty(selectedChat)) {
      this.setState(ps => ({
        messages: [...ps.messages, data.newMessage]
      }));
    }
  }

  handleGetMessagesFromChat(chat, clearLoad) {
    let optionsCloned = {};

    if (clearLoad) {
      this.setState(
        {
          messages: [],
          options: {
            limit: 25,
            page: 1
          }
        },
        () => {
          const { options } = this.state;
          optionsCloned = options;
        }
      );
    } else {
      const { options } = this.state;
      optionsCloned = options;
    }

    this.setState({
      isLoading: true
    });

    axs
      .get(`/chats/messages`, {
        params: {
          toId: chat.peer._id,
          options: optionsCloned
        }
      })
      .then(resp => {
        if (!resp.data.error) {
          this.setState(ps => ({
            selectedChat: chat,
            isLoading: false,
            messages: [
              ..._.differenceBy(resp.data.payload.messages, ps.messages, "_id"),
              ...ps.messages
            ],
            maxMessages: Number(resp.headers["max-elements"])
          }));
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

  handleSelectChat(selectChat, clickedChat) {
    if (!_.isEmpty(selectChat)) {
      this.socket.emit("room.leave", selectChat._id);
    }
    this.socket.emit("room.join", clickedChat._id);
    this.handleGetMessagesFromChat(clickedChat, true);
  }

  render() {
    const {
      chats,
      selectedChat,
      messages,
      messagesWhichIsNotUpload,
      maxMessages,
      isLoading,
      inputHeight
    } = this.state;

    const { currentUser } = this.props;

    return (
      <Segment>
        <Grid columns={2} className={s.messageContainer}>
          <Grid.Column width={5} className={s.userListColumn}>
            <List divided relaxed>
              {chats.map(chat => (
                <ChatItem
                  chatId={chat._id}
                  onItemClick={() => this.handleSelectChat(selectedChat, chat)}
                  selectedChat={selectedChat}
                  chat={chat}
                  currentUser={currentUser}
                />
              ))}
            </List>
          </Grid.Column>
          <Grid.Column width={11} className={s.messagesBlock}>
            {!_.isEmpty(selectedChat) && (
              <MessagesTopInfoBlock selectedChat={selectedChat} />
            )}
            <div className={s.messagesAndForm}>
              {!_.isEmpty(messages) && (
                <InfiniteScrollReverse
                  className={cn(
                    "ui comments",
                    !_.isEmpty(messages) && s.messagesContainer
                  )}
                  hasMore={messages.length < maxMessages}
                  isLoading={isLoading}
                  loadArea={250}
                  loadMore={() => this.loadMoreMessages()}
                >
                  {!isLoading ? (
                    messages
                      .sort(
                        (a, b) =>
                          new Date(a.createdAt).getTime() -
                          new Date(b.createdAt).getTime()
                      )
                      .map(message => (
                        <MessageItem
                          messageId={message._id}
                          avatarSrc={this.handleGetSenderInfo(message).avatar}
                          firstName={
                            this.handleGetSenderInfo(message).firstName
                          }
                          selectedChat={selectedChat}
                          messagesWhichIsNotUpload={messagesWhichIsNotUpload}
                          message={message}
                        />
                      ))
                  ) : (
                    <CustomDimmer active showLoader />
                  )}
                </InfiniteScrollReverse>
              )}
              {!_.isEmpty(messages) && (
                <TextArea
                  onKeyPress={this.handleOnChange}
                  onButtonClick={this.handleSendMessage}
                  innerRef={this.textAreaRef}
                  inputHeight={inputHeight}
                />
              )}
            </div>
          </Grid.Column>
        </Grid>
      </Segment>
    );
  }
}

export default branch({ currentUser: PARAMS.USER_INFO }, ImPage);
