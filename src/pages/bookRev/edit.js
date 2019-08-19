import Taro, { Component } from '@tarojs/taro'
import { View, Image, RichText } from '@tarojs/components'
import { AtButton, AtInput, AtTextarea, AtImagePicker } from 'taro-ui'
import Request from '../../utils/request';
import Tools from '../../utils/tools'
import './edit.scss'

class Edit extends Component{
  config = {
    navigationBarTitleText: '编辑',
  };

  constructor() {
    super(...arguments);
    this.userId = Taro.getStorageSync('user_info').user_id
    this.articleId = this.$router.params.id
    this.state = {
      title: '',
      bookName: '',
      bookRev: '',
      cover: [],
      cover_url: ''
  }
}

  componentWillMount(){
    this.getArticleDetail()
  }

  getArticleDetail= ()=>{
    Request({
      url: '/api/v1/article/detail',
      method: 'GET',
      data: {
        id: this.articleId
      }
    }).then(res => {
      const coverImg = [{
        url: res.data.cover
      }]
      this.setState({
        bookName: res.data.bookName,
        title: res.data.title,
        bookRev: res.data.content,
        cover: coverImg,
        cover_url: res.data.cover
      })
    })
  }

  handleTitleChange = (title) => {
    this.setState({
      title
    })
  }

  handlebookNameChange = (bookName) => {
    this.setState({
      bookName
    })
  }

  handleCoverChange = (files) =>{
    this.setState({
      cover: files
    })
    if(files.length){
      Tools.imgUpload(files[0].url, files[0].file.type || '', (data)=>{
        this.setState({
          cover_url: data.data.img_url
        })
      })
    }
  }

  handleBookRevChange = e => {
    this.setState({
      bookRev: e.target.value
    })
  }

  onEdit = () =>{
    const { cover_url, bookName, bookRev, title} = this.state
    Request({
      url: '/api/v1/article/edit',
      method: 'PUT',
      data: {
        id: this.articleId,
        userId: this.userId,
        content: bookRev,
        cover: cover_url,
        title,
        bookName
      }
    }).then(res => {
      if(res.data){
        setTimeout(()=>{
          Taro.redirectTo({url: `/pages/bookRev/detail?id=${this.articleId}`})
        }, 1500)
      }
    })
    console.log(this.state.cover_url)
  }

  render() {
    const { title, bookName, cover, bookRev} = this.state
    return (
      <View>
        <AtInput title='标题' placeholder='请输入标题' value={title} onChange={this.handleTitleChange} ></AtInput>
        <AtInput title='书名' placeholder='请输入书籍名称' value={bookName} onChange={this.handlebookNameChange} ></AtInput>
        <View className='form-item'>
            <View className='form-item-label'>图片 </View>
            <AtImagePicker className='img-picker' files={cover} onChange={this.handleCoverChange} showAddBtn={cover.length<1}></AtImagePicker>
          </View>
        <View className='form-book-review'>
          <View className='form-book-review-label'>书评（支持markdown格式） </View>
          <AtTextarea className='bookrev-content' value={bookRev} placeholder='请输入你的读书感受吧...' height={400} maxLength={1000} onChange={this.handleBookRevChange}> </AtTextarea>
        </View>
        <AtButton className='edit-btn' type='primary' onClick={this.onEdit}>修改</AtButton>
      </View>
    )
  }
}

export default Edit
