import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtAvatar, AtList, AtListItem } from 'taro-ui'
import dayjs from 'dayjs'
import './userInfo.scss'

class UserInfo extends Component {
  config = {
    navigationBarTitleText: '个人资料',
  };

  constructor() {
    super(...arguments);
    this.user_info = Taro.getStorageSync('user_info')
    this.state = {
      bgClass: 'bg-light'
    }
  }

  componentWillMount(){
    this.setBgClass()
  }

  componentDidMount() {
    console.log(this.user_info)
    this.setState(this.user_info)
  }

  setBgClass(){
    const nowHours = new Date().getHours()
    if(nowHours>20 || nowHours<8){
      this.setState({
        bgClass: 'bg-dark'
      })
    }
  }

  editUserInfo = () => {
    Taro.navigateTo({url: '/pages/userInfoEdit/userInfoEdit'})
  }

  render() {
    let { avatar, nickname, account, gender, bio, create_at, bgClass } = this.state
    return (
      <View className='user-info-page'>
        <View className={'user-info-page-top-bg ' + bgClass}>
        </View>
        <View className='user-info-page-top'>
          <AtAvatar className='' circle image={avatar} size='large'></AtAvatar>
          <Text className='user-name'>{nickname}</Text>
          <Text className='user-bio'>{bio}</Text>
        </View>
        <AtList className='user-info-list'>
          <AtListItem className='list-title' onClick={this.editUserInfo} title='基本资料' arrow='right' />
          <AtListItem title='账号' extraText={account} />
          <AtListItem title='昵称' extraText={nickname} />
          <AtListItem title='性别' extraText={gender} />
          <AtListItem title='简介' extraText={bio} />
          <AtListItem title='注册时间' extraText={dayjs(create_at).format('YYYY年MM月DD日')} />
        </AtList>
      </View>
    )
  }
}

export default UserInfo
