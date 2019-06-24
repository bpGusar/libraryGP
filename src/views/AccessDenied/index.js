import React from 'react';
import { branch } from 'baobab-react/higher-order';
import { PARAMS } from '@store';
import { Button, Header, Icon, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class AccessDenied extends React.Component {
  render() {
    return (
      <Segment placeholder>
        <Header icon>
          <Icon name='close' color="red" />
          Доступ на страницу ограничен. {!this.props.isUserAuthorized ? 'Выполните вход и повторите попытку.' : ''}
        </Header>
        <Segment.Inline>
          {!this.props.isUserAuthorized ? <Button primary as={Link} to='/login'>Войти</Button> : ''}
          <Button as={Link} to='/'>
            На главную
          </Button>
        </Segment.Inline>
      </Segment>
    );
  }
}

export default branch({ isUserAuthorized: PARAMS.IS_USER_AUTHORIZED }, AccessDenied);
