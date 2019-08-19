import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtCard, AtButton, AtInput } from 'taro-ui'
import Request from '../../utils/request';

import logoPng from '../../images/lanyu.png'
import './login.scss'

class Login extends Component{
  config = {
    navigationBarTitleText: '登录',
  };

  constructor() {
    super(...arguments);
    this.state = {
      username: '',
      passwd: ''
    }
  }

  handleUsernameChange = (username) => {
    this.setState({
      username
    })
  }

  handlePasswdChange =  (passwd) => {
    this.setState({
      passwd
    })
  }

  onLogin = () => {
    const { username, passwd } = this.state
    Request({
      url: '/api/v1/user/login',
      method: 'POST',
      data: {
        account: username,
        passwd
      }
    })
    .then(res => {
      if(res.data){
        const userInfo = {
          token: res.data.token,
          avatar: res.data.avatar,
          gender: res.data.gender,
          nickname: res.data.nickname,
          user_id: res.data.id,
          bio: res.data.bio,
          account: res.data.account,
          last_login_at: res.data.lastLoginAt,
          create_at: res.data.createAt
        };
        Taro.setStorageSync('token', res.data.token)
        Taro.setStorageSync('user_info', userInfo);
        Taro.showToast({
          title: '登录成功',
          icon: 'none',
          mask: true,
        }).then(()=>{
          Taro.redirectTo({url: '/pages/index/index'})
        })
      }
    })
  }

  toRegister = () =>{
    Taro.navigateTo({url: '/pages/register/register'})
  }

  render() {
    let { username, passwd } = this.state
    return (
      <View className='at-col login-page'>
        <Image className='at-row at-col-4 page-logo' src={logoPng}>
        </Image>
        <AtCard className='login-box' title='登录'>
          <AtInput name='username' title='用户名' type='text' placeholder='请输入用户名' value={username} onChange={this.handleUsernameChange}></AtInput>
          <AtInput name='password' title='密码' type='password' placeholder='请输入密码' value={passwd} onChange={this.handlePasswdChange}></AtInput>
          <View className='to-register' onClick={this.toRegister}>还没有账户？点击我注册</View>
          <AtButton className='login-btn' type='primary' onClick={this.onLogin}>登录</AtButton>
        </AtCard>
      </View>
    )
  }
}

export default Login
