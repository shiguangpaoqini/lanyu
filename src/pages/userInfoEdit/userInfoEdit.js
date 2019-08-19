import Taro, { Component } from '@tarojs/taro'
import { View, Image, Picker } from '@tarojs/components'
import { AtCard, AtButton, AtInput, AtTextarea, AtImagePicker } from 'taro-ui'
import Request from '../../utils/request';
import Tools from '../../utils/tools'
import './userInfoEdit.scss'

class UserInfoEdit extends Component{
  config = {
    navigationBarTitleText: '用户信息修改',
  };

  constructor() {
    super(...arguments);
    this.userInfo = Taro.getStorageSync('user_info')
    this.state = {
      nickname: '',
      genderSelector: ['男', '女', '保密'],
      gender: '保密',
      bio: '',
      avatar: [],
      avatar_url: ''
    }
  }

  componentWillMount(){
    this.setState({
      ...this.userInfo,
      avatar_url: this.userInfo.avatar,
      avatar: [{
        url: this.userInfo.avatar
      }]
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

  onEdit = () => {
    let { nickname, gender, bio, avatar_url } = this.state
    Request({
      url: '/api/v1/user/edit',
      method: 'POST',
      data: {
        userId: this.userInfo.user_id,
        nickname,
        gender,
        avatar: avatar_url,
        bio
      }
    })
    .then(res => {
      if(res.data){
        Taro.setStorageSync('user_info', {...res.data, user_id: res.data._id});
        Taro.showToast({
          title: '修改成功',
          icon: 'none',
          mask: true
        }).then(()=>{
          setTimeout(()=>{
            Taro.redirectTo({url: '/pages/userInfo/userInfo'})
          }, 1500)
        })
      }
    })
  }


  render() {
    let { nickname, gender, bio, avatar } = this.state
    return (
      <View className='at-col register-page'>
        <AtCard className='register-box' title='个人信息修改'>
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
          <AtButton className='register-btn' type='primary' onClick={this.onEdit}>修改</AtButton>
        </AtCard>
      </View>
    )
  }
}

export default UserInfoEdit
