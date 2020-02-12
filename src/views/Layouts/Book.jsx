import React from "react";
import _ from "lodash";
import { branch } from "baobab-react/higher-order";

import { Segment, Responsive, Container } from "semantic-ui-react";

import Header from "@UI/Header";
import headerStyles from "@UI/Header/Header.module.scss";
import CustomLoader from "@views/Common/Loader";
import TopInfoBlock from "@UI/Books/BookPage/components/TopInfoBlock";

import { PARAMS } from "@store";

function BookLayout(props) {
  const { children, book, globalPageLoader } = props;
  return (
    <>
      {!globalPageLoader && (
        <>
          <Responsive className={headerStyles.headerCustomStyleGradient}>
            <Segment
              inverted
              textAlign="center"
              vertical
              className={headerStyles.headerParentSegment}
            >
              <Header
                headerSegmentStyle={headerStyles.headerSegmentClass}
                headerMenuStyle={headerStyles.headerMenuStyle}
              />
            </Segment>
            {!_.isEmpty(book) && <TopInfoBlock bookProps={children.props} />}
          </Responsive>
          <Container style={{ marginTop: "20px" }}>
            {_.isEmpty(book) && (
              <div className={headerStyles.bookPosterBlock}>
                <CustomLoader />
              </div>
            )}
            <div className="m-3">{children}</div>
          </Container>
        </>
      )}
    </>
  );
}

export default branch(
  { book: PARAMS.BOOK, globalPageLoader: PARAMS.IS_SOME_DATA_LOADING },
  BookLayout
);
