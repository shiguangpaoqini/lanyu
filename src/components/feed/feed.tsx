import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtIcon, AtModal } from 'taro-ui';
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
import Request from '../../utils/request';
import Tools from '../../utils/tools'
import './feed.scss'

dayjs.extend(relativeTime)

export default class Feed extends Component<{},{}> {
  userId: string;
  articleId: string;
  constructor (props) {
    super(props)
    this.userId = Taro.getStorageSync('user_info').user_id
    this.state = {
      isOpened: false
    }
  }

  componentDidMount(){

  }

  goDetail = (id) => {
    console.log(id)
    Taro.navigateTo({url: `/pages/bookRev/detail?id=${id}`})
  }

  onTrash = (articleId, e) =>{
    e.cancelBubble = true;
    this.articleId = articleId
    this.setState({isOpened: true})
  }

  fetchDeleteArticle(){
    Request({
      url: '/api/v1/article/delete',
      method: 'POST',
      data: {
        userId: this.userId,
        articleId: this.articleId
      }
    }).then(res => {
      if(res.data){
        Taro.showToast({
          title: `删除成功~`,
          icon: 'none',
          mask: true,
        });
      }
    })
  }

  modalClose = () => {
    this.setState({isOpened: false})
  }

  modalCancel = () => {
    this.setState({isOpened: false})
  }

  modalConfirm = (updateData) => {
    this.setState({isOpened: false})
    this.fetchDeleteArticle()
    updateData('0')
  }

  render() {
    const { isOpened } = this.state
    const { data, updateData } = this.props
    return (
      <View className='article-feed'>
        {data.map((item, i)=> {
          return (
            <View className='feed-item' key={i} onClick={()=>{this.goDetail(item._id)}}>
              <View className='item-title'>
                {item.title}
                <View className='item-bookname'>
                  《{item.bookName}》
                </View>
              </View>
              <View className='item-content'>
                <View className='article-excerpt'>
                  {Tools.cut(item.content.replace(/\s*/g,""), 100)}
                </View>
                <Image src={item.cover} className='cover-img' />
              </View>
              <View className='item-meta'>
                赞 {item.likeUsers.length}
                <View className='dot'>·</View>
                阅读 {item.readingQuantity}
                <View className='space'></View>
                {item.author.nickname}
                <View className='dot'>·</View>
                {dayjs(item.createAt).fromNow()}
                {this.userId == item.author._id ?
                  <AtIcon className='trash-icon' value='trash' size='20' color='#da303a' onClick={this.onTrash.bind(this, item._id)}></AtIcon>: ''}
              </View>
            </View>
          )
        })}
        <AtModal isOpened={isOpened} cancelText='取消' confirmText='确认'
          onClose={this.modalClose} onCancel={this.modalCancel} onConfirm={this.modalConfirm.bind(this, updateData)}
          content='确定要删除这篇文章吗？'>
        </AtModal>
      </View>
    )
  }
}
