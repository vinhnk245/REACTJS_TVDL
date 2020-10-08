import React from 'react'
import '../../styles/Login.css'
import { Link, Redirect } from 'react-router-dom'
import { STRING } from '@constants/Constant';
import { requestLogin } from '@constants/Api'
import Cookie from 'js-cookie'
import reactotron from 'reactotron-react-js'
import LoadingAction from '@src/components/LoadingAction'
// import HomeScreen from '@screens/HomeScreen'

class LoginScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      width: window.innerWidth,
      height: window.innerHeight,
      loadingAction: false,
    }
  }
  updateDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight })
  }
  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions)
  }

  login = async () => {
    const { username, password } = this.state
    this.setState({
      loadingAction: true,
    })
    if (!username || !password) {
      alert('Vui lòng nhập đầy đủ thông tin!')
      this.setState({
        loadingAction: false,
      })
      return
    }

    try {
      const res = await requestLogin({
        USERNAME: username,
        PASS: password,
      })
      this.setState({
        loadingAction: false,
      })
      Cookie.set('SESSION_ID', res.data.TOKEN, {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 1 month
      })
      window.location.href = '/'
    } catch (err) {
      console.log('error', err)
      this.setState({
        loadingAction: false,
      })
    }
  }

  handleTextChange(field, event) {
    this.setState({
      [field]: event.target.value,
    })
  }

  render() {
    const { username, password, loadingAction } = this.state
    const token = Cookie.get('SESSION_ID')
    if (token) {
      return <Redirect to="/" />
    }

    return (
      <>
        {loadingAction && <LoadingAction />}
        <div style={{ width: this.state.width, height: this.state.height, backgroundColor: 'white' }}>
          <div className="bodyLogin">
            <div className="container-fluid form">
              <div className="loginForm form" style={{ backgroundColor: 'white' }}>
                <img src={require('../../assets/img_logo.png')} alt="logoVitrans" />
                <form>
                  <div className="form-group">
                    <input
                      // type="number"
                      placeholder={STRING.account}
                      autoComplete="on"
                      className="form-control"
                      value={username}
                      onChange={(e) => this.handleTextChange('username', e)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      placeholder="Mật khẩu"
                      className="form-control"
                      value={password}
                      onChange={(e) => this.handleTextChange('password', e)}
                      required
                    />
                  </div>
                  <Link>
                    <button type="submit" className="btn btn-danger" onClick={this.login}>
                      <div className="login-button-content">
                        <span>Đăng nhập</span>
                      </div>
                    </button>
                  </Link>
                </form>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}
export default LoginScreen
