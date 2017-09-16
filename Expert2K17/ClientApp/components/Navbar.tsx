import * as React from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink as NavBarLink } from 'reactstrap';
import { NavLink, Link } from 'react-router-dom';

export default class NavBar extends React.Component<{}, {isOpen: boolean}> {
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
                <NavBarLink href="https://github.com/matshch/Expert2K17" target='_blank'>Github</NavBarLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}