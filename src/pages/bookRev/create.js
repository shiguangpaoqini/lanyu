import Taro, { Component } from '@tarojs/taro'
import { View, Image, RichText } from '@tarojs/components'
import { AtButton, AtInput, AtTextarea, AtImagePicker } from 'taro-ui'
import Request from '../../utils/request';
import Tools from '../../utils/tools'

import './create.scss'

class Create extends Component{
  config = {
    navigationBarTitleText: '创建',
  };

  constructor() {
    super(...arguments);
    this.state = {
      title: '',
      bookName: '',
      bookRev: '',
      cover: [],
      cover_url: ''
  }
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
      Tools.imgUpload(files[0].url, files[0].file.type, (data)=>{
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

  onCreate = () =>{
    const userId = Taro.getStorageSync('user_info').user_id
    const { title, bookName, cover_url, bookRev } = this.state
    Request({
      url: '/api/v1/article/create',
      method: 'POST',
      data: {
        title,
        bookName,
        cover: cover_url,
        content: bookRev,
        author: userId
      }
    })
    .then(res => {
      if(res.data){
        Taro.showToast({
          title: '发表成功',
          icon: 'none',
          mask: true
        }).then(()=>{
          setTimeout(()=>{
            Taro.redirectTo({url: '/pages/index/index'})
          }, 1500)
        })
      }
    })
  }

  render() {
    const { title, bookName, cover, bookRev} = this.state
    return (
      <View>
        <AtInput title='标题' placeholder='请输入标题' value={title} onChange={this.handleTitleChange} ></AtInput>
        <AtInput title='书名' placeholder='请输入书籍名称' value={bookName} onChange={this.handlebookNameChange} ></AtInput>
        <View className='form-item'>
            <View className='form-item-label'>图片 </View>
            <AtImagePicker files={cover} onChange={this.handleCoverChange} showAddBtn={cover.length<1}></AtImagePicker>
          </View>
        <View className='form-book-review'>
          <View className='form-book-review-label'>书评（支持markdown格式） </View>
          <AtTextarea className='bookrev-content' value={bookRev} placeholder='请输入你的读书感受吧...' height={400} maxLength={1000} onChange={this.handleBookRevChange}> </AtTextarea>
        </View>
        <AtButton className='create-btn' type='primary' onClick={this.onCreate}>发表</AtButton>
      </View>
    )
  }
}

export default Create
