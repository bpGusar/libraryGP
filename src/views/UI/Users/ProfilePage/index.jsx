/* eslint-disable react/no-unused-state */
import React, { Component } from "react";
import {
  Grid,
  Image,
  Card,
  Segment,
  Header,
  Divider,
  Label
} from "semantic-ui-react";
import { branch } from "baobab-react/higher-order";
import { DateTime } from "luxon";
import Loader from "@views/common/Loader";
import Stats from "./components/Stats";

import { PARAMS } from "@store";

import axs from "@axios";

const userGroup = {
  0: "Пользователь",
  1: "Администратор"
};

// TODO: доделать профиль
class ProfilePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      user: {},
      currentUser: ""
    };
  }

  componentDidMount() {
    const { match, userInfoFromStore } = this.props;
    if (match.params.userId === userInfoFromStore._id) {
      this.setState({
        user: userInfoFromStore,
        isLoading: false,
        currentUser: userInfoFromStore._id
      });
    } else {
      this.handleGetUserInfo();
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.match.params.userId !== prevState.currentUser) {
      return {
        currentUser: nextProps.match.params.userId
      };
    }
    return null;
  }

  componentDidUpdate(prevProps) {
    const { currentUser } = this.state;

    if (prevProps.match.params.userId !== currentUser) {
      this.handleGetUserInfo();
      return true;
    }
    return false;
  }

  handleGetUserInfo() {
    const { match } = this.props;

    this.setState({
      isLoading: true
    });

    axs.get(`/users/${match.params.userId}`).then(resp => {
      if (!resp.data.error) {
        this.setState({
          user: resp.data.payload[0],
          isLoading: false,
          currentUser: resp.data.payload[0].userId
        });
      }
    });
  }

  render() {
    const { user, isLoading } = this.state;
    return (
      <>
        {isLoading ? (
          <Loader />
        ) : (
          <Grid>
            <Grid.Row>
              <Grid.Column width={4}>
                <Card>
                  <Image src={user.avatar} wrapped ui={false} />
                  <Card.Content>
                    <Card.Header>{user.login}</Card.Header>
                    <Card.Meta>
                      <span className="date">
                        Дата регистрации:{" "}
                        <b>
                          {DateTime.fromISO(user.createdAt)
                            .setLocale("ru")
                            .toFormat("dd LLL yyyy")}
                        </b>
                      </span>
                    </Card.Meta>
                  </Card.Content>
                </Card>
              </Grid.Column>
              <Grid.Column width={12}>
                <Segment>
                  <Header>
                    {user.lastName} {user.firstName} {user.patronymic}{" "}
                    <Label>{userGroup[user.userGroup]}</Label>
                  </Header>
                  <Divider />
                  <Stats
                    label="Арендовано книг"
                    reqTo={`/users/${user._id}/booked-books`}
                  />
                  <Stats
                    label="Книг на руках"
                    reqTo={`/users/${user._id}/ordered-books`}
                  />
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        )}
      </>
    );
  }
}

export default branch(
  {
    userInfoFromStore: PARAMS.USER_INFO
  },
  ProfilePage
);
