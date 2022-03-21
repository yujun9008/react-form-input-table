import moment from 'moment';

//对象value中moment类型转数字
export const transformMomentToNumber = (param: {}) => {
  Object.keys(param).forEach(key => {
    if (moment.isMoment(param[key])) {
      param[key] = +param[key]
    }
  })
  return param;
}
