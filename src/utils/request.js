import Taro from '@tarojs/taro';
import { baseUrl, noConsole } from '../config';

const request_data = {

};

export default (options = { method: 'GET', data: {} }) => {
  const token = Taro.getStorageSync('token')
  let Authorization = {}
  if (!noConsole) {
    console.log(
      `${new Date().toLocaleString()}【 M=${options.url} 】P=${JSON.stringify(
        options.data
      )}`
    );
  }
  if( options.url !== '/api/v1/user/login' && options.url !== '/api/v1/user/register'){
    Authorization = {'Authorization': `Bearer ${token}`}
  }
  return Taro.request({
    url: baseUrl + options.url,
    data: {
      ...request_data,
      ...options.data,
    },
    mode: 'cors',
    header: {
      ...Authorization,
      'Content-Type': 'application/json',
      ...options.header
    },
    method: options.method.toUpperCase(),

  }).then(res => {
    const { statusCode, data } = res;
    if (statusCode >= 200 && statusCode < 300) {
      if (!noConsole) {
        console.log(
          `${new Date().toLocaleString()}【 M=${options.url} 】【接口响应：】`,
          res.data
        );
      }
      if (data.code == 'unlogin') {
        setTimeout(()=>{
          Taro.redirectTo({url: '/pages/login/login'})
        }, 1000)
      }
      if (data.code !== 'ok') {
        Taro.showToast({
          title: `${res.data.message}~` || res.data.error.code,
          icon: 'none',
          mask: true,
        });
      }
      return data;
    } else {
      throw new Error(`网络请求错误，状态码${statusCode}`);
    }
  });
};
