import React from "react";

import { Segment, Responsive, Container } from "semantic-ui-react";

import Header from "@views/Header";

import s from "@views/Dashboard/index.module.scss";

export default function MainLayout(props) {
  const { children } = props;

  return (
    <>
      <Responsive>
        <Segment
          inverted
          textAlign="center"
          className={s.dashboardLayoutHeaderSegment}
          vertical
        >
          <Header
            headerMenuStyle={s.headerMenuStyle}
            headerSegmentStyle={s.headerSegmentStyle}
          />
        </Segment>
      </Responsive>
      <Container style={{ marginTop: "20px" }}>
        <div className="m-3">{children}</div>
      </Container>
    </>
  );
}
