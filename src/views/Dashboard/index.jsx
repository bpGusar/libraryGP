import React from "react";
import { Card } from "semantic-ui-react";
import InfoCard from "@commonViews/InfoCard";

import axs from "@axios";

class DashboardMain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bookedBooks: {
        loaded: false,
        value: 0
      },
      orderedBooks: {
        loaded: false,
        value: 0
      }
    };
  }

  componentDidMount() {
    this.getBookedBooksCount(`/booked-books/count`, "bookedBooks");
    this.getBookedBooksCount(`/ordered-books/count`, "orderedBooks");
  }

  getBookedBooksCount = (url, stateParam) =>
    axs.get(url).then(resp => {
      if (!resp.data.error) {
        this.setState({
          [stateParam]: {
            loaded: true,
            value: resp.data.payload
          }
        });
      }
    });

  render() {
    const { bookedBooks, orderedBooks } = this.state;
    return (
      <Card.Group>
        <InfoCard
          active={!bookedBooks.loaded}
          showLoader={!bookedBooks.loaded}
          statValue={bookedBooks.value}
          statLabel="Книг забронировано"
          reactRedirectTo="/dashboard/books/booking-management"
          buttonText="Перейти"
          cardHeader="Статистика бронирований"
        />
        <InfoCard
          active={!orderedBooks.loaded}
          showLoader={!orderedBooks.loaded}
          statValue={orderedBooks.value}
          statLabel="Книг выдано"
          reactRedirectTo="/dashboard/books/orders-management"
          buttonText="Перейти"
          cardHeader="Статистика выдачи книг"
        />
      </Card.Group>
    );
  }
}

export default DashboardMain;
