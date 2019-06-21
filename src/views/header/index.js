import React from 'react';
import { Navbar, Nav, Spinner } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import { branch } from 'baobab-react/higher-order';
import { PARAMS } from '@store';
import { getMenuFromDB } from '@act';

import { axs } from '@axios';

class Header extends React.Component {
  componentDidMount() {
    axs.post('/getMenu', { menuId: '5d0cdd7669529541dc73e657' }).then((res) => {
      if (res.status === 200) {
        this.props.dispatch(getMenuFromDB, res.data.menu);
      }
    });
  }

  _logOut() {
    localStorage.removeItem('token');
    document.location.href = '/';
  }

  _generateMenu() {
    let menuArr = [];
    for (const key in this.props.menu) {
      if (key === 'always') {
        this.props.menu[key].map((el) =>
          menuArr.push(
            <LinkContainer key={el.name} to={el.to}>
              <Nav.Link>{el.name}</Nav.Link>
            </LinkContainer>,
          ),
        );
      } else if (key === 'authorized' && this.props.isUserAuthorized) {
        this.props.menu[key].map((el) =>
          menuArr.push(
            <LinkContainer key={el.name} to={el.to}>
              <Nav.Link>{el.name}</Nav.Link>
            </LinkContainer>,
          ),
        );
      } else if (key === 'onlyNotAuthorized' && !this.props.isUserAuthorized) {
        this.props.menu[key].map((el) =>
          menuArr.push(
            <LinkContainer key={el.name} to={el.to}>
              <Nav.Link>{el.name}</Nav.Link>
            </LinkContainer>,
          ),
        );
      }
    }
    return menuArr;
  }

  render() {
    return (
      <Navbar bg='dark' variant='dark'>
        {this.props.isAuthInProgress ? (
          <Spinner animation='border' variant='danger' />
        ) : (
          <>
            <Nav className='mr-auto'>{this._generateMenu().map((el) => el)}</Nav>
            {this.props.isUserAuthorized ? (
              <Navbar.Collapse className='justify-content-end'>
                <Navbar.Text>
                  Signed in as:{' '}
                  <a href='/#/' onClick={() => this._logOut()}>
                    {this.props.userInfo.login}
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
    menu: PARAMS.MENU,
  },
  Header,
);
