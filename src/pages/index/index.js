import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtTabs, AtTabsPane, AtLoadMore } from 'taro-ui'
import Feed from '../../components/feed/feed'
import Request from '../../utils/request';

import './index.scss'

class Index extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      current: 0,
      nextPage: 0,
      status: 'more',
      feedAll: [],
      feedHot: [],
      feedOrder: []
    }
  }
  config = {
    navigationBarTitleText: '首页'
  }

  componentDidMount() {
    this.fetchFeedOrderData()
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  fetchFeedAllData = () => {
    const { feedAll, nextPage } = this.state
    this.setState({
      status: 'loading'
    })
    Request({
      url: '/api/v1/article/feedAll',
      method: 'GET',
      data: {
        page: nextPage
      }
    }).then(res => {
      if (res.data.length) {
        this.setState({
          feedAll: [...feedAll, ...res.data],
          nextPage: res.next_page,
          status: 'more'
        })
      } else {
        this.setState({
          status: 'noMore'
        })
      }

    })
  }

  fetchFeedHotData = () => {
    const { feedHot, nextPage } = this.state
    this.setState({
      status: 'loading'
    })
    Request({
      url: '/api/v1/article/feedHot',
      method: 'GET',
      data: {
        page: nextPage
      }
    }).then(res => {
      if (res.data.length) {
        this.setState({
          feedHot: [...feedHot, ...res.data],
          nextPage: res.next_page,
          status: 'more'
        })
      } else {
        this.setState({
          status: 'noMore'
        })
      }
    })
  }

  fetchFeedOrderData = () => {
    const { feedOrder, nextPage } = this.state
    const userId = Taro.getStorageSync('user_info').user_id
    this.setState({
      status: 'loading'
    })
    Request({
      url: '/api/v1/article/feedOrder',
      method: 'GET',
      data: {
        page: nextPage,
        userId
      }
    }).then(res => {
      if (res.data.length) {
        this.setState({
          feedOrder: [...feedOrder, ...res.data],
          nextPage: res.next_page,
          status: 'more'
        })
      } else {
        this.setState({
          status: 'noMore'
        })
      }
    })
  }

  handleClick = (value) => {
    this.setState({
      current: value,
      nextPage: 0,
      status: 'more',
      feedAll: [],
      feedHot: [],
      feedOrder: []
    }, () => {
      if (value == 0) {
        this.fetchFeedOrderData()
      } else if (value == 1) {
        this.fetchFeedHotData()
      } else if (value == 2){
        this.fetchFeedAllData()
      }
    })
  }

  render() {
    const { status, feedAll, feedHot, feedOrder } = this.state
    const tabList = [{ title: '我的订阅' }, { title: '热门文章' }, { title: '最新内容' }]
    return (
      <View className='index'>
        <AtTabs tabList={tabList} current={this.state.current} onClick={this.handleClick}>
          <AtTabsPane current={this.state.current} index={0} >
            {!feedOrder.length ? <View className='no-data'>暂无数据</View> :
              <View>
                <Feed type={this.state.current} data={feedOrder}></Feed>
                <AtLoadMore onClick={this.fetchFeedOrderData} status={status} moreBtnStyle='border:none;color: #444;' />
              </View>
            }
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={1} >
            {!feedHot.length ? <View className='no-data'>暂无数据</View> :
              <View>
                <Feed type={this.state.current} data={feedHot}></Feed>
                <AtLoadMore onClick={this.fetchFeedHotData} status={status} moreBtnStyle='border:none;color: #444;' />
              </View>
            }
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={2} >
            {!feedAll.length ? <View className='no-data'>暂无数据</View> :
              <View>
                <Feed type={this.state.current} data={feedAll}></Feed>
                <AtLoadMore onClick={this.fetchFeedAllData} status={status} moreBtnStyle='border:none;color: #444;' />
              </View>
            }
          </AtTabsPane>
        </AtTabs>
      </View>
    )
  }
}

export default Index
