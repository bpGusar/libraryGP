import React, { Component } from "react";
import {
  Grid,
  Image,
  Card,
  Segment,
  Header,
  Label,
  Tab
} from "semantic-ui-react";
import { branch } from "baobab-react/higher-order";
import { DateTime } from "luxon";
import Loader from "@views/common/Loader";
import OrdersInfo from "./components/OrdersInfo";
import ArchivedInfo from "./components/ArchivedInfo";

import { PARAMS } from "@store";

import axs from "@axios";

import s from "./index.module.scss";

const userGroup = {
  0: "Пользователь",
  1: "Администратор"
};

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

  // eslint-disable-next-line class-methods-use-this
  renderTabContent(user) {
    return [
      {
        menuItem: "Выданные и забронированные книги",
        pane: (
          <Tab.Pane attached={false} className={s.tabPane}>
            <OrdersInfo
              type="booked"
              url={`/users/${user._id}/booked-books`}
              label="Забронированные книги"
            />
            <OrdersInfo
              type="ordered"
              url={`/users/${user._id}/ordered-books`}
              label="Книги на руках"
            />
          </Tab.Pane>
        )
      },
      {
        menuItem: "История выданных",
        pane: (
          <Tab.Pane attached={false} className={s.tabPane}>
            <ArchivedInfo
              componentType="ordered"
              dataObjPropName="orderedBookInfo"
              url={`/users/${user._id}/ordered-books/archive`}
            />
          </Tab.Pane>
        )
      },
      {
        menuItem: "История арендованных",
        pane: (
          <Tab.Pane attached={false} className={s.tabPane}>
            <ArchivedInfo
              componentType="booked"
              dataObjPropName="bookedBookInfo"
              url={`/users/${user._id}/booked-books/archive`}
            />
          </Tab.Pane>
        )
      }
    ];
  }

  render() {
    const { user, isLoading } = this.state;
    const { userInfoFromStore, userRoles } = this.props;
    const isMyProfileOrAdmin =
      userInfoFromStore._id === user._id ||
      userInfoFromStore.userGroup === userRoles.admin.value;

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
                    <p>
                      № читательского билета: <b>{user.readerId}</b>
                    </p>
                  </Card.Content>
                </Card>
              </Grid.Column>
              <Grid.Column width={12}>
                <Segment>
                  <Header>
                    {user.lastName} {user.firstName} {user.patronymic}{" "}
                    <Label>{userGroup[user.userGroup]}</Label>
                  </Header>
                </Segment>
                {isMyProfileOrAdmin && (
                  <Tab
                    renderActiveOnly={false}
                    menu={{ secondary: true, pointing: true }}
                    panes={this.renderTabContent(user)}
                  />
                )}
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
    userInfoFromStore: PARAMS.USER_INFO,
    userRoles: PARAMS.USER_ROLES
  },
  ProfilePage
);
