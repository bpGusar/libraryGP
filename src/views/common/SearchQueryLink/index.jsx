import React from "react";
import { Link } from "react-router-dom";
import cn from "classnames";

import s from "./index.module.scss";

function SearchQueryLink(props) {
  const { param, value, url, text, className } = props;
  return (
    <Link className={cn(className, s.link)} to={`${url}?${param}=${value}`}>
      {text}
    </Link>
  );
}

export default SearchQueryLink;
