import React from "react";
import _ from "lodash";
import { branch } from "baobab-react/higher-order";

import { Button, Image, Item, Segment, Modal } from "semantic-ui-react";

import { PARAMS } from "@store";
import { storeData } from "@act";

import s from "./index.module.scss";

class Poster extends React.Component {
  constructor(props) {
    super(props);

    this.uploadPoster = this.uploadPoster.bind(this);

    this.posterInputRef = React.createRef();
  }

  uploadPoster(e) {
    e.preventDefault();

    const { book, dispatch } = this.props;
    const bookCloned = _.cloneDeep(book);

    const reader = new FileReader();
    const file = e.target.files[0];

    reader.onloadend = () => {
      bookCloned.bookInfo.imageLinks.poster = reader.result;
      dispatch(storeData, PARAMS.BOOK_TO_DB, bookCloned);
    };

    reader.readAsDataURL(file);
  }

  render() {
    const { book } = this.props;

    return (
      <Segment>
        <Item.Group>
          <Item>
            <Modal
              trigger={
                <Image
                  src={
                    book.bookInfo.imageLinks.poster ||
                    "http://localhost:5000/placeholder/imagePlaceholder.png"
                  }
                  wrapped
                  ui={false}
                  className={s.posterImg}
                />
              }
              basic
              size="small"
            >
              <Modal.Content>
                <Image
                  src={
                    book.bookInfo.imageLinks.poster ||
                    "http://localhost:5000/placeholder/imagePlaceholder.png"
                  }
                  wrapped
                  ui={false}
                  className={s.posterImgInModal}
                />
              </Modal.Content>
            </Modal>

            <Item.Content>
              <Item.Header as="a">Постер</Item.Header>
              <Item.Description>
                <Button
                  content="Выберите постер"
                  labelPosition="left"
                  icon="file"
                  onClick={e => {
                    e.preventDefault();
                    this.posterInputRef.current.click();
                  }}
                />
                <input
                  type="file"
                  ref={this.posterInputRef}
                  hidden
                  onChange={this.uploadPoster}
                />
              </Item.Description>
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
    );
  }
}

export default branch(
  {
    book: PARAMS.BOOK_TO_DB,
    userInfo: PARAMS.USER_INFO
  },
  Poster
);
