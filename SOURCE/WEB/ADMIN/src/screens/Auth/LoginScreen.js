import React from 'react'
import '@styles/Login.css'
import '@styles/lunar.css'
import '@styles/demo.css'
import '@styles/animate.min.css'
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
            <div className="row width-100">
              <div className="col-md-7 col-sm-6 bg-img d-none d-sm-flex align-items-end">
              </div>
              <div className="col-md-5 col-sm-6 col-12 style-form-login">
                <h2 className="color-tvdl mb-5">Quản lý Thư viện</h2>
                <form>
                  <div className="form-group">
                    <input placeholder={STRING.account}
                      autoComplete="on"
                      className="form-control"
                      value={username}
                      onChange={(e) => this.handleTextChange('username', e)}
                      required />
                  </div>
                  <div className="form-group">
                    <input type="password"
                      placeholder={STRING.password}
                      className="form-control"
                      value={password}
                      onChange={(e) => this.handleTextChange('password', e)}
                      required />
                  </div>
                  <Link>
                    <button type="submit" className="btn btn-success" onClick={this.login}>ĐĂNG NHẬP</button>
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
