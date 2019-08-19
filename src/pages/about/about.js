import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { bindActionCreators } from 'redux'
import { connect } from '@tarojs/redux'
import { AtTimeline, AtDivider, AtCalendar, AtButton } from 'taro-ui'
import _ from 'loadsh'
import * as countActions from '../../actions/counter'
import './about.scss'

class About extends Component{
  config = {
    navigationBarTitleText: '关于我们',
  };
  constructor(){
    super(...arguments)
    this.state = {

    }
  }

  countAdd=()=>{
    const {actions} = this.props
    actions.asyncAdd()
  }

  render(){
    const { num } = this.props
    return (
      <View className='about-page'>
        <AtCalendar />
        <AtDivider content='分割线' />
        <AtTimeline
          pending
          items={[
            { title: '开题报告', content: ['2018年11月'], icon: 'check-circle' },
            { title: '论文初稿', content: ['项目大纲编写'], icon: 'check-circle' },
            { title: '论文二稿', content: ['项目功能添加'], icon: 'check-circle' },
            { title: '论文三稿', content: ['项目功能测试'], icon: 'check-circle' },
            { title: '论文定稿', content: ['项目完成'], icon: 'clock' }
          ]}
        >
        </AtTimeline>
        <AtButton onClick={this.countAdd}>add</AtButton>
        <View>{num}</View>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    num: state.counter.num
  }
}

const mapDispatchToProps = (dispatch) =>({
  actions: bindActionCreators(Object.assign({}, countActions), dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(About)
