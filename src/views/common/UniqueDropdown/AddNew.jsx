import React from "react";
import _ from "lodash";

import {
  Icon,
  Accordion,
  Input,
  Popup,
  Header,
  Button
} from "semantic-ui-react";

import axs from "@axios";

class AddNew extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: true,
      accordionActive: false,
      inputValue: "",
      error: false,
      errorMsg: ""
    };
  }

  handleSetNewInDB(e) {
    e.preventDefault();
    const {
      functionOnSuccess,
      axiosPostLink,
      getValueFromProperty
    } = this.props;
    const { inputValue } = this.state;

    this.setState({
      isLoaded: false,
      error: false,
      errorMsg: ""
    });

    if (_.isEmpty(inputValue)) {
      this.setState({
        isLoaded: true,
        error: true,
        errorMsg: "Поле не должно быть пустым."
      });
    } else {
      axs
        .post(axiosPostLink, { [getValueFromProperty]: inputValue })
        .then(resp => {
          if (!resp.data.error) {
            this.setState({
              isLoaded: true,
              inputValue: ""
            });

            functionOnSuccess();
          } else {
            this.setState({
              isLoaded: true,
              error: true,
              errorMsg: resp.data.message
            });
          }
        });
    }
  }

  render() {
    const {
      accordionActive,
      isLoaded,
      inputValue,
      error,
      errorMsg
    } = this.state;

    return (
      <Accordion>
        <Accordion.Title
          active={accordionActive}
          index={0}
          onClick={() => this.setState({ accordionActive: !accordionActive })}
          style={{
            color: "rgba(49, 105, 149, 0.87)"
          }}
        >
          <Icon name="plus" />
          Добавить
        </Accordion.Title>
        <Accordion.Content active={accordionActive}>
          <Popup
            trigger={
              <Input
                error={error}
                action={{
                  color: "teal",
                  labelPosition: "right",
                  icon: "plus",
                  disabled: !isLoaded,
                  content: "Добавить",
                  onClick: e => {
                    this.handleSetNewInDB(e);
                  }
                }}
                onChange={e =>
                  this.setState({
                    inputValue: e.currentTarget.value
                  })
                }
                value={inputValue}
                loading={!isLoaded}
                actionPosition="left"
              />
            }
            on="click"
            open={error}
            position="top right"
          >
            <Header as="h4">Ошибка</Header>
            <p>{errorMsg}</p>
            <Button
              size="mini"
              color="blue"
              onClick={() =>
                this.setState({
                  error: false
                })
              }
            >
              ОК
            </Button>
          </Popup>
        </Accordion.Content>
      </Accordion>
    );
  }
}

export default AddNew;
