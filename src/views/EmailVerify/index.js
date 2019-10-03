import { branch } from "baobab-react/higher-order";
import queryString from "query-string";

import axs from "@axios";

import { storeData } from "@act";
import { PARAMS } from "@store";

function EmailVerify(props) {
  const { location, dispatch, history } = props;

  const query = queryString.parse(location.search);

  axs
    .get("/emailVerification", { params: { verifyToken: query.token } })
    .then(res => {
      dispatch(storeData, PARAMS.INFO_PAGE, {
        text: res.data.message,
        type: !res.data.error ? "success" : "error"
      });

      history.push("/infoPage");
    });

  return true;
}

export default branch({}, EmailVerify);
