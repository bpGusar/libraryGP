import React from "react";
import { Container, Sidebar, Menu } from "semantic-ui-react";

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

        <Container
          fluid
          className={s.mainContainer}
          style={{
            marginLeft: `${0}px !important`,
            marginRight: `${0}px !important`
          }}
        >
          <div className="m-3">{children}</div>
        </Container>
      </div>
    );
  }
}
