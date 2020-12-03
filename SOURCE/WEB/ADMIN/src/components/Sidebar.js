import React, { Component } from 'react'
import '@styles/SideBar.css'
import { withRouter, NavLink } from 'react-router-dom'
import { ROUTER, STRING } from '@constants/Constant'
import logo from '../assets/logo_white.png'
import Reactotron from 'reactotron-react-js'

class Sidebar extends Component {
  state = {
    width: window.innerWidth,
    height: window.innerHeight,
    show: false,
    member: {},
  }
  updateDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight })
  }
  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions)
  }

  render() {
    const { push } = this.props.history
    const { active } = this.state
    const pathName = window.location.pathname
    const member = this.props.member
    return (
      <aside className="main-sidebar sidebar-dark-primary elevation-4 me-sidebar">
        {/* Brand Logo */}
        <a className="brand-link cursor head-menu-sidebar">
          <img src={logo} className="brand-image logo-sidebar" data-auto-collapse-size="768" />
          <i className="nav-icon fas fa-bars me-delete" data-widget={this.state.width < 990 && 'pushmenu'}></i>
        </a>
        {/* Sidebar */}
        <div className="sidebar me-sidebar">
          {/* Sidebar Menu */}
          <nav className="mt-2">
            <ul
              className="nav nav-pills nav-sidebar flex-column"
              data-widget="treeview"
              role="menu"
              data-accordion="false"
            >

              <li
                className={pathName.search('tong-quan') !== -1 ? 'nav-item actived hoved' : 'nav-item hoved'}
                data-widget={this.state.width < 990 && 'pushmenu'}
                onClick={() => push(ROUTER.OVERVIEW)}
              >
                <a className="nav-link cursor nav-link-hover">
                  <i className="nav-icon fas fa-tachometer-alt" />
                  <p className="me-txt-menu">{STRING.overView}</p>
                </a>
              </li>

              <li
                className={pathName.search('tnv') !== -1 ? 'nav-item actived hoved' : 'nav-item hoved'}
                onClick={() => push(ROUTER.MEMBER)}
              >
                <a className="nav-link cursor nav-link-hover" data-widget={this.state.width < 990 && 'pushmenu'}>
                  <i className="nav-icon fas fa-users" />
                  <p className="me-txt-menu">{STRING.member}</p>
                </a>
              </li>

              <li
                className={pathName.search('ban-doc') !== -1 ? 'nav-item actived hoved' : 'nav-item hoved'}
                onClick={() => push(ROUTER.READER)}
              >
                <a className="nav-link cursor nav-link-hover" data-widget={this.state.width < 990 && 'pushmenu'}>
                  <i className="nav-icon fas fa-address-card" />
                  <p className="me-txt-menu">{STRING.reader}</p>
                </a>
              </li>

              <li
                className={pathName.search('sach') !== -1 ? 'nav-item actived hoved' : 'nav-item hoved'}
                onClick={() => push(ROUTER.BOOK)}
              >
                <a className="nav-link cursor nav-link-hover" data-widget={this.state.width < 990 && 'pushmenu'}>
                  <i className="nav-icon fas fa-book-open" />
                  <p className="me-txt-menu">{STRING.book}</p>
                </a>
              </li>

              <li
                className={pathName.search('muon-tra') !== -1 ? 'nav-item actived hoved' : 'nav-item hoved'}
                onClick={() => push(ROUTER.RENTED)}
              >
                <a className="nav-link cursor nav-link-hover" data-widget={this.state.width < 990 && 'pushmenu'}>
                  <i className="nav-icon fab fa-buffer" />
                  <p className="me-txt-menu">{STRING.rented}</p>
                </a>
              </li>

              <li
                className={pathName.search('su-kien') !== -1 ? 'nav-item actived hoved' : 'nav-item hoved'}
                onClick={() => push(ROUTER.EVENT)}
              >
                <a className="nav-link cursor nav-link-hover" data-widget={this.state.width < 990 && 'pushmenu'}>
                  <i className="nav-icon fas fa-calendar-check" />
                  <p className="me-txt-menu">{STRING.event}</p>
                </a>
              </li>

            </ul>
          </nav>
          {/* /.sidebar-menu */}
        </div>
        {/* /.sidebar */}
      </aside>
    )
  }
}

export default withRouter(Sidebar)
