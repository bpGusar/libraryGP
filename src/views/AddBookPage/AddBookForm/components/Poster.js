import React from "react";
import _ from "lodash";
import { branch } from "baobab-react/higher-order";

import { Button, Image, Card } from "semantic-ui-react";

import axs from "@axios";
import { storeData } from "@act";
import { PARAMS } from "@store";

class Poster extends React.Component {
  constructor(props) {
    super(props);

    this.uploadPoster = this.uploadPoster.bind(this);

    this.posterInputRef = React.createRef();
  }

  uploadPoster(ev) {
    const { book, dispatch } = this.props;
    const bookCloned = _.cloneDeep(book);

    const data = new FormData();
    data.append("file", ev.target.files[0], ev.target.files[0].name);

    axs.post(`/upload/book/poster`, data).then(resp => {
      if (!resp.data.error) {
        bookCloned.bookInfo.imageLinks.poster = resp.data.payload.posterPath;
        dispatch(storeData, PARAMS.BOOK, bookCloned);
      }
    });
  }

  render() {
    const { book } = this.props;
    return (
      <Card width="100%">
        <Image src={book.bookInfo.imageLinks.poster} wrapped ui={false} />
        <Card.Content extra>
          <Button
            content="Выберите постер"
            labelPosition="left"
            icon="file"
            onClick={() => this.posterInputRef.current.click()}
          />
          <input
            type="file"
            ref={this.posterInputRef}
            hidden
            onChange={this.uploadPoster}
          />
        </Card.Content>
      </Card>
    );
  }
}

export default branch({ book: PARAMS.BOOK }, Poster);
