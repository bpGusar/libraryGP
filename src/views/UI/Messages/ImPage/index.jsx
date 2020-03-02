/* eslint-disable react/prefer-stateless-function */
import React, { Component } from "react";
import { Segment, Grid, List, Image } from "semantic-ui-react";

import axs from "@axios";

import s from "./index.module.scss";

export default class ImPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chats: []
    };
  }

  componentDidMount() {
    const { match } = this.props;

    axs.get(`/chats/${match.params.userId}`, { params: {} }).then(resp => {
      if (!resp.data.error) {
        this.setState({
          chats: resp.data.payload
        });
      }
    });
  }

  render() {
    const { chats } = this.state;

    return (
      <Segment>
        <Grid columns={2} className={s.messageContainer}>
          <Grid.Column width={5} className={s.userListColumn}>
            <List divided relaxed>
              {chats.map(chat => (
                <List.Item>
                  <Image avatar src={chat.to.avatar} />
                  <List.Content>
                    <List.Header as="a">
                      {chat.to.firstName} {chat.to.lastName}{" "}
                      {chat.to.patronymic}
                    </List.Header>
                  </List.Content>
                </List.Item>
              ))}
            </List>
          </Grid.Column>
          <Grid.Column width={11}>Middle</Grid.Column>
        </Grid>
      </Segment>
    );
  }
}
