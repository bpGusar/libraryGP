/* eslint-disable react/no-unused-state */
import React, { Component } from "react";
import {
  Grid,
  Image,
  Card,
  Segment,
  Header,
  Divider,
  List,
  Label
} from "semantic-ui-react";
import { branch } from "baobab-react/higher-order";
import { DateTime } from "luxon";
import Loader from "@views/common/Loader";

import { PARAMS } from "@store";

import axs from "@axios";

const userGroup = {
  0: "Администратор",
  1: "Пользователь"
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
    const { match, userInfo } = this.props;
    if (match.params.login === userInfo.login) {
      this.setState({
        user: userInfo,
        isLoading: false,
        currentUser: userInfo.login
      });
    } else {
      this.handleGetUserInfo();
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.match.params.login !== prevState.currentUser) {
      return {
        currentUser: nextProps.match.params.login
      };
    }
    return null;
  }

  componentDidUpdate(prevProps) {
    const { currentUser } = this.state;

    if (prevProps.match.params.login !== currentUser) {
      this.handleGetUserInfo();
      return true;
    }
    return false;
  }

  handleGetUserInfo = () => {
    const { match } = this.props;

    this.setState({
      isLoading: true
    });

    axs.get(`/users/${match.params.login}`).then(resp => {
      if (!resp.data.error) {
        this.setState({
          user: resp.data.payload[0],
          isLoading: false,
          currentUser: resp.data.payload[0].login
        });
      }
    });
  };

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
                        Дата регистрации{" "}
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
                  <List divided relaxed>
                    <List.Item>
                      <List.Content>
                        <List.Header>Группа</List.Header>
                        <Label>ffff</Label>
                      </List.Content>
                    </List.Item>
                  </List>
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
    userInfo: PARAMS.USER_INFO
  },
  ProfilePage
);
