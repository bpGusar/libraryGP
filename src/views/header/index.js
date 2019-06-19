import React from 'react';
import { Navbar, Nav, Spinner } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Cookies from 'js-cookie';

import { branch } from 'baobab-react/higher-order';
import { PARAMS } from '@store';

class Header extends React.Component {
  _logOut() {
    Cookies.remove('token');
    document.location.href = '/';
  }

  render() {
    return (
      <Navbar bg='dark' variant='dark'>
        {this.props.isAuthInProgress ? (
          <Spinner animation='border' variant='danger' />
        ) : (
          <>
            <Nav className='mr-auto'>
              <LinkContainer to='/'>
                <Nav.Link>Главная</Nav.Link>
              </LinkContainer>
              <LinkContainer to='/secret'>
                <Nav.Link>Секрет</Nav.Link>
              </LinkContainer>
              {!this.props.isUserAuthorized ? (
                <LinkContainer to='/login'>
                  <Nav.Link>Вход</Nav.Link>
                </LinkContainer>
              ) : (
                ''
              )}
            </Nav>
            {this.props.isUserAuthorized ? (
              <Navbar.Collapse className='justify-content-end'>
                <Navbar.Text>
                  Signed in as:{' '}
                  <a href='/#/' onClick={() => this._logOut()}>
                    {this.props.userInfo}
                  </a>
                </Navbar.Text>
              </Navbar.Collapse>
            ) : (
              ''
            )}
          </>
        )}
      </Navbar>
    );
  }
}

export default branch(
  {
    isUserAuthorized: PARAMS.IS_USER_AUTHORIZED,
    isAuthInProgress: PARAMS.IS_AUTH_IN_PROGRESS,
    userInfo: PARAMS.USER_INFO,
  },
  Header,
);
