import React, { FC, useEffect, useState } from 'react';
import styles from './styles.less'
import { Button, Table, Input, Select, Modal, message, Radio, Spin, DatePicker, Form, Col, Row} from 'antd'
import router from 'umi/router';
import { getSkuList, skuApply, skuApprove, skuStop } from '@/service/cargo'
import { PRIORITY_INFO, SKU_STATUS_INFO } from '@/constants/basic'
import { geMeetingStatus, cargoStatus, realStatus, meetingStatus } from '@/utils/common'
import  BatchUploadModal  from '@/components/batchUploadModal'
import Utils from '@/utils/common';

const { RangePicker } = DatePicker;

const { username } = Utils.Json2Obj(Utils.getCookie('userInfo'));

const { Option } = Select

const Cargo: FC = () => {

  const [form] = Form.useForm();
  const [staffList, setStaffList] = useState([]);
  const [loading, setloading] = useState(false);
  const [page, setpage] = useState(1);
  const [total, settotal] = useState(0);
  const [operateId, setoperateId] = useState(0);
  const [showOfflineModal, setshowOfflineModal] = useState(false);
  const [showOnlineModal, setshowOnlineModal] = useState(false);
  const [showCheckModal, setshowCheckModal] = useState(false);
  const [showBatchUpdate, setshowBatchUpdate] = useState(false);
  const [auditor, setauditor] = useState(username);
  const [auditStatus, setauditStatus] = useState('');

  useEffect(() => {
    getSKUList()
  }, []);

  useEffect(() => {
    getSKUList()
  }, [page]);

  const getSKUList = async(init?:boolean) => {
    const params = form.getFieldsValue()
    const statusParams = realStatus[params.status]
    const enable_time = params.dateRange?params.dateRange[0].format('YYYY-MM-DD'):''
    const expire_time = params.dateRange?params.dateRange[1].format('YYYY-MM-DD'):''
    delete params.dateRange
    console.log('params', params)
    setloading(true)
    try{
      let staff_list = [{
        id: 0,
        name: "刘晨阳",
        phone: "17326858602",
        title: "副教授",
        identity: "与会专家",
        status: 1,
      },
      {
        id: 1,
        name: "高一辰",
        phone: "13693378752",
        title: "力丹文化CEO",
        identity: "工作人员",
        status: 1,
      },
      {
        id: 2,
        name: "吕晨阳",
        phone: "18126858502",
        title: "主任医师",
        identity: "观众",
        status: -1,
      }]
      if(params.status == 1){
        staff_list = staff_list.slice(0, 2)
      }

      if(params.status == -1){
        staff_list = staff_list.slice(2)
      }
      setStaffList(staff_list)
      // const res = await getSkuList({
      //   ...params,
      //   ...statusParams,
      //   enable_time,
      //   expire_time,
      //   page: init?1:page,
      //   limit: 20,
      // })
      // if(res.data){
      //   setStaffList(res.data.data)
      //   settotal(res.data.pagination.total_records)
      //   if(init){
      //     setpage(1)
      //   }
      // }
      
    }catch(err){
      message.error(err)
    }
    setloading(false)
  }

  const goDetail = (item:any, type: string) => {
    const query = item.id?
    {
      id: item.id,
      type,
    }:
    {
      type,
    }
    router.push({
      pathname: '/staff/detail',
      query
    });
  }

  const checkSKU = async() => {
    try {
      const params = {
        id: operateId,
        auditor,
        audit_status: auditStatus,
      }
      const res = await skuApprove(params)
      if(res.errno === 0){
        message.success("签到成功")
        toggleCheckModal(-1)
        getSKUList()
      }
    }catch(err){
      message.error(err)
    }
  }

  const onlineSKU = async() => {
    const list = staffList
    list[operateId].status = 1
    setStaffList(list)
        toggleOnlineModal(-1)
    // try {
    //   const res = await skuApply({id: operateId})
    //   if(res.errno === 0){
    //     message.success("申请上架成功")
    //     toggleOnlineModal(-1)
    //     getSKUList()
    //   }
    // }catch(err){
    //   message.error(err)
    // }
  }

  const offlineSKU = async() => {
    const list = staffList
    list[operateId].status = -1
    setStaffList(list)
    toggleOfflineModal(-1)
    // try {
    //   const res = await skuStop({id: operateId})
    //   if(res.errno === 0){
    //     message.success("商品下架成功")
    //     toggleOfflineModal(-1)
    //     getSKUList()
    //   }
    // }catch(err){
    //   message.error(err)
    // }
  }

  // const toggleCheckModal = (operateId: number) => {
  //   setshowCheckModal(!showCheckModal)
  //   setoperateId(operateId)
  // }

  const toggleOnlineModal = (operateId: number) => {
    setshowOnlineModal(!showOnlineModal)
    setoperateId(operateId)
  }

  const toggleOfflineModal = (operateId: number) => {
    setshowOfflineModal(!showOfflineModal)
    setoperateId(operateId)
  }

  const toggleBatchModal = (operateId: number) => {
    setshowBatchUpdate(!showBatchUpdate)
  }



   const renderOperation = (audit_status:number, status:number, item:any) => {
     console.log('status',status)
    if(status === 1){
        return(
          <div>
            <a  onClick={() => goDetail(item, "check")}>
              查看
            </a>
            <a  onClick={() => goDetail(item, "edit")}>
              编辑
            </a>
            <a onClick={() => toggleOfflineModal(item.id)}>
              取消签到
            </a>
          </div>
        )
    }

    if(status === -1){
      return(
        <div>
          <a  onClick={() => goDetail(item, "check")}>
            查看
          </a>
          <a  onClick={() => goDetail(item, "edit")}>
            编辑
          </a>
          <a onClick={() => toggleOnlineModal(item.id)}>
            签到
          </a>
        </div>
      )
  }
  }

  const renderColumns = () => {
    const { type } = form.getFieldsValue()
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '职称',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: '电话',
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: '会议身份',
        dataIndex: 'identity',
        key: 'identity',
      },
      {
        title: '签到状态',
        dataIndex: 'status',
        key: 'status',
        render: (status:number, item:any) => (
          <div>
            {geMeetingStatus(item.audit_status, status)}
          </div>
      )
      },
      {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        render: (_:any, item:any) => (
          <div className="operate-wrap">
              <div>
              {renderOperation(item.audit_status, item.status, item)}
              </div>
          </div>
        )
      }
    ]

    return columns
  }

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.brumbs}>人员管理</div>
        </div>
        <div className={styles.body}>
        <Form 
        form={form} 
        initialValues={{
        }}
      >
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item label="姓名" name="name">
            <Input placeholder="姓名"/>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="职称" name="title">
            <Input placeholder="职称"/>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="电话" name="phone">
            <Input placeholder="电话"/>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item label="会议身份" name="identity">
            <Input placeholder="会议身份"/>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="签到状态" name="status" >
              <Select placeholder="签到状态" allowClear defaultValue="">
                {meetingStatus.map((item:any) => (
                  <Option key={item.key} value={item.key}>{item.desc}</Option>
                ))}
              </Select>
          </Form.Item>
        </Col>
      </Row>     
      </Form>
      <div className={styles.btnGroup}>
        <Button type="primary" onClick={() => getSKUList(true)} className={styles.searchBtn}>查询</Button>
        <Button type="primary" onClick={() => goDetail({}, "create")} className={styles.createNew}>创建</Button>
        <Button type="primary" onClick={() => toggleBatchModal(-1)} className={styles.batchBtn}>批量导入人员</Button>
      </div>

          <div className={styles.tableArea}>
          <Spin spinning={loading}>
          <Table
              columns={renderColumns()}
              dataSource={staffList}
              pagination={{current:page, pageSize:20, total, onChange:(page: number) => setpage(page)}}
              rowKey='id'
        />
          </Spin>
          </div>
        </div>
        <Modal
          visible={showCheckModal}
          title="签到管理"
          onOk={checkSKU}
          onCancel={() => toggleCheckModal(-1)}
        >
        <div>
        <div className={styles.condition}>
            <div className={styles.title}>
            <span className="coupon-required">*</span>
              审批人</div>
            <Input 
              value={auditor}
              disabled={true}
              placeholder="请输审批人名称"
              onChange={(e) => setauditor(e.target.value)}/>
          </div>

          <div className={styles.condition}>
            <div className={styles.title}>
            <span className="coupon-required">*</span>
              审批状态</div>
            <Radio.Group  onChange={(e) => setauditStatus(e.target.value)} value={auditStatus}>
              <Radio value={2}>驳回</Radio>
              <Radio value={3}>通过</Radio>
            </Radio.Group>
          </div>

        </div>
      </Modal>

      <Modal
          visible={showOnlineModal}
          title="人员签到"
          onOk={onlineSKU}
          onCancel={() => toggleOnlineModal(-1)}
        >
        <div>
          确定要签到吗？
        </div>
      </Modal>

      <Modal
          visible={showOfflineModal}
          title="商品下架"
          onOk={offlineSKU}
          onCancel={() => toggleOfflineModal(-1)}
        >
        <div>
          确定要下架该商品吗？
        </div>
      </Modal>

      <Modal
          visible={showBatchUpdate}
          title="批量导入人员"
          onOk={onlineSKU}
          onCancel={() => toggleBatchModal(-1)}
        >
        <div>
        <BatchUploadModal 
                uploadInfo={}
                text="请点击上传Excel文件"
                refresh={getSKUList}
                name="excel"
                >

            </BatchUploadModal>
        </div>
      </Modal>
      </div>
    )
}

export default Cargo
