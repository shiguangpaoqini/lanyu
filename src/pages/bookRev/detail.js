import Taro, { Component } from '@tarojs/taro'
import { View, RichText } from '@tarojs/components'
import { AtButton, AtTextarea, AtAvatar, AtIcon } from 'taro-ui'
import Comments from '../../components/comments/comments'
import dayjs from 'dayjs'
import Request from '../../utils/request';
import './detail.scss'

class Detail extends Component{
  config = {
    navigationBarTitleText: '文章',
  };

  constructor() {
    super(...arguments);
    this.userId = Taro.getStorageSync('user_info').user_id
    this.articleId = this.$router.params.id
    this.state = {
      author: {},
      title: '',
      html: '',
      likeUsers: [],
      isAlreadyLike: false,
      bookName: '',
      readingQuantity: '',
      createAt: '',
      isAlreadyOrder: false,
      myComment: '',
      comments: []
  }
}

  componentWillMount(){
    this.getArticleDetail()
    this.getComments()
  }

  isAlreadyOrder(author){
    Request({
      url: '/api/v1/user/isorder',
      method: 'POST',
      data: {
        userId: this.userId,
        orderUserId: author
      }
    }).then(res => {
      this.setState({
        isAlreadyOrder: res.data
      })
    })
  }

  isMyArticle(){
    return this.state.author._id === this.userId
  }

  orderUser = () => {
    const author = this.state.author
    Request({
      url: '/api/v1/user/order',
      method: 'POST',
      data: {
        userId: this.userId,
        orderUserId: author._id
      }
    }).then(res => {
      if(res.code = 'ok'){
        this.setState({
          isAlreadyOrder: true
        })
      }
    })
  }

  editArticle = ()=>{
    Taro.navigateTo({url: `/pages/bookRev/edit?id=${this.articleId}`})
  }

  handleCommentChange = (e) =>{
    this.setState({
      myComment: e.target.value
    })
  }

  postComment = ()=>{
    Request({
      url: '/api/v1/comment/create',
      method: 'POST',
      data: {
        author: this.userId,
        articleId: this.articleId,
        content: this.state.myComment
      }
    }).then(res => {
      if(res.data){
        this.getComments()
      }
    })
  }

  getArticleDetail= ()=>{
    Request({
      url: '/api/v1/article/detail',
      method: 'GET',
      data: {
        id: this.articleId
      }
    }).then(res => {
      res.data.createAt = dayjs(res.data.createAt).format('YYYY年MM月DD日')
      this.setState(res.data)
      this.isAlreadyOrder(res.data.author._id)
      if(res.data.likeUsers.includes(this.userId)){
        this.setState({isAlreadyLike: true})
      }
    })
  }

  getComments = ()=>{
    Request({
      url: '/api/v1/comment/comments',
      method: 'GET',
      data: {
        articleId: this.articleId
      }
    }).then(res => {
      this.setState({
        comments: res.data
      })
    })
  }

  onLike= () =>{
    Request({
      url: '/api/v1/article/like',
      method: 'POST',
      data: {
        articleId: this.articleId,
        userId: this.userId
      }
    }).then(res => {
      console.log(res)
    })
    this.setState({
      isAlreadyLike: !this.state.isAlreadyLike
    })
  }

  onUnLike= () =>{
    Request({
      url: '/api/v1/article/unlike',
      method: 'POST',
      data: {
        articleId: this.articleId,
        userId: this.userId
      }
    }).then(res => {
      console.log(res)
    })
    this.setState({
      isAlreadyLike: !this.state.isAlreadyLike
    })
  }

  render() {
    const { createAt, readingQuantity, title, bookName, html, author, isAlreadyOrder, isAlreadyLike, myComment, comments} = this.state
    return (
      <View className='book-rev-detail'>
        <View className='at-row at-col__justify--between author-info'>
          <AtAvatar circle image={author.avatar}></AtAvatar>
          <View className='author-info-center'>
            <View className='author-nickname'>{author.nickname}</View>
            <View className='author-book-rev-info'>
              <View>{createAt} 阅读 {readingQuantity}</View>
            </View>
          </View>
          {!this.isMyArticle()?
          isAlreadyOrder ?
             <AtButton disabled className='order-btn'>已订阅</AtButton>
             : <AtButton className='order-btn' onClick={this.orderUser}>订阅</AtButton>
          : <AtButton className='edit-btn' onClick={this.editArticle}>编辑</AtButton>}
        </View>
        <View>
          <View className='title'>
            {title}
            <View className='book-name'>
              《{bookName}》
              {
                isAlreadyLike ? <AtIcon value='heart-2' size='28' color='#ee4145' className='like-btn' onClick={this.onUnLike}></AtIcon>
                : <AtIcon value='heart' size='28' color='#6cbd45' className='like-btn' onClick={this.onLike}></AtIcon>
              }
            </View>
          </View>
          <RichText className='content' nodes={html}>
          </RichText>
        </View>
        <View className='book-rev-comment'>
            <View className='comment-title'>评论</View>
            <Comments data={comments} articleAuthor={author._id}></Comments>
            <AtTextarea className='comment-textarea' value={myComment} placeholder='请输入评论...' height={100}
              maxLength={150} onChange={this.handleCommentChange}></AtTextarea>
            <AtButton className='comment-btn' type='primary' onClick={this.postComment}>发布评论</AtButton>
        </View>
      </View>
    )
  }
}

export default Detail
