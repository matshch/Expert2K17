import * as React from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink as NavBarLink } from 'reactstrap';
import { ApplicationState } from '../store';
import * as UserStore from '../store/User';
import { NavLink, Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

type NavBarProps =
    UserStore.UserState
    & typeof UserStore.actionCreators;

class NavBar extends React.Component<NavBarProps, { isOpen: boolean }> {
  constructor(props: NavBarProps) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  componentWillMount() {
    this.props.GetUser();
  }

  toggle = () => this.setState({
      isOpen: !this.state.isOpen
  });

  render() {
    return (
      <div>
        <Navbar fixed="top" dark color="dark" expand="lg">
          <Link className='navbar-brand' to={'/'}>ЭЗ ПЕЗ<sup>β</sup></Link>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav navbar>
              <NavItem>
                <NavLink exact to={'/'} className='nav-link' activeClassName='active'>
                  Список тестов
                </NavLink>
              </NavItem>
              {(this.props.user != undefined && this.props.user != null) ?
                (<NavItem>
                  <NavLink to={'/CreateTest'} className='nav-link' activeClassName='active'>
                    Создание теста
                  </NavLink>
                </NavItem>) : null}
              {(this.props.user != undefined && this.props.user != null && this.props.user.isAdmin) ?
                (<NavItem>
                  <NavLink to={'/panel'} className='nav-link' activeClassName='active'>
                    Панель управления
                  </NavLink>
                </NavItem>) : null}
            </Nav>
            <Nav navbar>
              {(this.props.user != undefined && this.props.user != null) ?
                (<NavItem>
                  <NavLink to={'/profile'} className='nav-link' activeClassName='active'>
                    {this.props.user.userName}
                  </NavLink>
                </NavItem>) :
                [<NavItem>
                  <NavLink to={'/login'} className='nav-link' activeClassName='active'>
                    Войти
                  </NavLink>
                </NavItem>,
                <NavItem key="register">
                  <NavLink to={'/register'} className='nav-link' activeClassName='active'>
                    Зарегистрироваться
                  </NavLink>
                </NavItem>]}
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

export default withRouter(connect((state: ApplicationState) => state.user, UserStore.actionCreators)(NavBar));