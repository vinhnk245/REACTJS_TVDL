import { STRING } from '@constants/Constant'

export const toDateString = (date) => {
  let start = new Date(date)
  let startDateString = `${start.getDate()}/${
    start.getMonth() + 1 < 10 ? '0' + (start.getMonth() + 1) : start.getMonth() + 1
  }/${start.getFullYear()}`
  return startDateString
}

const test = (self, regrex, value, fieldName, response) => {
  let result = new RegExp(regrex).test(value)
  if (!result) {
    self.setState({
      validateError: {
        ...self.state.validateError,
        [fieldName]: `*${fieldName} không hợp lệ`,
      },
    })
  } else {
    self.setState({
      validateError: {
        ...self.state.validateError,
        [fieldName]: null,
      },
    })
  }
}

export const validateForm = (self, value, fieldName) => {
  // const { [fieldname]: field } = self.validateError;
  let regrex
  switch (fieldName) {
    case STRING.phoneNumber:
      regrex = /((09|03|07|08|05|02|06)+([0-9]{8})\b)/g
      break
    case STRING.receiverPhone:
      regrex = /((09|03|07|08|05|02|06)+([0-9]{8})\b)/g
      break
    case STRING.receiverPhoneAtStore:
      regrex = /((09|03|07|08|05|02|06)+([0-9]{8})\b)/g
      break
    case STRING.email:
      regrex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/g
      break
    case STRING.username:
      regrex = /[0-9a-zA-Z_]{4,}\S/g
      break
    case STRING.fullname:
      regrex = /^(?=.{1,30}$).*/g
      break
    case STRING.title:
      regrex = /^(?=.{1,30}$).*/g
      break
    case STRING.fullnameReceiver:
      regrex = /^(?=.{1,30}$).*/g
      break
    case STRING.receiverNameAtStore:
      regrex = /^(?=.{1,30}$).*/g
      break
    case STRING.storeName:
      regrex = /^(?=.{1,30}$).*/g
      break
    case STRING.transportProviderName:
      regrex = /^(?=.{1,30}$).*/g
      break
    case STRING.bankName:
      regrex = /^(?=.{1,30}$).*/g
      break
    case STRING.bankOwnerName:
      regrex = /^(?=.{1,30}$).*/g
      break
    case STRING.userProxy:
      regrex = /^(?=.{1,30}$).*/g
      break
    case STRING.address:
      regrex = /^(?=.{1,100}$).*/g
      break
    case STRING.bankAccount:
      regrex = /^[0-9]{7,14}$/g
      break
    // case STRING.bankOwnerName:
    //     regrex = /[\w]{2,}( [\w]{2,})+/i
    //     break;
    case STRING.weight:
      regrex = /^(0|[1-9]\d*)(.\d+)?$/g
      break
    case STRING.startWeight:
      regrex = /^(0|[1-9]\d*)(.\d+)?$/g
      break
    case STRING.endWeight:
      regrex = /^(0|[1-9]\d*)(.\d+)?$/g
      break
    case STRING.stepWeight:
      regrex = /^(0|[1-9]\d*)(.\d+)?$/g
      break
    case STRING.blockNormal:
      regrex = /^(0|[1-9]\d*)(,\d+)?$/g
      break
    case STRING.blockFast:
      regrex = /^(0|[1-9]\d*)(,\d+)?$/g
      break
    case STRING.minFee:
      regrex = /^(0|[1-9]\d*)(,\d+)?$/g
      break
    case STRING.minFeeFast:
      regrex = /^(0|[1-9]\d*)(,\d+)?$/g
      break
    case STRING.volume:
      regrex = /^(0|[1-9]\d*)(,\d+)?$/g
      break
    case STRING.affordableTransport:
      regrex = /^(0|[1-9]\d*)(,\d+)?$/g
      break
    case STRING.affordableVolume:
      regrex = /^(0|[1-9]\d*)(,\d+)?$/g
      break
    case STRING.licensePlate:
      regrex = /[0-9A-Z_]{5,}/g
      break
    case STRING.dob:
      regrex = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/g
      break
    case STRING.identityCard:
      regrex = /^[0-9]{9}$|^[0-9]{12}$/g
      break
    case (STRING.estimateTime, STRING.amount):
      regrex = /^(?:[0-9]*)$/g
      break
    case STRING.collect:
      regrex = /^(?:[0-9]*)$/g
      break
    case (STRING.packRatio, STRING.maxWeight, STRING.amount):
      regrex = /^(?:[0-9.]*)$/g
      break
    case STRING.ratio:
      regrex = /^(?:[0-9.]*)$/g
      break
    case STRING.length:
      regrex = /^(?:[0-9.]*)$/g
      break
    case STRING.start_time:
      regrex = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/g
      break
    case STRING.end_time:
      regrex = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/g
      break
    case STRING.money:
      regrex = /^(?!0\.00)\d{1,3}(,\d{3})*(\.\d\d)?$/gm
      break
    case STRING.clientName:
      regrex = /[0-9a-zA-Z_]{4,}\S/g
      break
    case STRING.receiverName:
      regrex = /^(?=.{1,30}$).*/g
      break
    case STRING.receiverPhone:
      regrex = /((09|03|07|08|05|02|06)+([0-9]{8})\b)/g
      break
    default:
      break
  }
  test(self, regrex, value, fieldName)
}
