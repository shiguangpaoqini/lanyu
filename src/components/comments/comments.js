import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtButton, AtAvatar } from 'taro-ui'
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
import Tools from '../../utils/tools'
import './comments.scss'

dayjs.extend(relativeTime)

export default class Feed extends Component {
  constructor (props) {
    super(props)
    this.state = {

    }
  }

  componentDidMount(){

  }

  render() {
    const { data , articleAuthor } = this.props
    return (
      <View className='comments-list'>
        {data.map((item, i)=>{
          return (
            <View className='comments-item' key={i}>
              <AtAvatar circle image={item.author.avatar} className='comments-item-avatar'></AtAvatar>
              <View className='comments-item-right'>
                <View className='comments-item-nickname'>
                  {articleAuthor == item.author._id ? item.author.nickname+'(作者)' :item.author.nickname}
                  <View className='comment-item-time'>
                    {dayjs(item.createAt).fromNow()}
                  </View>
                </View>
                <View className='comments-item-content'>
                  {item.content}
                </View>
              </View>
            </View>
          )
        })}
      </View>
    )
  }
}
