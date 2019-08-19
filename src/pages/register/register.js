import Taro, { Component } from '@tarojs/taro'
import { View, Image, Picker } from '@tarojs/components'
import { AtCard, AtButton, AtInput, AtTextarea, AtImagePicker } from 'taro-ui'
import Request from '../../utils/request';
import Tools from '../../utils/tools'
import logoPng from '../../images/lanyu.png'
import './register.scss'

class Register extends Component{
  config = {
    navigationBarTitleText: '注册',
  };

  constructor() {
    super(...arguments);
    this.state = {
      username: '',
      passwd: '',
      repasswd: '',
      nickname: '',
      genderSelector: ['男', '女', '保密'],
      gender: '保密',
      bio: '',
      avatar: [],
      avatar_url: ''
    }
  }

  componentDidMount(){

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

  handleRePasswdChange = (repasswd) => {
    this.setState({
      repasswd
    })
  }

  handleNicknameChange = (nickname) => {
    this.setState({
      nickname
    })
  }

  handleGenderChange = e => {
    this.setState({
      gender: this.state.genderSelector[e.detail.value]
    })
  }

  handleBioChange = e =>{
    this.setState({
      bio: e.target.value
    })
  }


  handleAvatarChange = (files) =>{
    this.setState({
      avatar: files
    })
    if(files.length){
      Tools.imgUpload(files[0].url, files[0].file.type, (data)=>{
        this.setState({
          avatar_url: data.data.img_url
        })
      })
    }
  }

  onRegister = () => {
    let { username, passwd, repasswd, nickname, gender, bio, avatar_url } = this.state
    if(passwd !== repasswd){
      Taro.showToast({
        title: '两次密码输入不一致',
        icon: 'none',
        mask: true
      })
      return;
    }
    Request({
      url: '/api/v1/user/register',
      method: 'POST',
      data: {
        account: username,
        passwd,
        nickname,
        gender,
        avatar: avatar_url,
        bio
      }
    })
    .then(res => {
      if(res.data){
        Taro.showToast({
          title: '注册成功',
          icon: 'none',
          mask: true
        }).then(()=>{
          setTimeout(()=>{
            Taro.redirectTo({url: '/pages/login/login'})
          }, 1500)
        })
      }
    })
  }


  render() {
    let { username, passwd, repasswd, nickname, gender, bio, avatar } = this.state
    return (
      <View className='at-col register-page'>
        <Image className='at-row at-col-4 page-logo' src={logoPng}>
        </Image>
        <AtCard className='register-box' title='注册'>
          <AtInput name='username' title='用户名' type='text' placeholder='用户名必须以大写开头' value={username} onChange={this.handleUsernameChange} />
          <AtInput name='password' title='密码' type='password' placeholder='密码不少于6位' value={passwd} onChange={this.handlePasswdChange} />
          <AtInput name='repassword' title='确认密码' type='password' placeholder='请再次输入密码' value={repasswd} onChange={this.handleRePasswdChange} />
          <AtInput name='nickname' title='昵称' type='text' placeholder='输入昵称' value={nickname} onChange={this.handleNicknameChange} />
          <View className='form-item'>
            <View className='form-item-label'>头像 </View>
            <AtImagePicker files={avatar} onChange={this.handleAvatarChange} showAddBtn={avatar.length<1}></AtImagePicker>
          </View>
          <View className='form-item'>
            <View className='form-item-label'>性别 </View>
            <Picker className='picker-content' mode='selector' range={this.state.genderSelector} onChange={this.handleGenderChange} >
              {gender}
            </Picker>
          </View>
          <View className='form-item'>
            <View className='form-item-label'>个性签名 </View>
            <AtTextarea value={bio} onChange={this.handleBioChange} maxlength={40} placeholder='请输入个性签名...' />
          </View>
          <AtButton className='register-btn' type='primary' onClick={this.onRegister}>注册</AtButton>
        </AtCard>
      </View>
    )
  }
}

export default Register
