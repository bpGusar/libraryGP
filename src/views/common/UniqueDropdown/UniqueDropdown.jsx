/* eslint-disable no-underscore-dangle */
import React from "react";
import { branch } from "baobab-react/higher-order";
import _ from "lodash";

import { Form, Message, Button, Icon } from "semantic-ui-react";

import AddNew from "./AddNew";

import axs from "@axios";

import { storeData } from "@act";

import s from "./index.module.scss";

/**
 * Кастомный dropdown.
 * Принимает как стандартные пропсы semantic ui так и кастомные.
 *
 * Кастомные пропсы:
 * @param {String} axiosGetLink Ссылка на получение данных
 * @param {String} axiosPostLink Ссылка на добавление данных данных
 * @param {String} storeParam Ссылка на параметр в сторе
 * @param {Function} onChange Функция, которая будет принимать dropdown value
 * @param {Boolean} showAddNewField Показывать ли поле добавления новых данных
 * @param {String} dropdownValueName Используется для конвертации данных из базы и для добавления новых.
 * @param {Boolean} showClear Показывать ли кнопку очистить или нет.
 * @param {Array} currentValue Массив значений от родителя.
 */
class UniqueDropdown extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      options: [],
      error: ""
    };
  }

  componentDidMount() {
    this.handleGetAll();
  }

  // Если в одном компоненте собирается много экземпляров данного компонента это вызвает дикие лаги.
  // Поэтому смотрим что, обновление данного компонента будет происходить только при изменении всего двух параметров.
  shouldComponentUpdate(nextProps, nextState) {
    const { currentValue } = this.props;
    const { options } = this.state;
    if (
      JSON.stringify(currentValue) !== JSON.stringify(nextProps.currentValue) ||
      JSON.stringify(options) !== JSON.stringify(nextState.options)
    ) {
      return true;
    }
    return false;
  }

  handleGetAll() {
    const { dispatch, axiosGetLink, storeParam, axsQuery } = this.props;

    this.setState({
      isLoaded: false,
      error: ""
    });

    axs
      .get(axiosGetLink, !_.isUndefined(axsQuery) ? axsQuery : {})
      .then(resp => {
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
        text: _.get(el, dropdownValueName),
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

  render() {
    const {
      label,
      multiple,
      required,
      axiosPostLink,
      showAddNewField,
      dropdownValueName,
      showClear,
      currentValue,
      onChange,
      error: propsError
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
            error={propsError}
            selection
            loading={!isLoaded}
            options={_.sortBy(options, ["text"])}
            onChange={(e, { value }) => onChange(value)}
            label={label}
            value={currentValue}
          />
          {showClear && (
            <Button
              className={s.clearButton}
              as="a"
              onClick={() => onChange([])}
            >
              очистить
            </Button>
          )}
          {showAddNewField && (
            <AddNew
              axiosPostLink={axiosPostLink}
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
