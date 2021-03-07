import { Tag, Input, Icon, message } from 'antd';
import { TweenOneGroup } from 'rc-tween-one';
import React, { Component } from 'react'

type IProps = {
  disabled: boolean
  value?: any;
  onChange?: (value: any) => void;
  maxCount: number
}
class EditableTagGroup extends Component<IProps>  {
  state = {
    inputVisible: false,
    inputValue: '',
    tags: []
  };

  componentWillReceiveProps = (nextProps: IProps) => {
    if(nextProps.value){
      this.setState({
        tags: nextProps.value.split('|')
      })
    }
  }

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleClose = (removedTag: string) => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    this.setState({ tags }, ()=> {
      this.props.onChange(tags.join("|"))
    });
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  tagConfirm = (inputValue: string) => {
    let { tags } = this.state;
    if(inputValue.length >5) {
      message.error("标签请小于5个字")
      return
    }

    if(tags.indexOf(inputValue) !== -1){
      message.error("标签已存在")
      return
    }

    if(!inputValue){
      return 
    }
    tags = [...tags, inputValue];
    this.setState({
      tags,
    }, () => {
      this.props.onChange(tags.join("|"))
    });
  };

  handleInputConfirm = () => {
    const { inputValue, tags } = this.state;
    const { maxCount } = this.props
    if(tags && tags.length >= maxCount){
      message.error(`最多创建${maxCount}个标签`)
      return
    }
    this.tagConfirm(inputValue)
    this.setState({
      inputVisible: false,
      inputValue: '',
    });
  };

  saveInputRef = input => (this.input = input);

  forMap = tag => {
    const { disabled } = this.props
    const tagElem = (
      <Tag
        closable={disabled?false: true}
        color="#1890ff"
        onClose={e => {
          e.preventDefault();
          this.handleClose(tag);
        }}
      >
        {tag}
      </Tag>
    );
    return (
      <span key={tag} style={{ display: 'inline-block' }}>
        {tagElem}
      </span>
    );
  };

  render() {
    const { inputVisible, inputValue, tags } = this.state;
    const { maxCount, disabled } = this.props
    const showTag = (tags.length < maxCount) && !disabled
    const tagChild = tags.map(this.forMap);
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div>
          <TweenOneGroup
            enter={{
              scale: 0.8,
              opacity: 0,
              type: 'from',
              duration: 100,
              onComplete: e => {
                e.target.style = '';
              },
            }}
            leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
            appear={false}
          >
            {tagChild}
          </TweenOneGroup>
        </div>
        {inputVisible && showTag && (
          <Input
            ref={this.saveInputRef}
            type="text"
            size="small"
            style={{ width: 78 }}
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        )}
        {!inputVisible && showTag &&(
          <Tag onClick={this.showInput} style={{ background: '#fff', borderStyle: 'dashed' }}>
            <Icon type="plus" /> 创建新标签
          </Tag>
        )}
      </div>
    );
  }
}

export default EditableTagGroup
