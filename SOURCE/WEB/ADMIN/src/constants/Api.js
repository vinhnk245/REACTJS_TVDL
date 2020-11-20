import axios from 'axios'
import Cookie from 'js-cookie'
import reactotron from 'reactotron-react-js'
import swal from 'sweetalert'
const Reactotron = process.env.NODE_ENV !== 'production' && require('reactotron-react-js').default
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })

function createAxios() {
  var axiosInstant = axios.create()
  axiosInstant.defaults.baseURL = process.env.HOST || `http://13.251.27.111:9496/`
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
      if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        Reactotron.apisauce(response)
      } else {
        // production code
      }

      if (response.data.code === 403) {
        Cookie.remove('SESSION_ID')
        window.location.reload()
      } else if (response.data.status !== 1)
        // setTimeout(() => {
        // alert(response.data.msg)
        // }, 300)
        swal({
          title: response.data.msg,
          timer: 2000,
          icon: 'error',
        })
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
      if (res.data.status !== 1) {
        if (res.data.code === 403) {
          Cookie.remove('SESSION_ID')
        }
        return Promise.reject(res.data)
      }
      return Promise.resolve(res.data)
    }
  })
}

export const requestGetUserInfo = () => {
  return handleResult(getAxios.get(`member/getUserInfo`))
}

export const requestLogin = (payload) => {
  return handleResult(getAxios.post(`home/login`, payload))
}

export const requestGetOverviews = () => {
  return handleResult(getAxios.get(`home/getOverviews`))
}

// Member
export const getListMember = (payload) => {
  return handleResult(
    getAxios.get(
      `member/getListMember?page=${payload.page}&limit=${payload.limit}&text=${payload.text}&status=${payload.status}&orderBy=${payload.orderBy}&dobMonth=${payload.dobMonth}`
    )
  )
}

export const createMember = (payload) => {
  return handleResult(getAxios.post(`member/createMember`, payload))
}

export const deleteMember = (payload) => {
  return handleResult(getAxios.post(`member/deleteMember`, payload))
}

export const updateMember = (payload) => {
  return handleResult(getAxios.post(`member/updateMember`, payload))
}

export const getMemberInfo = (payload) => {
  return handleResult(getAxios.get(`member/getMemberInfo?id=${payload.id}`))
}

// Reader
export const getListReader = (payload) => {
  return handleResult(
    getAxios.get(
      `reader/getListReader?page=${payload.page}&limit=${payload.limit}&text=${payload.text}&cardNumber=${payload.cardNumber}&status=${payload.status}&orderBy=${payload.orderBy}`
    )
  )
}

export const createReader = (payload) => {
  return handleResult(getAxios.post(`reader/createReader`, payload))
}

export const deleteReader = (payload) => {
  return handleResult(getAxios.post(`reader/deleteReader`, payload))
}

export const updateReader = (payload) => {
  return handleResult(getAxios.post(`reader/updateReader`, payload))
}

export const getReaderInfo = (payload) => {
  return handleResult(getAxios.get(`reader/getReaderInfo?id=${payload.id}`))
}
