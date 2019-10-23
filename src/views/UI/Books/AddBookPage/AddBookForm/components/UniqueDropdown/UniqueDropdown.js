/* eslint-disable no-underscore-dangle */
import React from "react";
import { branch } from "baobab-react/higher-order";
import _ from "lodash";

import { Form, Message, Button, Icon } from "semantic-ui-react";

import AddNew from "./AddNew";

import axs from "@axios";

import { PARAMS } from "@store";
import { storeData } from "@act";

class UniqueDropdown extends React.Component {
  constructor(props) {
    super(props);

    this.handleOnChangeDropdown = this.handleOnChangeDropdown.bind(this);

    this.state = {
      isLoaded: false,
      options: [],
      error: ""
    };
  }

  componentDidMount() {
    this.handleGetAll();
  }

  handleGetAll() {
    const { dispatch, axsGetLink, storeParam, axsQuery } = this.props;

    this.setState({
      isLoaded: false,
      error: ""
    });

    axs.get(axsGetLink, !_.isUndefined(axsQuery) ? axsQuery : {}).then(resp => {
      if (!resp.data.error) {
        dispatch(storeData, storeParam, resp.data.payload);
        this.handleConvertDataFromDBToOptions(resp.data.payload);
      } else {
        this.setState({
          isLoaded: true,
          error: resp.data.message
        });
      }
    });
  }

  handleConvertDataFromDBToOptions(dataArray) {
    const { dropdownValueName } = this.props;
    const optionsArr = [];

    // eslint-disable-next-line array-callback-return
    dataArray.map((el, i) => {
      optionsArr.push({
        key: el._id,
        text: el[dropdownValueName],
        value: el._id
      });
      if (dataArray.length - 1 === i) {
        this.setState({
          isLoaded: true,
          options: optionsArr
        });
      }
    });
  }

  handleOnChangeDropdown(e, { value }) {
    const { dispatch, book, onChangeBookInfoObjectProperty } = this.props;
    const bookCloned = _.cloneDeep(book);

    bookCloned.bookInfo[onChangeBookInfoObjectProperty] = value;

    dispatch(storeData, PARAMS.BOOK_TO_DB, bookCloned);
  }

  render() {
    const {
      book,
      label,
      onChangeBookInfoObjectProperty,
      multiple,
      required,
      axsPostLink,
      showAddNewField,
      dropdownValueName
    } = this.props;
    const { options, isLoaded, error } = this.state;

    return (
      <>
        <Form.Field>
          <Form.Dropdown
            fluid
            required={required}
            multiple={multiple}
            search
            selection
            loading={!isLoaded}
            options={_.sortBy(options, ["text"])}
            onChange={this.handleOnChangeDropdown}
            label={label}
            defaultValue={book.bookInfo[onChangeBookInfoObjectProperty]}
          />
          {showAddNewField && (
            <AddNew
              axsPostLink={axsPostLink}
              functionOnSuccess={() => this.handleGetAll()}
              dropdownValueName={dropdownValueName}
            />
          )}
          {error !== "" && (
            <Message negative>
              <Message.Header>{error}</Message.Header>
              <br />
              <Button
                animated="fade"
                primary
                onClick={() => this.handleGetAll()}
              >
                <Button.Content visible>Повторить загрузку</Button.Content>
                <Button.Content hidden>
                  <Icon name="redo" />
                </Button.Content>
              </Button>
            </Message>
          )}
        </Form.Field>
      </>
    );
  }
}

export default branch({}, UniqueDropdown);
