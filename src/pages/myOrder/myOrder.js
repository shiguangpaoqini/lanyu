import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtSwipeAction, AtList, AtListItem } from 'taro-ui'
import Request from '../../utils/request';
import './myOrder.scss'

class MyOrder extends Component{
  config = {
    navigationBarTitleText: '我的订阅',
  };
  constructor(){
    super(...arguments)
    this.state = {
      list: [],
      options: [{
        text: '取消订阅',
        style: {
          backgroundColor: '#FF4949'
        }
      }],
      isOpened: false,
    }
  }

  componentWillMount(){
    this.fetchMyOrders()
  }

  componentDidMount(){

  }

  fetchMyOrders(){
    const { options, isOpened } = this.state
    const userId = Taro.getStorageSync('user_info').user_id
    Request({
      url: '/api/v1/user/myOrder',
      method: 'GET',
      data: {
        userId
      }
    }).then(res=>{
      let newList = res.data.map(i=>{
        i.options = options
        i.isOpened = isOpened
        return i
      })
      this.setState({
        list: newList
      })
    })
  }

  handleSingle = (i) =>{
    const _list = this.state.list
    console.log(i)
    _list.map((item)=>{
      item.isOpened = false
    })
    this.setState({
      list: _list
    })
  }

  cancleOrder = (index) => {
    const { list } = this.state
    console.log('取消订阅', index)
    this.fetchCancleOrder(list[index]._id, index)
  }

  fetchCancleOrder(cancleUserId, index){
    const userId = Taro.getStorageSync('user_info').user_id
    Request({
      url: '/api/v1/user/cancleOrder',
      method: 'POST',
      data: {
        userId,
        cancleUserId
      }
    }).then(res =>{
      let newList = this.state.list
      newList.splice(index, 1)
      console.log(newList)
      if(res.data){
        this.setState({
          list: newList
        })
      }
      Taro.showToast({
        title: `取消成功~`,
        icon: 'none',
        mask: true,
      });
    })
  }

  render(){
    const { list } = this.state
    return (
      <View>
        {!list.length? <View className='no-data'>你还没有订阅任何人</View> :''}
        <AtList>
          {list.map((item, index) => (
            <AtSwipeAction
              key={index}
              autoClose
              onOpened={this.handleSingle.bind(this, index)}
              isOpened={item.isOpened}
              options={item.options}
              onClick={this.cancleOrder.bind(this, index)}
            >
              <AtListItem title={item.nickname} thumb={item.avatar}
                note={item.gender} onClick={this.handleSingle.bind(this, index)} />
            </AtSwipeAction>
          ))}
        </AtList>
      </View>
    )
  }
}

export default MyOrder
