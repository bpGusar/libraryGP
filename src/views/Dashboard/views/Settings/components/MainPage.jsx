import React, { Component } from "react";
import { Segment, Header } from "semantic-ui-react";

import CustomSelect from "@views/Common/CustomSelect";

// eslint-disable-next-line react/prefer-stateless-function
export default class MainPage extends Component {
  render() {
    const { settings, onChange } = this.props;
    return (
      <>
        <Header as="h3" attached="top">
          Главная страница
        </Header>
        <Segment attached>
          <CustomSelect
            label="В каком виде показывать книги на главной странице сайта?"
            options={[
              { key: "all", value: "all", text: "Все (скрытые и нет)" },
              {
                key: "false",
                value: false,
                text: "Показывать только не скрытые"
              },
              {
                key: "true",
                value: true,
                text: "Показывать только скрытые"
              }
            ]}
            name="showHiddenBooksOnMainPage"
            value={settings.showHiddenBooksOnMainPage}
            onChange={onChange}
            required
          />
        </Segment>
      </>
    );
  }
}
