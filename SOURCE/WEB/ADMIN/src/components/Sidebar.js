import React, { Component } from 'react'
import '@styles/SideBar.css'
import { withRouter, NavLink } from 'react-router-dom'
import { ROUTER, STRING } from '@constants/Constant'
import logo from '../assets/logo.png'
import Reactotron from 'reactotron-react-js'

class Sidebar extends Component {
  state = {
    width: window.innerWidth,
    height: window.innerHeight,
    show: false,
    user: {},
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
    const user = this.props.user
    return (
      <aside className="main-sidebar sidebar-dark-primary elevation-4 me-sidebar">
        {/* Brand Logo */}
        <a className="brand-link cursor">
          <img src={logo} className="brand-image" data-auto-collapse-size="768" style={{ opacity: '.8' }} />
          <span className="brand-text font-weight-light me-txt-logo">REACTJS_BASE</span>
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

              <li className="nav-item has-treeview">
                <a className="nav-link cursor">
                  <i className="nav-icon fas fa-warehouse" />
                  <p className="me-txt-menu">
                    {STRING.transportProvider}
                    <i className="fas fa-angle-left right" />
                  </p>
                </a>
                <ul className="nav nav-treeview me-menu-drop">
                  <li
                    className={
                      pathName.search('nha-xe') !== -1 ? 'nav-item sub-menu actived hoved' : 'nav-item sub-menu hoved'
                    }
                    data-widget={this.state.width < 990 && 'pushmenu'}
                    onClick={() => push(ROUTER.TRANSPORT_PROVIDER)}
                  >
                    <a className="nav-link cursor" style={{ flex: 1 }}>
                      <i className="nav-icon fas fa-warehouse me-sub-menu-item" />
                      <p className="me-txt-menu">{STRING.transportProvider}</p>
                    </a>
                  </li>
                  <li
                    className={
                      pathName.search('xe') !== -1 ? 'nav-item sub-menu actived hoved' : 'nav-item sub-menu hoved'
                    }
                    data-widget={this.state.width < 990 && 'pushmenu'}
                    onClick={() => push(ROUTER.TRANSPORT)}
                  >
                    <a className="nav-link cursor">
                      <i className="nav-icon fas fa-truck me-sub-menu-item" />
                      <p className="me-txt-menu">{STRING.transport}</p>
                    </a>
                  </li>
                </ul>
              </li>

              <li
                className={pathName.search('nguoi-dung') !== -1 ? 'nav-item actived hoved' : 'nav-item hoved'}
                onClick={() => push(ROUTER.USER)}
              >
                <a className="nav-link cursor nav-link-hover" data-widget={this.state.width < 990 && 'pushmenu'}>
                  <i className="nav-icon fas fa-user-circle" />
                  <p className="me-txt-menu">{STRING.user}</p>
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
