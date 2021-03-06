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
        message.success("??????????????????")
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
        message.success("??????????????????")
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
        message.success("??????????????????")
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
              ??????
            </a>
            <a  onClick={() => goDetail(item, "check")}>
              ??????
            </a>
            <a onClick={() => toggleCheckModal(item.id)}>
              ??????
            </a>
          </div>
        )
    }

    if(status === -1){
      return(
        <div>
          <a  onClick={() => goDetail(item, "edit")}>
          ??????
          </a>
          <a  onClick={() => goDetail(item, "check")}>
            ??????
          </a>
          <a  onClick={() => goDetail(item, "copy")}>
            ??????
          </a>
          <a onClick={() => toggleOnlineModal(item.id)}>
            ????????????
          </a>
        </div>
      )
    }

    if(status === 1){
      return(
        <div>
        <a  onClick={() => goDetail(item, "copy")}>
          ??????
        </a>
        <a  onClick={() => goDetail(item, "check")}>
          ??????
        </a>
        <a onClick={() => toggleOfflineModal(item.id)}>
          ??????
        </a>
      </div>
      )
    }
  }

  const renderColumns = () => {
    const { type } = form.getFieldsValue()
    const columns = [
      {
        title: '??????ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '?????????',
        dataIndex: 'third_sku_id',
        key: 'third_sku_id',
      },
      {
        title: '?????????',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '????????????',
        dataIndex: 'inner_name',
        key: 'inner_name',
      },
      {
        title: '????????????',
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
        title: '?????????',
        dataIndex: 'creator',
        key: 'creator',
      },
      {
        title: '????????????',
        dataIndex: 'price',
        key: 'price',
        render: (price: number) => {
            return(
              <div>
                {price/100}&nbsp;???
              </div>
            )
        }
      },
      {
        title: '???????????????',
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
        title: '????????????',
        dataIndex: 'status',
        key: 'status',
        render: (status:number, item:any) => (
            <div>
              {geMeetingStatus(item.audit_status, status)}
            </div>
        )
      },
      {
        title: '????????????',
        dataIndex: 'enable_time',
        key: 'enable_time',
      },
      {
        title: '????????????',
        dataIndex: 'expire_time',
        key: 'expire_time',
      },
      {
        title: '??????',
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
        title: '?????????ID',
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
          <div className={styles.brumbs}>?????????<span className={styles.split}>???</span>????????????</div>
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
          <Form.Item label="??????ID" name="id">
            <Input placeholder="??????ID"/>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="?????????" name="creator">
            <Input placeholder="??????????????????"/>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="????????????" name="status" >
            <Select
              allowClear 
              placeholder="?????????????????????"
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
          <Form.Item label="????????????" name="inner_name">
            <Input placeholder="????????????"/>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="?????????" name="dateRange">
            <RangePicker/>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="????????????" name="type" >
              <Select placeholder="?????????????????????">
                {meetingStatus.map((item:any) => (
                  <Option key={item.key} value={item.key}>{item.desc}</Option>
                ))}
              </Select>
          </Form.Item>
        </Col>
      </Row>     
      </Form>
      <div className={styles.btnGroup}>
        <Button type="primary" onClick={() => getSKUList(true)} className={styles.searchBtn}>??????</Button>
        <Button type="primary" onClick={() => goDetail({}, "create")} className={styles.createNew}>??????</Button>
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
          title="????????????"
          onOk={checkSKU}
          onCancel={() => toggleCheckModal(-1)}
        >
        <div>
        <div className={styles.condition}>
            <div className={styles.title}>
            <span className="coupon-required">*</span>
              ?????????</div>
            <Input 
              value={auditor}
              disabled={true}
              placeholder="?????????????????????"
              onChange={(e) => setauditor(e.target.value)}/>
          </div>

          <div className={styles.condition}>
            <div className={styles.title}>
            <span className="coupon-required">*</span>
              ????????????</div>
            <Radio.Group  onChange={(e) => setauditStatus(e.target.value)} value={auditStatus}>
              <Radio value={2}>??????</Radio>
              <Radio value={3}>??????</Radio>
            </Radio.Group>
          </div>

        </div>
      </Modal>

      <Modal
          visible={showOnlineModal}
          title="????????????"
          onOk={onlineSKU}
          onCancel={() => toggleOnlineModal(-1)}
        >
        <div>
          ??????????????????????????????
        </div>
      </Modal>

      <Modal
          visible={showOfflineModal}
          title="????????????"
          onOk={offlineSKU}
          onCancel={() => toggleOfflineModal(-1)}
        >
        <div>
          ??????????????????????????????
        </div>
      </Modal>
      </div>
    )
}

export default Cargo
