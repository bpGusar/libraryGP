import React from "react";
import _ from "lodash";
import { branch } from "baobab-react/higher-order";

import { Button, Image, Card } from "semantic-ui-react";

import axs from "@axios";
import { setBookPoster } from "@act";
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

    axs.post(`uploadBookPoster`, data).then(resp => {
      if (!resp.data.msg.error) {
        bookCloned.bookInfo.imageLinks.poster =
          resp.data.msg.payload.posterPath;
        dispatch(setBookPoster, bookCloned);
      }
    });
  }

  render() {
    const { book } = this.props;
    return (
      <Card>
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
