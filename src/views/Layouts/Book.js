import React from "react";
import _ from "lodash";
import { branch } from "baobab-react/higher-order";

import { Segment, Responsive, Container, Image } from "semantic-ui-react";

import Header from "@views/Header";
import headerStyles from "@views/Header/Header.module.scss";

import { PARAMS } from "@store";

function BookLayout(props) {
  const { children, book, globalPageLoader } = props;
  return (
    <>
      {!globalPageLoader && (
        <>
          <Responsive>
            <Segment
              inverted
              textAlign="center"
              style={{ padding: "1em 0em", zIndex: 1 }}
              vertical
            >
              <Header segmentClassName={headerStyles.segmentClass} />
            </Segment>
            {!_.isEmpty(book) && (
              <Image
                fluid
                style={{
                  position: "absolute",
                  top: 0
                }}
                src={book.bookInfo.imageLinks.poster}
              />
            )}
          </Responsive>
          <Container style={{ marginTop: "20px" }}>
            <div className="m-3">{children}</div>
          </Container>
        </>
      )}
    </>
  );
}

export default branch(
  { book: PARAMS.BOOK, globalPageLoader: PARAMS.GLOBAL_PAGE_LOADER },
  BookLayout
);
