import React, { Component } from 'react'
import {
  message,
  Modal,
  Radio,
  Table,
  Button
} from 'antd';
import styles from './styles.less'
import { getTagList } from '@/service/cargoDetail'

type TageList = {
  desc: string,
  creater: string,
  tag_id: number,
}

type IState = {
  tag: string|number
  namespace: string
  desc: string | number
  showTagModal: boolean
  namespace_type: number
  tagList: TageList[]
  page: number
  total: number
  creater: string | number
}

type IProps = {
  disabled: boolean
  value?: any;
  onChange?: (value: any) => void;
}

class TagProvider extends Component<IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.state = {
      tag: '',
      namespace: "",
      desc: '',
      showTagModal: false,
      namespace_type: 1,
      tagList: [],
      page: 1,
      total: 0,
      creater: -1
    };
  }

  componentWillReceiveProps = (nextProps: IProps) => {
    if(nextProps.value){
      this.setState({
        tag: nextProps.value.tag || nextProps.value.tag_id,
        desc: nextProps.value.tag_desc,
      })
    }
  }

  componentDidMount = () => {
    this.getTagInfo()
  }

  toggleTagModal = () => {
    const { disabled } = this.props
    if(disabled){
      return
    }
    this.setState({
      showTagModal: !this.state.showTagModal
    })
  }

  handleTyepChange = (value:any) => {
    this.setState({
      namespace_type: value
    }, ()=> {
      this.getTagInfo(true)
    })
  }

  getTagInfo = async (renew?: boolean) => {
    const { namespace_type, page } = this.state
    if(renew){
      this.setState({
        page: 1
      })
    }
    try{
      const params = {
        limit_count: 10,
        limit_offset: renew? 1 : page,
        namespace_type
      }
      const res = await getTagList(params)
      this.setState({
        tagList: res.data.tags,
        total: res.data.total,
        namespace: res.data.namespace
      })
    }catch(err){
      message.error(err)
    }
  }

  renderColumns = () => {
    const columns = [
      {
        title: '人群标签ID',
        dataIndex: 'tag_id',
        key: 'tag_id',
      },
      {
        title: '人群标签名称',
        dataIndex: 'desc',
        key: 'desc',
      },
      {
        title: '创建人',
        dataIndex: 'creater',
        key: 'creater',
      },
      {
        title: '选择（单选）',
        dataIndex: 'operate',
        key: 'operate',
        width: '20%',
        render: (_:any, item:any) => (
          <div onClick={() => this.chooseTag(item.tag_id, item.desc, item.creater)} className={styles.chooseTag}>
            选中人群
          </div>
        )
      }
    ]

    return columns
  }

    chooseTag = (tag:number, desc:string, creater:string) => {
      this.setState({
        tag,
        desc,
        creater
      }, () => {
        const { tag, namespace, desc } = this.state
        this.props.onChange({
          tag: String(tag), 
          tag_namespace: namespace, 
          tag_desc: desc
        })
        this.toggleTagModal()
      })
    }

    // 表格行数据
    renderTagList = () => {
      const { tagList } = this.state
      return tagList
    }
    
    pageChange = (page: number) => {
      this.setState({
        page
      }, () => this.getTagInfo())
    }
    
    refresh = (e) => {
      e.stopPropagation();
      this.setState({
        creater:""
      })
      this.setState({
        tag: '', 
        desc: ''
      })
      this.props.onChange({
        tag: '', 
        tag_namespace: '', 
        tag_desc: ''
      })
    } 

  render() {
    const { 
      tag, 
      showTagModal,
      namespace_type,
      page,
      total,
      desc
    } = this.state
    const { disabled } = this.props

    const renderLiHandler = () => {

      return (
         <Button 
          onClick={this.refresh}
          disabled={disabled}
         >
           取消人群
         </Button>
      )
  }

    const renderInfo = () => {
      return (
        <div>
          <div>人群ID：&nbsp;{tag}</div>
          <div>人群名称：&nbsp;{desc}</div>
        </div>
      )
    }

    const renderEmpty = () => {
      return (
        <div>
          暂无人群信息，请点击选择人群
        </div>
      )
    }
    

    return (
      <div>
      <div onClick={this.toggleTagModal} className={`${styles.container} ${disabled?styles.disabled:""}`}>
        <div className={styles.title}>售卖人群
        <div className={styles.cancelBtn}>{renderLiHandler()}</div>
        </div>
        <div className={styles.tagInfo}>
          {
            tag === -1?renderEmpty():renderInfo()
          }
        </div>
      </div>
      <Modal
          visible={showTagModal}
          title="选择人群"
          onOk={this.submitTag}
          onCancel={this.toggleTagModal}
          footer={null}
        >
        <div>
          <div className={styles.condition}>人群标签类型</div>
          <Radio.Group  onChange={(e) => this.handleTyepChange(e.target.value)} value={namespace_type}>
              <Radio value={1}>乘客ID</Radio>
              <Radio value={2}>乘客手机</Radio>
            </Radio.Group>
            <div className={styles.tableField}>
            <Table
              columns={this.renderColumns()}
              dataSource={this.renderTagList()}
              pagination={{current:page, pageSize:10, total, onChange:(page: number) => this.pageChange(page)}}
              rowKey='id'
              // 如果此页面改变样式，滚动区域高度需要随之改变
              scroll={{y:400}}
        />
            </div>
        </div>
      </Modal>
      </div>
    );
  }
}

export default TagProvider
