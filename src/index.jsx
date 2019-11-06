import React from "react";
import ReactDOM from "react-dom";
import App from "./common/App/App";
import "semantic-ui-css/semantic.min.css";

// TODO: если меняется salt или secret то по тому токену что уже в браузере не происходит логин и нужно вывести сообщение о том что нужно перевойти
ReactDOM.render(<App />, document.getElementById("root"));
