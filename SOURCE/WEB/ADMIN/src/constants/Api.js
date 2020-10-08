import axios from 'axios'
import Cookie from 'js-cookie'
import reactotron from 'reactotron-react-js'
const Reactotron = process.env.NODE_ENV !== 'production' && require('reactotron-react-js').default
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })

function createAxios() {
  console.log('process.env.PORT', process.env)
  var axiosInstant = axios.create()
  axiosInstant.defaults.baseURL = process.env.HOST || `http://13.212.122.124:9496/`
  axiosInstant.defaults.timeout = 20000
  axiosInstant.defaults.headers = { 'Content-Type': 'application/json' }
  axiosInstant.defaults.headers = { 'access-control-allow-origin': '*' }

  axiosInstant.interceptors.request.use(
    async (config) => {
      config.headers.token = Cookie.get('SESSION_ID')
      return config
    },
    (error) => Promise.reject(error)
  )

  axiosInstant.interceptors.response.use(
    (response) => {
      // log via ReactOtron
      if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        Reactotron.apisauce(response)
      } else {
        // production code
      }

      if (response.data.code === 403) {
        Cookie.remove('SESSION_ID')
        window.location.reload()
      } else if (response.data.status !== 1)
        setTimeout(() => {
          alert(response.data.msg)
        }, 300)
      return response
    },
    (error) => {}
  )
  return axiosInstant
}
//   var axiosInstant = axios.create()
//   axiosInstant.defaults.baseURL = 'localhost:3000/'
//   axiosInstant.defaults.timeout = 20000
//   axiosInstant.defaults.headers = { 'Content-Type': 'application/json' }

//   axiosInstant.interceptors.request.use(
//     async (config) => {
//       config.headers.token = Cookie.get('SESSION_ID')
//       return config
//     },
//     (error) => Promise.reject(error)
//   )

//   axiosInstant.interceptors.response.use((response) => {
//     Reactotron.apisauce(response)

//     // if (response.data && response.data.code == 403) {
//     //   showMessages(
//     //     R.strings().notif_tab_cus,
//     //     R.strings().require_login_againt,
//     //     () =>
//     //       AsyncStorage.removeItem(ASYNC_STORAGE.TOKEN, () => {
//     //         const store = require("@app/redux/store").default;
//     //         store.dispatch({ type: "reset" });
//     //         NavigationUtil.navigate(SCREEN_ROUTER_AUTH.AUTH_LOADING);
//     //       })
//     //   );
//     // } else if (response.data && response.data.status != 1)
//     //   showMessages(R.strings().notif_tab_cus, response.data.message);
//     return response
//   })

//   return axiosInstant
// }

export const getAxios = createAxios()

/* Support function */
// function handleResult(api) {
//   return api.then((res) => {
//     if (res.data?.status !== 1) {
//       // alert(res.data.msg);
//       return Promise.reject(res.data);
//     }
//     return Promise.resolve(res.data);
//   });
//   // return api
//   //   .then((res) => {
//   //     if (res.data.status !== 1) {
//   //       return Promise.reject(new Error("Co loi xay ra", res.data.msg));
//   //     }
//   //     return Promise.resolve(res.data);
//   //   })
// }

function handleResult(api) {
  return api.then((res) => {
    if (res) {
      if (res.data.status != 1) {
        if (res.data.code === 403) {
          Cookie.remove('SESSION_ID')
          // alert("Phiên đăng nhập hết hạn.");
        }
        return Promise.reject(res.data)
      }
      return Promise.resolve(res.data)
    }
  })
}

export const requestHomeData = (deviceID = '') => {
  return handleResult(getAxios.get(`api/Service/GetHomeScreen?deviceID=${deviceID}`))
}

export const requestGetUserInfo = () => {
  return handleResult(getAxios.get(`users/getUserInfo`))
}

export const requestLogin = (payload) => {
  return handleResult(
    getAxios.post(`home/login`, {
      account: payload.USERNAME,
      password: payload.PASS,
    })
  )
}

// Users screen
export const getListUser = (
  payload = {
    SEARCH: '',
    PAGE: 1,
    FROM_DATE: 0,
    TO_DATE: Date.now() / 1000,
    STATUS: 1,
  }
) => {
  return handleResult(
    getAxios.get(
      `users/getListUser?SEARCH=${payload.SEARCH}&PAGE=${payload.PAGE}&FROM_DATE=${payload.FROM_DATE}&TO_DATE=${payload.TO_DATE}`
    )
  )
}

export const postCreateUser = (payload) => {
  return handleResult(getAxios.post(`users/createUser`, payload))
}

export const deleteUser = (payload) => {
  return handleResult(getAxios.post(`users/deleteUser`, payload))
}

export const updateUser = (payload) => {
  return handleResult(getAxios.post(`users/updateUser`, payload))
}

export const getUserRole = () => {
  return handleResult(getAxios.get(`users/getListUserRole`))
}

export const getUserDetail = (payload) => {
  return handleResult(getAxios.get(`users/getUserDetail?USER_ID=${payload.USER_ID}`))
}

// Transport screen
export const getListTransport = (payload) => {
  if (payload) {
    return handleResult(
      getAxios.get(
        `transport/getListTransport?TRANSPORT_PROVIDER_ID=${payload.TRANSPORT_PROVIDER_ID}&PAGE=${payload.PAGE}&SEARCH=${payload.SEARCH}&FROM_DATE=${payload.FROM_DATE}&TO_DATE=${payload.TO_DATE}&START_PROVINCE_CODE=${payload.START_PROVINCE_CODE}&END_PROVINCE_CODE=${payload.END_PROVINCE_CODE}`,
        payload
      )
    )
  } else {
    return handleResult(getAxios.get(`transport/getListTransport`))
  }
}

export const getTransportInfo = (id) => {
  return handleResult(getAxios.get(`transport/getTransportInfo?TRANSPORT_ID=${id}`))
}

export const getTransportHistory = (payload) => {
  return handleResult(
    getAxios.get(
      `transportRequest/getListTransportAssignedTransportProvider?TRANSPORT_PROVIDER_ID=${payload.TRANSPORT_PROVIDER_ID}&PAGE=${payload.PAGE}&STATUS=${payload.STATUS}&DRIVER_USER_ID=${payload.DRIVER_USER_ID}&FROM_DATE=${payload.FROM_DATE}&TO_DATE=${payload.TO_DATE}&ROUTE_ID=${payload.ROUTE_ID}&TRANSPORT_ID=${payload.TRANSPORT_ID}`,
      payload
    )
  )
}

export const addTransport = (payload) => {
  return handleResult(getAxios.post(`transport/createTransport`, payload))
}

export const updateTransport = (payload) => {
  return handleResult(getAxios.post(`transport/updateTransport`, payload))
}

export const deleteTransport = (payload) => {
  return handleResult(getAxios.post(`transport/deleteTransport`, payload))
}
export const getListTransportRoute = (payload) => {
  return handleResult(getAxios.get(`route/getListTransportRoute?TRANSPORT_PROVIDER_ID=${payload}`))
}

export const confirmTransport = (payload) => {
  return handleResult(getAxios.post(`transport/confirmTransport`, payload))
}

export const rejectTransport = (payload) => {
  return handleResult(getAxios.post(`transport/rejectTransport`, payload))
}
export const unActiveTransport = (payload) => {
  return handleResult(getAxios.post(`transport/unActiveTransport`, payload))
}
export const activeTransport = (payload) => {
  return handleResult(getAxios.post(`transport/activeTransport`, payload))
}
