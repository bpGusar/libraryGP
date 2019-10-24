import React from "react";
import { Container, Sidebar, Menu, Segment } from "semantic-ui-react";

import DashboardMenu from "@DUI/components/Menu/";

import s from "./index.module.scss";

export default class MainLayout extends React.Component {
  componentDidMount() {
    const { accessGranted, history } = this.props;
    if (!accessGranted) {
      history.push("/");
    }
  }

  render() {
    const { children } = this.props;

    return (
      <div className={s.dashboardWrapper}>
        <div className={s.sideBarWrapper}>
          <Sidebar
            className={s.sidebar}
            as={Menu}
            direction="left"
            icon="labeled"
            inverted
            vertical
            visible
            width="thin"
          >
            <DashboardMenu />
          </Sidebar>
        </div>

        <div className={s.mainContainerBlock}>
          <Segment className={s.topTitleBar}>
            Pellentesque habitant morbi tristique senectus.
          </Segment>
          <Container fluid className={s.mainContainer}>
            {children}
          </Container>
        </div>
      </div>
    );
  }
}
