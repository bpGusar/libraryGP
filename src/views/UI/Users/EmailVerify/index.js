import React from "react";
import { branch } from "baobab-react/higher-order";
import queryString from "query-string";

import axs from "@axios";

import { storeData } from "@act";
import { PARAMS } from "@store";

class EmailVerify extends React.Component {
  componentDidMount() {
    const { location, dispatch, history, globalLoader } = this.props;

    const query = queryString.parse(location.search);

    if (!globalLoader) {
      axs.get(`/users/${query.token}/email-verify`).then(res => {
        dispatch(storeData, PARAMS.INFO_PAGE, {
          text: res.data.message,
          type: !res.data.error ? "success" : "error"
        });

        history.push("/info-page");
      });
    }
  }

  render() {
    return <></>;
  }
}

export default branch({ globalLoader: PARAMS.GLOBAL_PAGE_LOADER }, EmailVerify);
