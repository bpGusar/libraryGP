import React from "react";
import { Container, Sidebar, Menu } from "semantic-ui-react";
import { withRouter } from "react-router-dom";

import DashboardMenu from "@DUI/containers/Menu/";
import TopMenu from "@DUI/containers/TopMenu/";

import s from "./index.module.scss";

class MainLayout extends React.Component {
  componentDidMount() {
    const { accessGranted, history } = this.props;
    if (!accessGranted) {
      history.push("/");
    }
  }

  render() {
    const { children, location } = this.props;
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
          <TopMenu />
          <Container
            fluid
            className={
              location.pathname !== "/dashboard"
                ? s.mainContainer
                : s.mainDashboardPageContainer
            }
          >
            {children}
          </Container>
        </div>
      </div>
    );
  }
}

export default withRouter(MainLayout);
