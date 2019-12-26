import React from "react";
import { branch } from "baobab-react/higher-order";
import cn from "classnames";

import {
  Container,
  Image,
  Grid,
  Button,
  Modal,
  Header,
  Icon,
  Message,
  Label
} from "semantic-ui-react";
import { toast } from "react-semantic-toasts";
import { DateTime } from "luxon";

import SearchQueryLink from "@commonViews/SearchQueryLink";

import { PARAMS } from "@store";
import { storeData } from "@act";

import MSG from "@msg";

import axs from "@axios";

import s from "../../index.module.scss";

class TopInfoBlock extends React.Component {
  static generateBookInfo(arr, path, dataName) {
    return arr.map((el, i) => (
      <>
        <SearchQueryLink
          key={el._id}
          text={<>{el[dataName]}</>}
          url="/search"
          param={path}
          value={el._id}
        />
        {arr.length - 1 !== i && " • "}
      </>
    ));
  }

  constructor(props) {
    super(props);
    this.bookABook = this.bookABook.bind(this);
    this.handleOpenCloseModal = this.handleOpenCloseModal.bind(this);

    this.state = {
      isButtonLoading: false,
      modalOpen: false,
      isThisBookBooked: false,
      isThisBookOrdered: {
        ordered: false,
        until: ""
      },
      isBookButtonDisabled: false
    };
  }

  componentDidMount() {
    const { isUserAuthorized } = this.props;

    if (isUserAuthorized) {
      this.checkIfBookAlreadyBookedOrOrdered();
    }
  }

  checkIfBookAlreadyBookedOrOrdered() {
    const { bookProps } = this.props;

    this.setState({
      isButtonLoading: true
    });

    axs.get(`/books/${bookProps.match.params.id}/availability`).then(resp => {
      if (!resp.data.error) {
        if (resp.data.payload.BookedBooks.length !== 0) {
          this.setState({
            isButtonLoading: false,
            isThisBookBooked: true
          });
        } else if (resp.data.payload.OrderedBooks.length !== 0) {
          this.setState({
            isButtonLoading: false,
            isThisBookOrdered: {
              ordered: true,
              until: DateTime.fromMillis(
                new Date(
                  resp.data.payload.OrderedBooks[0].orderedUntil
                ).getTime()
              )
                .setLocale("ru-ru")
                .toLocaleString()
            }
          });
        } else {
          this.setState({
            isButtonLoading: false
          });
        }
      } else {
        this.setState({
          isButtonLoading: false
        });
        toast(MSG.errorWhenFindBookedBooks(resp.data.message));
      }
    });
  }

  bookABook() {
    const { dispatch, bookProps, userInfo } = this.props;

    this.setState({
      isButtonLoading: true
    });

    axs
      .post("/booked-books/", {
        id: bookProps.match.params.id,
        userId: userInfo._id,
        readerId: userInfo.readerId
      })
      .then(resp => {
        if (!resp.data.error) {
          this.setState({
            isButtonLoading: false
          });

          dispatch(storeData, PARAMS.BOOK, ...resp.data.payload.books);
          if (resp.data.payload.bookBooked) {
            this.setState({
              isThisBookBooked: true
            });
            this.handleOpenCloseModal();
          } else {
            this.checkIfBookAlreadyBookedOrOrdered();
            toast(MSG.bookDoesntAvailableAnymore(resp.data.message));
          }
        } else {
          this.setState({
            isButtonLoading: false,
            isBookButtonDisabled: true
          });
          toast(MSG.bookDoesntAvailableAnymore(resp.data.message));
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
    const {
      isButtonLoading,
      modalOpen,
      isThisBookBooked,
      isBookButtonDisabled,
      isThisBookOrdered
    } = this.state;
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
              <Grid.Column width={4} className={s.bookTopCardImgCol}>
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
                    "bookInfo.authors",
                    "authorName"
                  )}
                </Grid.Row>
                <Grid.Row className={s.titleLine}>
                  <h1>{book.bookInfo.title}</h1>
                </Grid.Row>
                <Grid.Row className={s.categoriesLine}>
                  {TopInfoBlock.generateBookInfo(
                    book.bookInfo.categories,
                    "bookInfo.categories",
                    "categoryName"
                  )}
                  {" • "}
                  {book.bookInfo.publishedDate}
                </Grid.Row>
                <Grid.Row className={cn(s.descrLine, s.descrBlock)}>
                  {book.bookInfo.description}
                </Grid.Row>
                <Grid.Row className={s.descrLine}>
                  <Modal
                    closeIcon
                    trigger={
                      <>
                        <Button
                          disabled={
                            bookAvailability ||
                            isButtonLoading ||
                            modalOpen ||
                            !isUserAuthorized ||
                            isThisBookBooked ||
                            isThisBookOrdered.ordered ||
                            isBookButtonDisabled
                          }
                          loading={isButtonLoading}
                          primary
                          onClick={this.bookABook}
                        >
                          Взять в аренду
                        </Button>
                        {(isThisBookBooked || isThisBookOrdered.ordered) && (
                          <Label color="green">
                            <Icon name="check" />{" "}
                            {isThisBookOrdered.ordered &&
                              `Книга у Вас на руках до ${isThisBookOrdered.until}`}
                            {isThisBookBooked && "Забронировано"}
                          </Label>
                        )}
                      </>
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
    globalPageLoader: PARAMS.IS_SOME_DATA_LOADING,
    userInfo: PARAMS.USER_INFO,
    isUserAuthorized: PARAMS.IS_USER_AUTHORIZED
  },
  TopInfoBlock
);
