import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react'

export default class MainPage extends Component {
  render() {
    return (
      <div>
        главная <br />
        <Button as={Link} to='/addBook' color='blue'>
          Добавить книгу
        </Button>
      </div>
    );
  }
}
