import React, { FC, useEffect, useState } from 'react';
import styles from './styles.less'
import { Button, Table, Input, Select, Modal, message, Radio, Spin, DatePicker, Form, Col, Row} from 'antd'
import router from 'umi/router';
import { getActivityList } from '@/service/cargo'
import { createBaseinfo } from '@/service/cargoDetail'
import { PRIORITY_INFO, SKU_STATUS_INFO } from '@/constants/basic'
import { geMeetingStatus, cargoStatus, realStatus, meetingStatus } from '@/utils/common'
import Utils from '@/utils/common';

const { RangePicker } = DatePicker;

const { username } = Utils.Json2Obj(Utils.getCookie('userInfo'));

const { Option } = Select

const Cargo: FC = () => {

  const [form] = Form.useForm();
  const [meetingList, setmeetingList] = useState([]);
  const [loading, setloading] = useState(false);
  const [page, setpage] = useState(1);
  const [total, settotal] = useState(0);
  const [operateItem, setoperateItem] = useState({});
  const [showOfflineModal, setshowOfflineModal] = useState(false);
  const [showOnlineModal, setshowOnlineModal] = useState(false);
  const [showDeleteModal, setshowDeleteModal] = useState(false);
  const [showCheckModal, setshowCheckModal] = useState(false);
  const [auditor, setauditor] = useState(username);
  const [auditStatus, setauditStatus] = useState('');

  useEffect(() => {
    getList()
  }, []);

  useEffect(() => {
    getList()
  }, [page]);

  const getList = async(init?:boolean) => {
    const params = form.getFieldsValue()
    setloading(true)
    try{
      const res = await getActivityList({
        ...params,
        meetingStatus:params.status,
        pageSize: 9999,
        pageIndex: 1
      })
      if(res.data){
        console.log(res.data)
        const noDelList = res.data.list.filter(item => !item.isDel)
        setmeetingList(noDelList)
        settotal(res.data.total)
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
    const query = item.id?
    {
      id: item.id,
      type,
    }:
    {
      type,
    }
    router.push({
      pathname: '/activity/detail',
      query
    });
  }

  const goBanner = (item:any, type: string) => {
    const query = item.id?
    {
      id: item.id,
      type,
    }:
    {
      type,
    }
    router.push({
      pathname: '/activity/banner',
      query
    });
  }

  const goModule = (item:any, type: string) => {
    const query = item.id?
    {
      id: item.id,
      type,
    }:
    {
      type,
    }
    router.push({
      pathname: '/activity/module',
      query
    });
  }

  const checkSKU = async() => {
    try {
      const params = {
        id: operateItem,
        auditor,
        audit_status: auditStatus,
      }
      const res = await skuApprove(params)
      if(res.errno === 0){
        message.success("????????????")
        toggleCheckModal(-1)
        getActivityList()
      }
    }catch(err){
      message.error(err)
    }
  }

  const onlineMeeting = async() => {
    toggleOnlineModal(-1)

    try {
      const res = await createBaseinfo({
        ...operateItem,
        meetingStatus: 1
      })
      if(res.returncode === 0){
        message.success("??????????????????")
        toggleOnlineModal(-1)
        getList()
      }
    }catch(err){
      message.error(err)
    }
  }

  const offlineMeeting = async() => {
    toggleOfflineModal(-1)
    try {
      const res = await createBaseinfo({
        ...operateItem,
        meetingStatus: 0
      })
      if(res.returncode === 0){
        message.success("??????????????????")
        toggleOfflineModal(-1)
        getList()
      }
    }catch(err){
      message.error(err)
    }
  }

  const deleteMeeting = async() => {
    toggleDeleteModal(-1)
    try {
      const res = await createBaseinfo({
        ...operateItem,
        isDel: 1
      })
      if(res.returncode === 0){
        message.success("??????????????????")
        toggleDeleteModal(-1)
        getList()
      }
    }catch(err){
      message.error(err)
    }
  }

  // const toggleCheckModal = (operateItem: number) => {
  //   setshowCheckModal(!showCheckModal)
  //   setoperateItem(operateItem)
  // }

  const toggleOnlineModal = (operateItem: number) => {
    setshowOnlineModal(!showOnlineModal)
    setoperateItem(operateItem)
  }

  const toggleOfflineModal = (operateItem: number) => {
    setshowOfflineModal(!showOfflineModal)
    setoperateItem(operateItem)
  }

  const toggleDeleteModal = (operateItem: number) => {
    setshowDeleteModal(!showDeleteModal)
    setoperateItem(operateItem)
  }



   const renderOperation = (status:number, item:any) => {
    if(status === 0){
        return(
          <div>
            {/* <a  onClick={() => goDetail(item, "check")}>
              ??????
            </a> */}
            <a  onClick={() => goDetail(item, "edit")}>
              ??????????????????
            </a>
            <a  onClick={() => goBanner(item, "edit")}>
              ?????????????????????
            </a>
            <a  onClick={() => goModule(item, "edit")}>
              ??????????????????
            </a>
            <a  onClick={() => toggleDeleteModal(item)}>
              ??????
            </a>
            <a onClick={() => toggleOnlineModal(item)}>
              ????????????
            </a>
          </div>
        )
    }

    if(status === 1){
      return(
        <div>
          {/* <a  onClick={() => goDetail(item, "check")}>
            ??????
          </a> */}
          <a  onClick={() => goDetail(item, "edit")}>
          ??????????????????
          </a>
          <a  onClick={() => goBanner(item, "edit")}>
              ?????????????????????
            </a>
            <a  onClick={() => goModule(item, "edit")}>
              ??????????????????
            </a>
          <a  onClick={() => toggleDeleteModal(item)}>
            ??????
          </a>
          <a onClick={() => toggleOfflineModal(item)}>
            ????????????
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
        title: '????????????',
        dataIndex: 'meetingName',
        key: 'meetingName',
      },
      {
        title: '???????????????',
        dataIndex: 'sponsor',
        key: 'sponsor',
      },
      {
        title: '????????????',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '??????????????????',
        dataIndex: 'beginTime',
        key: 'beginTime',
      },
      {
        title: '??????????????????',
        dataIndex: 'endTime',
        key: 'endTime',
      },
      {
        title: '????????????',
        dataIndex: 'meetingStatus',
        key: 'meetingStatus',
        render: (status:number, item:any) => (
          <div>
            {geMeetingStatus(status)}
          </div>
      )
      },
      {
        title: '?????????',
        dataIndex: 'adminUser',
        key: 'adminUser',
      },
      {
        title: '??????',
        dataIndex: 'operate',
        key: 'operate',
        render: (_:any, item:any) => (
          <div className="operate-wrap">
              <div>
              {renderOperation(item.meetingStatus, item)}
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
          <div className={styles.brumbs}>????????????</div>
        </div>
        <div className={styles.body}>
        <Form 
        form={form} 
        initialValues={{
        }}
      >
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item label="????????????" name="meetingName">
            <Input placeholder="?????????????????????"/>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="???????????????" name="sponsor">
            <Input placeholder="????????????????????????"/>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="????????????" name="address">
            <Input placeholder="?????????????????????"/>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item label="????????????" name="status" >
              <Select placeholder="?????????????????????" allowClear defaultValue="">
                {meetingStatus.map((item:any) => (
                  <Option key={item.key} value={item.key}>{item.desc}</Option>
                ))}
              </Select>
          </Form.Item>
        </Col>
      </Row>     
      </Form>
      <div className={styles.btnGroup}>
        <Button type="primary" onClick={() => getList(true)} className={styles.searchBtn}>??????</Button>
        <Button type="primary" onClick={() => goDetail({}, "create")} className={styles.createNew}>??????</Button>
      </div>

          <div className={styles.tableArea}>
          <Spin spinning={loading}>
          <Table
              columns={renderColumns()}
              dataSource={meetingList}
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
          onOk={onlineMeeting}
          onCancel={() => toggleOnlineModal(-1)}
        >
        <div>
          ?????????????????????
        </div>
      </Modal>

      <Modal
          visible={showDeleteModal}
          title="????????????"
          onOk={deleteMeeting}
          onCancel={() => toggleDeleteModal(-1)}
        >
        <div>
          ?????????????????????
        </div>
      </Modal>

      <Modal
          visible={showOfflineModal}
          title="????????????"
          onOk={offlineMeeting}
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
