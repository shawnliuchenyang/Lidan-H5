import React, { Component } from 'react'
import styles from './styles.less'
import LoginInput from '../../components/LoginInput'
import { Button, message, Modal, Input } from 'antd'
import { login } from '@/service/login'
import router from 'umi/router'
import { setMetaData } from '@/utils/axios'

type FormItem = {
  value: string
  isValid: boolean
}

type IState = {
  username: FormItem
  password: FormItem
  hasError: boolean
  message: string
  showSignup: boolean
  name: string
  phone: string
  company: string
  description: string
}

type IProps = {
  location: any
}

class LoginForm extends Component<IProps, IState> {

  state: IState = {
    username: { value: '', isValid: false },
    password: { value: '', isValid: false },
    hasError: false,
    message: '',
    showSignup: false,
    name: '',
    phone: '',
    company: '',
    description: ''
  }

  componentDidMount = () => {
    window.addEventListener("keydown",this.handleEnterKey);
  }

  handleEnterKey = (e:any) => {
    const { showSignup } = this.state
    if(e.keyCode === 13 && !showSignup){
      this.onSubmit()
    }
  }

  componentWillUnmount = () => {
    window.removeEventListener("keydown", this.handleEnterKey)
  }

   onSubmit = async () => {
    const { username, password } = this.state
    if(!username.value){
      message.error('请输入用户名')
      return
    }
    if(!password.value){
      message.error('请输入密码')
      return
    }

    const params = {
      accountId: username.value,
      password: password.value,
    }

    try {
      const res = await login(params)
      if(res.data){
        sessionStorage.setItem('authorization', res.data.authorization)
        setMetaData()
        router.push('/center');
      }
      // router.push('/center');
    } catch(error) {
      message.error(error.message)
    }
}

changeItem = (type: string, item: FormItem) => {
  const state: any = this.state
  state[type] = item
  this.setState(state)
}

toggleVisible = () => {
  this.setState({
    showSignup: !this.state.showSignup
  })
}

handleInputChange = (e:any, type:string) => {
  this.setState({
    [type]: e.target.value
  })
}

submitFree = async() => {
  const { name, phone, company, description } = this.state
  if(!name){
    message.error("请输入姓名")
    return
  }
  if(!phone){
    message.error("请输入电话")
    return
  }
  if(!company){
    message.error("请输入公司名称")
    return
  }
  if(!description){
    message.error("请添加详细描述")
    return
  }
  const phoneReg = /^((1[3-8][0-9])+\d{8})$/
  if (phone && !phoneReg.test(phone)) {
    message.error('请输入正确的11位数字手机号码')
    return
  }
  try {
    const params = {
      name,
      phone,
      company,
      demand: description
    }
    if(res.success){
      message.success("申请成功")
      this.toggleVisible()
    }
  }
  catch(err){
    message.error(err.message)
  }
}

  render() {
    const { username, password, showSignup, name, phone, company, description } = this.state

    return (
      <div className={styles.container}>
        <div className={styles.signinLeft}>
          <div className={styles.leftField}>
            {/* <img src={mageLogo} width="160"/> */}
            <div className={styles.leftTitle}>力丹文化会务管理系统</div>

            <div className={styles.leftDesc}>
              <div className={styles.point}/>
              <div className={styles.descDetail}>为解决会议组织承办方在会前、会中、会后的全方面需求</div>
              <div className={styles.point}/>
              <div className={styles.descDetail}>实现完整“会务管理系统”，实现会前、会中、会后的信息管理与智能化控制。</div>
              <div className={styles.point}/>
              <div className={styles.descDetail}>实现线上会议报名、日程一览、云直播、历史信息展示、线上缴费、消息通知等多元化功能。</div>
            </div>
          </div>
          <div className={styles.uibotBg}/>
        </div>
        <div className={styles.signinRight}>
          <div className={styles.form}>
          {/* <div className={styles.title}>登录&nbsp;UiBot Mage</div> */}
            <LoginInput
              name="username"
              isValid={username.isValid}
              placeholder="输入用户名/手机号"
              errorMsg="请输入正确的用户名/手机号"
              changeItem={(item: FormItem) => this.changeItem('username', item)}
              regExp={/\S+/}
              autoComplete="on"
              autoFocus={true}
              prefix='user'
            />

            <LoginInput
              name="passowrd"
              type="password"
              isValid={password.isValid}
              placeholder="输入密码"
              errorMsg="请输入密码"
              changeItem={(item: FormItem) => this.changeItem('password', item)}
              regExp={/\S+/}
              autoComplete="on"
              prefix='lock'
            />

            <Button type='primary' onClick={this.onSubmit} className={styles.submitBtn} >
              登录
            </Button>

            {/* <div className={styles.formtips} onClick={this.toggleVisible}>申请试用</div> */}
          </div>
        </div>
        <div className={styles.signinRightPhone}>
          服务热线&nbsp;XXX-XXXX-XXX
        </div>
        <div className={styles.signinRightRefer}>
            <p>
              <a className={styles.signinRightWebsite} href="https://baike.baidu.com/item/%E5%9B%9B%E5%B7%9D%E5%8A%9B%E4%B8%B9%E6%96%87%E5%8C%96%E4%BC%A0%E6%92%AD%E6%9C%89%E9%99%90%E5%85%AC%E5%8F%B8/52218834?fr=aladdin">
              四川力丹文化传播有限公司
              </a>
              &nbsp; 版权所有
            </p>
          </div>
          <Modal
            className={styles.modal}
            visible={showSignup}
            title="申请试用
            "
            onOk={this.submitFree}
            okText="提交"
            onCancel={this.toggleVisible}
            overlay={true}
          >
          <div>
          <div className={styles.signupDesc}>欢迎您申请试用UiBot Mage的全系列AI能力
            </div>
            <div className={styles.signupSub}>请您填写个人信息以方便我们的工作人员与您联系。我们将遵循相关隐私保护的条例，妥善使用您的个人信息。
            </div>

            <div className={styles.signUpTitle}>
              <div className="must-have"/>
              真实姓名
            </div>
            <Input placeholder="填写真实姓名" theme="dark" value={name} onChange={(e:any)=>this.handleInputChange(e, 'name')}/>

            <div className={styles.signUpTitle}>
              <div className="must-have"/>
              联系手机
            </div>
            <Input placeholder="填写联系手机" theme="dark" value={phone} onChange={(e:any)=>this.handleInputChange(e, 'phone')}/>

            <div className={styles.signUpTitle}>
              <div className="must-have"/>
              企业名称
            </div>
            <Input placeholder="填写企业名称"  theme="dark" value={company} onChange={(e:any)=>this.handleInputChange(e, 'company')}/>

            <div className={styles.signUpTitle}>
              <div className="must-have"/>
              需求描述
            </div>
            <Input.TextArea placeholder="请描述我们能为您做什么？" rows={5} theme="dark" value={description} onChange={(e:any)=>this.handleInputChange(e, 'description')}/>

          </div>
          </Modal>
      </div>
    )
  }
}

export default LoginForm
