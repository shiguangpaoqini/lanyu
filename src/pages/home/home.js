import Taro, { Component } from '@tarojs/taro'
import { View} from '@tarojs/components'
import { AtLoadMore } from 'taro-ui'
import Feed from '../../components/feed/feed'
import Request from '../../utils/request';

import './home.scss'


class Home extends Component{
  constructor(){
    super(...arguments)
    this.state = {
      status: 'more',
      feed: [],
      nextPage: 0
    }
  }
    config = {
    navigationBarTitleText: '我的'
  }

  componentDidMount() {
    this.fetchMyFeedData()
  }

  fetchMyFeedData =  (page) =>{
    const userId = Taro.getStorageSync('user_info').user_id
    const { nextPage } = this.state
    this.setState({
      status: 'loading'
    })
    Request({
      url: '/api/v1/article/feed',
      method: 'GET',
      data: {
        page: page || nextPage,
        userId
      }
    }).then(res => {
      if(res.data.length){
        this.setState({
          feed: res.data,
          nextPage: res.next_page,
          status: 'more'
        })
      } else{
        this.setState({
          status: 'noMore'
        })
      }
    })
  }

  render() {
    return (
      <View>
        {!this.state.feed.length? <View className='no-data'>你还没有发表过书评</View> :
        <View>
          <Feed data={this.state.feed} updateData={this.fetchMyFeedData}></Feed>
          <AtLoadMore onClick={this.fetchMyFeedData}
            status={this.state.status} moreBtnStyle='border:none;color: #444;'/>
        </View>
      }
      </View>
    )
  }
}

export default Home
