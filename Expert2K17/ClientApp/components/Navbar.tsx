import * as React from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink as NavBarLink } from 'reactstrap';
import { NavLink, Link } from 'react-router-dom';

export default class NavBar extends React.Component<{}, { isOpen: boolean }> {
  constructor() {
    super();
    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    return (
      <div>
        <Navbar fixed="top" color="inverse" inverse={true} light toggleable>
          <NavbarToggler right onClick={this.toggle} />
          <Link className='navbar-brand' to={'/'}>ЭЗ ПЕЗ</Link>
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink exact to={'/'} className='nav-link' activeClassName='active'>
                  Список тестов
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to={'/CreateTest'} className='nav-link' activeClassName='active'>
                  Создание теста
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to={'/login'} className='nav-link' activeClassName='active'>
                  Войти
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to={'/panel'} className='nav-link' activeClassName='active'>
                  Панель управления
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to={'/profile'} className='nav-link' activeClassName='active'>
                  Профиль
                </NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}