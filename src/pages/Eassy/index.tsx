import React, { FC, useEffect, useState } from 'react';
import styles from './styles.less'
import { Button, Table, Input, Select, Modal, message, Radio, Spin, DatePicker, Form, Col, Row} from 'antd'
import router from 'umi/router';
import { getSkuList, skuApply, skuApprove, skuStop } from '@/service/cargo'
import { PRIORITY_INFO, SKU_STATUS_INFO } from '@/constants/basic'
import { geMeetingStatus, cargoStatus, realStatus, meetingStatus } from '@/utils/common'
import Utils from '@/utils/common';

const { RangePicker } = DatePicker;

const { username } = Utils.Json2Obj(Utils.getCookie('userInfo'));

const { Option } = Select

const Cargo: FC = () => {

  const [form] = Form.useForm();
  const [SKUList, setSKUList] = useState([]);
  const [loading, setloading] = useState(false);
  const [page, setpage] = useState(1);
  const [total, settotal] = useState(0);
  const [operateId, setoperateId] = useState(0);
  const [showOfflineModal, setshowOfflineModal] = useState(false);
  const [showOnlineModal, setshowOnlineModal] = useState(false);
  const [showCheckModal, setshowCheckModal] = useState(false);
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
    setloading(true)
    try{
      const res = await getSkuList({
        ...params,
        ...statusParams,
        enable_time,
        expire_time,
        page: init?1:page,
        limit: 20,
      })
      if(res.data){
        setSKUList(res.data.data)
        settotal(res.data.pagination.total_records)
        if(init){
          setpage(1)
        }
      }
    }catch(err){
      message.error(err)
    }
    setloading(false)
  }

  const goDetail = (item:any, type: string) => {
    const isIframe = Utils.getUrlParamValue('iframe', window.location.search) === 'true';
    const query = item.id?
    {
      id: item.id,
      type,
      iframe: isIframe
    }:
    {
      type,
      iframe: isIframe
    }
    router.push({
      pathname: '/cargoManage/cargoDetail',
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
        message.success("商品审核成功")
        toggleCheckModal(-1)
        getSKUList()
      }
    }catch(err){
      message.error(err)
    }
  }

  const onlineSKU = async() => {
    try {
      const res = await skuApply({id: operateId})
      if(res.errno === 0){
        message.success("申请上架成功")
        toggleOnlineModal(-1)
        getSKUList()
      }
    }catch(err){
      message.error(err)
    }
  }

  const offlineSKU = async() => {
    try {
      const res = await skuStop({id: operateId})
      if(res.errno === 0){
        message.success("商品下架成功")
        toggleOfflineModal(-1)
        getSKUList()
      }
    }catch(err){
      message.error(err)
    }
  }

  const toggleCheckModal = (operateId: number) => {
    setshowCheckModal(!showCheckModal)
    setoperateId(operateId)
  }

  const toggleOnlineModal = (operateId: number) => {
    setshowOnlineModal(!showOnlineModal)
    setoperateId(operateId)
  }

  const toggleOfflineModal = (operateId: number) => {
    setshowOfflineModal(!showOfflineModal)
    setoperateId(operateId)
  }



   const renderOperation = (audit_status:number, status:number, item:any) => {
    if(status === -1 && audit_status === 1){
        return(
          <div>
            <a  onClick={() => goDetail(item, "copy")}>
              复制
            </a>
            <a  onClick={() => goDetail(item, "check")}>
              查看
            </a>
            <a onClick={() => toggleCheckModal(item.id)}>
              审核
            </a>
          </div>
        )
    }

    if(status === -1){
      return(
        <div>
          <a  onClick={() => goDetail(item, "edit")}>
          编辑
          </a>
          <a  onClick={() => goDetail(item, "check")}>
            查看
          </a>
          <a  onClick={() => goDetail(item, "copy")}>
            复制
          </a>
          <a onClick={() => toggleOnlineModal(item.id)}>
            申请上架
          </a>
        </div>
      )
    }

    if(status === 1){
      return(
        <div>
        <a  onClick={() => goDetail(item, "copy")}>
          复制
        </a>
        <a  onClick={() => goDetail(item, "check")}>
          查看
        </a>
        <a onClick={() => toggleOfflineModal(item.id)}>
          下架
        </a>
      </div>
      )
    }
  }

  const renderColumns = () => {
    const { type } = form.getFieldsValue()
    const columns = [
      {
        title: '商品ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '批次号',
        dataIndex: 'third_sku_id',
        key: 'third_sku_id',
      },
      {
        title: '卡名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '内部名称',
        dataIndex: 'inner_name',
        key: 'inner_name',
      },
      {
        title: '商品类型',
        dataIndex: 'type',
        key: 'type',
        render: (type: number) => {
          return(
            <div>
              {meetingStatus.find(item => item.key == type).desc}
            </div>
          )
      }
      },
      {
        title: '创建人',
        dataIndex: 'creator',
        key: 'creator',
      },
      {
        title: '基础售价',
        dataIndex: 'price',
        key: 'price',
        render: (price: number) => {
            return(
              <div>
                {price/100}&nbsp;元
              </div>
            )
        }
      },
      {
        title: '推荐优先级',
        dataIndex: 'priority',
        key: 'priority',
        render: (priority: number) => {
          let info = PRIORITY_INFO.find(item => (item.key === priority))
            return(
              <div>
                {info?info.desc:""}
              </div>
            )
        }
      },
      {
        title: '商品状态',
        dataIndex: 'status',
        key: 'status',
        render: (status:number, item:any) => (
            <div>
              {geMeetingStatus(item.audit_status, status)}
            </div>
        )
      },
      {
        title: '开始时间',
        dataIndex: 'enable_time',
        key: 'enable_time',
      },
      {
        title: '结束时间',
        dataIndex: 'expire_time',
        key: 'expire_time',
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
    if(type == 101 || type == 102){
      columns[1] =  {
        title: '卡商品ID',
        dataIndex: 'main_sku_id',
        key: 'main_sku_id',
      }
    }

    if(type == 102){
      columns.splice(6, 2)
    }

    return columns
  }

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.brumbs}>省钱卡<span className={styles.split}>／</span>商品管理</div>
        </div>
        <div className={styles.body}>
        <Form 
        form={form} 
        initialValues={{
          type: 1,
        }}
      >
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item label="商品ID" name="id">
            <Input placeholder="活动ID"/>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="创建人" name="creator">
            <Input placeholder="请输入创建人"/>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="商品状态" name="status" >
            <Select
              allowClear 
              placeholder="请选择商品状态"
            >
              {cargoStatus.map((item:any) => (
                <Option key={item.key} value={item.key}>{item.desc}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item label="内部名称" name="inner_name">
            <Input placeholder="内部名称"/>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="有效期" name="dateRange">
            <RangePicker/>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="商品类型" name="type" >
              <Select placeholder="请选择商品类型">
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
      </div>

          <div className={styles.tableArea}>
          <Spin spinning={loading}>
          <Table
              columns={renderColumns()}
              dataSource={SKUList}
              pagination={{current:page, pageSize:20, total, onChange:(page: number) => setpage(page)}}
              rowKey='id'
        />
          </Spin>
          </div>
        </div>
        <Modal
          visible={showCheckModal}
          title="商品审核"
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
          title="申请上架"
          onOk={onlineSKU}
          onCancel={() => toggleOnlineModal(-1)}
        >
        <div>
          确定要上架该商品吗？
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
      </div>
    )
}

export default Cargo
