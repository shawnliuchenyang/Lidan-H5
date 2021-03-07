import React, { Component } from 'react'
import styles from './LoginInput.styles.less';
import { Input, Icon } from 'antd'

type ExProps = {
  value?: string
}

type IProps = ExProps & {
  placeholder: string
  name?: string
  isValid: boolean
  errorMsg: string
  type?: string
  showTip?: boolean
  regExp: RegExp
  suffix?: React.ReactElement
  autoComplete?: string
  autoFocus?: boolean
  maxLength?: number
  prefix: string
  changeItem: (item: { value: string; isValid: boolean }) => void
}

type IState = {
  isFocus: boolean
  value: string
}

class LoginInput extends Component<IProps, IState> {
  static defaultProps = {
    name: '',
    suffix: null,
    type: 'text',
    value: '',
    showTip: false,
    autoComplete: 'new-password',
    autoFocus: false,
    maxLength: Infinity
  }

  $input: HTMLInputElement | null = null
  MyInput: any;

  constructor(props: IProps) {
    super(props)
    const { type } = props
    this.MyInput = type === 'password' ? Input.Password : Input
    this.state = {
      isFocus: true,
      value: props.value || ''
    }
  }

  componentDidMount() {
    if (this.props.autoFocus && this.$input) {
      this.$input.focus()
    }
  }

  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    let isValid = value !== ''
    if (isValid) {
      isValid = this.props.regExp.test(value)
    }

    this.props.changeItem({ value, isValid })
    this.setState({ value })
  }

  onFocus = () => {
    this.setState({ isFocus: true })
  }

  onBlur = () => {
    const { value } = this.state
    let isValid = value !== ''
    if (isValid) {
      isValid = this.props.regExp.test(value)
    }

    this.props.changeItem({ value, isValid })
    this.setState({
      isFocus: false
    })
  }

  render() {
    const MyInput = this.MyInput
    const { placeholder, isValid, errorMsg, suffix, showTip, autoComplete, maxLength, name, type, prefix } = this.props
    const { isFocus, value } = this.state
    const noValid = isValid === false
    const showError = !isFocus && noValid
    const isEmpty = showError && value === ''

    return (
      <div className={`${styles.empty} ${styles.inputContainer} ${showError ? styles.tError : ''} ${isEmpty ? styles.tEmpty : ''}`}>
        <MyInput
          type={type==='password'?'password':''}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={this.onChange}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          autoComplete={autoComplete}
          maxLength={maxLength}
          ref={(input:any) => {
              this.$input = input
          }}
        />
        <span
          className={`${styles.loginInputError} ${showError && value !== '' ? styles.tShow : ''} ${
            showTip && isFocus ? styles.tip : ''
          }`}
        >
          {errorMsg}
        </span>
        {suffix}
      </div>
    )
  }
}

export default LoginInput
