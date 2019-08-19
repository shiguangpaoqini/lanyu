import '@tarojs/async-await'
import Taro, { Component, Config } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import Index from './pages/index/index'

import configStore from './store'

import './app.scss'
import { AtTabBar } from 'taro-ui';

const store = configStore()

dayjs.locale('zh-cn')

class App extends Component {

  config: Config = {
    pages: [
      'pages/index/index',
      'pages/home/home',
      'pages/user/user',
      'pages/login/login',
      'pages/register/register',
      'pages/bookRev/create',
      'pages/bookRev/edit',
      'pages/bookRev/detail',
      'pages/userInfo/userInfo',
      'pages/myOrder/myOrder',
      'pages/about/about',
      'pages/userInfoEdit/userInfoEdit'
    ],
    tabBar: {
      custom: true,
      list: [{
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: './images/tab/home.png',
        selectedIconPath: './images/tab/home-active.png'
      },
      {
        pagePath: 'pages/home/home',
        text: '我的书评',
        iconPath: './images/tab/bookReview.png',
        selectedIconPath: './images/tab/bookReview-active.png'
      },
      {
        pagePath: 'pages/user/user',
        text: '我的',
        iconPath: './images/tab/user.png',
        selectedIconPath: './images/tab/user-active.png'
      }],
    color: '#333',
    selectedColor: '#333',
    backgroundColor: '#fff',
    borderStyle: 'black'
  },
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    }
  }

  componentDidMount () {

  }

  componentDidShow () {}

  componentDidHide () {}

  componentCatchError () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
