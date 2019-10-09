import React from "react";
import { branch } from "baobab-react/higher-order";

import {
  Container,
  Image,
  Grid,
  Button,
  Modal,
  Header,
  Icon,
  Message
} from "semantic-ui-react";
import { toast } from "react-semantic-toasts";

import s from "../../index.module.scss";

import { PARAMS } from "@store";
import { storeData } from "@act";

import MSG from "@msg";

import axs from "@axios";

class TopInfoBlock extends React.Component {
  static generateBookInfo(arr, dataName) {
    return arr.map((el, i) => (
      <span key={el._id}>
        {el[dataName]}
        {arr.length - 1 !== i && " • "}
      </span>
    ));
  }

  constructor(props) {
    super(props);
    this.orderBook = this.orderBook.bind(this);
    this.handleOpenCloseModal = this.handleOpenCloseModal.bind(this);

    this.state = {
      isBookDataLoading: false,
      modalOpen: false
    };
  }

  orderBook() {
    const { dispatch, bookProps, userInfo } = this.props;

    this.setState({
      isBookDataLoading: true
    });

    axs
      .post("/books/bookABook", {
        id: bookProps.match.params.id,
        userId: userInfo.id
      })
      .then(resp => {
        if (!resp.data.error) {
          this.setState({
            isBookDataLoading: false
          });

          dispatch(storeData, PARAMS.BOOK, ...resp.data.payload.books);
          if (resp.data.payload.bookBooked) {
            this.handleOpenCloseModal();
          } else {
            toast(MSG.bookDoesntAvailableAnymore);
          }
        }
      });
  }

  handleOpenCloseModal() {
    const { modalOpen } = this.state;
    this.setState({
      modalOpen: !modalOpen
    });
  }

  render() {
    const { book, isUserAuthorized } = this.props;
    const { isBookDataLoading, modalOpen } = this.state;
    const bookAvailability = book.stockInfo.freeForBooking === 0;
    return (
      <div className={s.topInfoBlock}>
        <div className={s.bookPosterBlock}>
          <Image
            fluid
            className={s.bookWallpapper}
            src={book.bookInfo.imageLinks.poster}
          />
        </div>
        <Container className={s.bookTopCardContainer}>
          <Grid columns={2} className={s.bookTopCardContainerGrid}>
            <Grid.Row>
              <Grid.Column width={4}>
                <Image
                  rounded
                  label={bookAvailability && MSG.bookDoesntAvailableRibbon}
                  className={s.bookPoster}
                  src={book.bookInfo.imageLinks.poster}
                />
              </Grid.Column>
              <Grid.Column width={12}>
                <Grid.Row className={s.authorsLine}>
                  {TopInfoBlock.generateBookInfo(
                    book.bookInfo.authors,
                    "authorName"
                  )}
                </Grid.Row>
                <Grid.Row className={s.titleLine}>
                  <h1>{book.bookInfo.title}</h1>
                </Grid.Row>
                <Grid.Row className={s.categoriesLine}>
                  {TopInfoBlock.generateBookInfo(
                    book.bookInfo.categories,
                    "categoryName"
                  )}
                  {" • "}
                  {book.bookInfo.publishedDate}
                </Grid.Row>
                <Grid.Row className={s.descrLine}>
                  {book.bookInfo.description}
                </Grid.Row>
                <Grid.Row className={s.descrLine}>
                  <Modal
                    closeIcon
                    trigger={
                      <Button
                        disabled={
                          bookAvailability ||
                          isBookDataLoading ||
                          modalOpen ||
                          !isUserAuthorized
                        }
                        loading={isBookDataLoading}
                        primary
                        onClick={this.orderBook}
                      >
                        Взять в аренду
                      </Button>
                    }
                    open={modalOpen}
                    onClose={this.handleOpenCloseModal}
                    centered={false}
                  >
                    <Modal.Header>
                      <Icon name="book" />
                      {MSG.orderBookModalInfo.modalHeader}
                    </Modal.Header>
                    <Modal.Content>
                      <Modal.Description>
                        <Header color="green">
                          <Icon name="check" />
                          {MSG.orderBookModalInfo.contentHeader}
                        </Header>
                        <p>{MSG.orderBookModalInfo.contentText}</p>
                        <Message info>
                          <Message.Header>
                            {MSG.orderBookModalInfo.messageHeader}
                          </Message.Header>
                          <p>{MSG.orderBookModalInfo.messageText}</p>
                          {/* <Header color="red">{uniqueOrderId}</Header> */}
                          <p className={s.messageSubText}>
                            {MSG.orderBookModalInfo.messageSubText}
                          </p>
                        </Message>
                      </Modal.Description>
                    </Modal.Content>
                  </Modal>
                </Grid.Row>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    );
  }
}

export default branch(
  {
    book: PARAMS.BOOK,
    globalPageLoader: PARAMS.GLOBAL_PAGE_LOADER,
    userInfo: PARAMS.USER_INFO,
    isUserAuthorized: PARAMS.IS_USER_AUTHORIZED
  },
  TopInfoBlock
);
