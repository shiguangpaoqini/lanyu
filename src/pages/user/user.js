import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtAvatar, AtGrid } from 'taro-ui'

import './user.scss'
import aboutPng from '../../images/options/关于我们.png'
import logoutPng from '../../images/options/注销.png'
import userInfoPng from '../../images/options/个人资料.png'
import createBookReviewPng from '../../images/options/发表书评.png'
import userOrdersPng from '../../images/options/我的订阅.png'

// if (process.env.TARO_ENV === "weapp") {
//   require("taro-ui/dist/weapp/css/index.css")
// } else if (process.env.TARO_ENV === "h5") {
//   require("taro-ui/dist/h5/css/index.css")
// }

class User extends Component {
  config = {
    navigationBarTitleText: '我的',
  };

  constructor() {
    super(...arguments);
    this.operations = [
      {
        image: createBookReviewPng,
        value: '发表书评',
        url: '/pages/bookRev/create'
      },
      {
        image: userOrdersPng,
        value: '我的订阅',
        url: '/pages/myOrder/myOrder'
      },
      {
        image: userInfoPng,
        value: '个人资料',
        url: '/pages/userInfo/userInfo'
      },
      {
        image: logoutPng,
        value: '注销',
        url: '/pages/login/login'
      },
      {
        image: aboutPng,
        value: '关于我们',
        url: '/pages/about/about'
      }]
    this.state = {
      userAvarar: 'http://149.248.10.63/assets/blogImg/avatar.png',
      username: 'dcry',
      userGender: '男',
      userBio: 'woshimiaoshu',
      bgClass: 'bg-light'
    }
  }

  componentWillMount() {
    this.setBgClass()
  }

  componentDidMount() {
    const userInfo = Taro.getStorageSync('user_info')
    this.setState({
      userAvarar: userInfo.avatar,
      username: userInfo.nickname,
      userGender: userInfo.gender,
      userBio: userInfo.bio,
    })
  }

  optionsClick = (item, index) => {
    if (index == 3) {
      Taro.navigateTo({ url: item.url }).then(() => {
        Taro.removeStorageSync('token')
        Taro.removeStorageSync('user_info');
      })
    } else {
      Taro.navigateTo({ url: item.url })
    }
  }

  setBgClass(){
    const nowHours = new Date().getHours()
    if(nowHours>20 || nowHours<8){
      this.setState({
        bgClass: 'bg-dark'
      })
    }
  }

  render() {
    let { userAvarar, username, userGender, userBio, bgClass } = this.state
    userGender = userGender === '男' ? '0px' : '-25px'
    return (
      <View className='at-col user-page at-col__justify--between'>
        <View className={'user-info-page-top-bg ' + bgClass}>
        </View>
        <View className='user-info-page-top'>
          <AtAvatar className='' circle image={userAvarar} size='large'></AtAvatar>
          <Text className='user-name'>{username}
            <View className='user-info-gender' style={{backgroundPositionY: userGender}}>
            </View>
          </Text>
          <Text className='user-bio'>{userBio}</Text>
        </View>
        <View className='at-col user-operations'>
          <AtGrid className='' data={this.operations} onClick={this.optionsClick} >
          </AtGrid>
        </View>
      </View>
    )
  }
}

export default User
