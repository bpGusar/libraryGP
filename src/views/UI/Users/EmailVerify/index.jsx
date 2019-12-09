import React from "react";
import { branch } from "baobab-react/higher-order";
import queryString from "query-string";

import axs from "@axios";

import { storeData } from "@act";
import { PARAMS } from "@store";

function EmailVerify(props) {
  const { location, dispatch, history, globalLoader } = props;

  const query = queryString.parse(location.search);

  if (!globalLoader) {
    axs.get(`/users/service/${query.token}/email-verify`).then(res => {
      dispatch(storeData, PARAMS.INFO_PAGE, {
        text: res.data.message,
        type: !res.data.error ? "success" : "error"
      });

      history.push("/info-page");
    });
  }

  return <b>Выполняем...</b>;
}

export default branch(
  { globalLoader: PARAMS.IS_SOME_DATA_LOADING },
  EmailVerify
);
