import React from 'react';
import { Menu, Segment, Dimmer, Loader, Image, Dropdown } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { branch } from 'baobab-react/higher-order';
import { PARAMS } from '@store';
import { getMenuFromDB } from '@act';

import { axs } from '@axios';

class Header extends React.Component {
  state = { activeItem: 'home' };

  componentDidMount() {
    axs.post('/getMenu', { menuId: '5d0cdd7669529541dc73e657' }).then((res) => {
      if (res.status === 200) {
        this.props.dispatch(getMenuFromDB, res.data.menu);
      }
    });
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  _logOut() {
    localStorage.removeItem('token');
    document.location.href = '/';
  }

  _getLink(to, name) {
    return (
      <Menu.Item onClick={this.handleItemClick} active={this.state.activeItem === name} name={name} as={Link} to={to} key={name} content={name} />
    );
  }

  _generateMenu() {
    let menuArr = [];
    for (const key in this.props.menu) {
      if (key === 'always') {
        this.props.menu[key].map((el) => menuArr.push(this._getLink(el.to, el.name)));
      } else if (key === 'authorized' && this.props.isUserAuthorized) {
        this.props.menu[key].map((el) => menuArr.push(this._getLink(el.to, el.name)));
      } else if (key === 'onlyNotAuthorized' && !this.props.isUserAuthorized) {
        this.props.menu[key].map((el) => menuArr.push(this._getLink(el.to, el.name)));
      }
    }
    return menuArr;
  }

  render() {
    return (
      <Segment inverted>
        <Menu secondary inverted>
          {this.props.isAuthInProgress ? (
            <>
              <Dimmer active>
                <Loader />
              </Dimmer>
              <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />
            </>
          ) : (
            <>
              {this._generateMenu().map((el) => el)}
              {this.props.isUserAuthorized ? (
                <Dropdown item text={this.props.userInfo.login}>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => this._logOut()}>Выход</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                ''
              )}
            </>
          )}
        </Menu>
      </Segment>
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
