import React from "react";
import ReactDOM from "react-dom";
import App from "./common/App/App";
import "semantic-ui-css/semantic.min.css";

// TODO: если меняется salt или secret то по тому токену что уже в браузере не происходит логин и нужно вывести сообщение о том что нужно перевойти
// TODO: сделать крон операцию на удаление файлов из posters temp каждые 3 дня, при этом нужно смотреть что б разница в днях между датой создания картинки и датой удаления не была меньше 3х дней
// TODO: сделать проверку что если книга уже на руках или бронь на нее выдана то блокировать кнопку
ReactDOM.render(<App />, document.getElementById("root"));
