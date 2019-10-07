import React from "react";
import { branch } from "baobab-react/higher-order";

import { Container, Image, Grid } from "semantic-ui-react";

import headerStyles from "@views/Header/Header.module.scss";

import { PARAMS } from "@store";

// eslint-disable-next-line react/prefer-stateless-function
class TopInfoBlock extends React.Component {
  render() {
    const { book } = this.props;
    return (
      <>
        <div className={headerStyles.bookPosterBlock}>
          <Image
            fluid
            className={headerStyles.bookWallpapper}
            src={book.bookInfo.imageLinks.poster}
          />
        </div>
        <Container className={headerStyles.bookTopCardContainer}>
          <Grid columns={2} className={headerStyles.bookTopCardContainerGrid}>
            <Grid.Row>
              <Grid.Column width={4}>
                <Image
                  rounded
                  className={headerStyles.bookPoster}
                  src={book.bookInfo.imageLinks.poster}
                />
              </Grid.Column>
              <Grid.Column width={12}>
                <Grid.Row className={headerStyles.authorsLine}>
                  {book.bookInfo.authors.map((el, i) => (
                    <span key={el._id}>
                      {el.authorName}
                      {book.bookInfo.authors.length - 1 !== i && " • "}
                    </span>
                  ))}
                </Grid.Row>
                <Grid.Row className={headerStyles.titleLine}>
                  <h1>{book.bookInfo.title}</h1>
                </Grid.Row>
                <Grid.Row className={headerStyles.categoriesLine}>
                  {book.bookInfo.categories.map((el, i) => (
                    <span key={el._id}>
                      {el.categoryName}
                      {book.bookInfo.categories.length - 1 !== i && " • "}
                    </span>
                  ))}
                </Grid.Row>
                <Grid.Row className={headerStyles.descrLine}>
                  {book.bookInfo.description}
                </Grid.Row>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </>
    );
  }
}

export default branch(
  { book: PARAMS.BOOK, globalPageLoader: PARAMS.GLOBAL_PAGE_LOADER },
  TopInfoBlock
);
