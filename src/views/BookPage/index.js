/* eslint-disable react/prefer-stateless-function */
import React from "react";
import { branch } from "baobab-react/higher-order";

import axs from "@axios";

import { PARAMS } from "@store";
import { storeData } from "@act";

import MSG from "@msg";

class BookPage extends React.Component {
  componentDidMount() {
    const { match, history, dispatch } = this.props;

    axs
      .get("/books/get", {
        params: { howMuch: "one", id: match.params.id, fullBookInfo: true }
      })
      .then(resp => {
        if (!resp.data.error) {
          dispatch(storeData, PARAMS.BOOK, ...resp.data.payload);
        } else {
          dispatch(storeData, PARAMS.INFO_PAGE, {
            text: MSG.bookNotFound,
            type: "error"
          });

          history.push("/infoPage");
        }
      });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(storeData, PARAMS.BOOK, {});
  }

  render() {
    const { match } = this.props;
    return <div>{match.params.id}</div>;
  }
}

export default branch({}, BookPage);
