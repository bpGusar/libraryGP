import React from "react";
import { Segment, Dimmer, Loader } from "semantic-ui-react";

import s from "./index.module.scss";

export default function CustomLoader() {
  return (
    <Segment className={s.loader}>
      <Dimmer active>
        <Loader />
      </Dimmer>
    </Segment>
  );
}
