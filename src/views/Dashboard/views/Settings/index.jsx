import React, { Component } from "react";
import { branch } from "baobab-react/higher-order";
import _ from "lodash";
import { Form } from "semantic-ui-react";

import { PARAMS } from "@store";
import { storeData } from "@act";

import axs from "@axios";

import SaveChanges from "./components/SaveChanges";
import MainPage from "./components/MainPage";

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      settingsState: { ...props.settings },
      isLoading: false
    };
  }

  handleChangeOption = (value, name) => {
    const { settingsState } = this.state;
    const settingsCloned = _.cloneDeep(settingsState);

    _.set(settingsCloned, name, value);

    this.setState({
      settingsState: { ...settingsCloned }
    });
  };

  handleSaveChanges() {
    const { dispatch } = this.props;
    const { settingsState } = this.state;
    this.setState({
      isLoading: true
    });
    axs.put(`/settings`, { settings: { ...settingsState } }).then(resp => {
      if (!resp.data.error) {
        dispatch(storeData, PARAMS.SETTINGS, settingsState);
        this.setState({
          isLoading: false
        });
      }
    });
  }

  handleCancelChanges() {
    const { settings } = this.props;
    this.setState({
      settingsState: { ...settings }
    });
  }

  render() {
    const { settings } = this.props;
    const { settingsState, isLoading } = this.state;
    const storeEqState =
      JSON.stringify(settings) !== JSON.stringify(settingsState);

    return (
      <>
        <Form loading={isLoading}>
          <SaveChanges
            saveActive={!storeEqState}
            disableActive={!storeEqState}
            onSave={() => this.handleSaveChanges()}
            onCancel={() => this.handleCancelChanges()}
            loading={isLoading}
          />
          <MainPage
            settings={settingsState}
            onChange={this.handleChangeOption}
          />
        </Form>
      </>
    );
  }
}

export default branch({ settings: PARAMS.SETTINGS }, Settings);
