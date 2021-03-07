import React from 'react';
import { Descriptions, Modal, Button, Table, message } from 'antd';
import axios from 'axios';
import { getListParams, orderDetail, cityListType, orderListState } from './type';
import { antiURL } from '../../config'
import styles from './index.less';

interface Prop {
  getOrderList: (params: getListParams) => void;
  params: getListParams;
  cityList: cityListType;
  showDetail: boolean;
  faSetstate: (target: keyof orderListState, value: any) => void;
  userName: string;
  orderDetail: orderDetail;
  serachLoading: boolean;
}

const { post } = axios;

const confirmCheat = (order_id: string, user_name: string, getOrderList: (params: getListParams) => void, params: getListParams) => {
  Modal.confirm({
    title: '确认',
    content: '是否认定该订单作弊？',
    onOk: async () => {
      try {
        const res = await post(`${antiURL}/punish`, { order_id, user_name });
        if(res.data.data){
        const { msg } = res.data.data
        message.success({
          content: msg,
        });
        }
        else{
          message.error(res.data.errmsg)
        }
        getOrderList(params);
      } catch (err) {
        console.log(`操作失败：${err}`);
      }
    },
  });
};

const noTakeCar = (order_id: string, user_name: string, getOrderList: (params: getListParams) => void, params: getListParams) => {
  Modal.confirm({
    title: '确认',
    content: '是否认定该订单未上车？',
    onOk: async () => {
      try {
        const res = await post(`${antiURL}/punish_no_progress`, { order_id, user_name });
        if(res.data.data){
        const { msg } = res.data.data
        message.success({
          content: msg,
        });
      }
        else{
          message.error(res.data.errmsg)
        }
        getOrderList(params);
      } catch (err) {
        console.log(`操作失败：${err}`);
      }
    },
  });
};

const applyPass = async (order_id: string, user_name: string, getOrderList: (params: getListParams) => void, params: getListParams) => {
  try {
    const { msg } = await post(`${antiURL}/appeal`, { order_id, user_name });
    Modal.success({
      content: msg,
    });
    getOrderList(params);
  } catch (err) {
    console.log(`操作失败：${err}`);
  }
};

export default ({
  getOrderList,
  params,
  cityList,
  showDetail,
  faSetstate,
  userName,
  serachLoading,
  orderDetail: { order_id, driver_phone, driver_id, passenger_phone, passenger_id, begun_time, assign_time, finished_time, cheat_status, area, to_area, starting_name, dest_name, total_fee, actual_pay_fee, basic_fee, anti_spam_stg, pay_details = [], punitive_details = [] },
}: Prop) => {
  const cheatStatus = ['未作弊', '未处置', '已处置', '申诉成功', '撤销', '申诉失败'];
  const punitiveType = ['', '扣钱', '封禁', '警告'];
  const punitiveStatus = ['', '已处置', '已撤销'];
  return (
    <Modal
      className={styles.antiCheatOrderDetailModal}
      visible={showDetail}
      width={1000}
      onCancel={() => faSetstate('showDetail', false)}
      maskClosable={false}
      footer={
        <div
          style={{
            display: 'flex',
            padding: '0 14px',
          }}
        >
          <Button>
            <a target="_blank" href={`http://zuji.intra.hongyibo.com.cn/#/order/${order_id}`}>
              听音
            </a>
          </Button>
          <Button>
            <a target="_blank" href={`http://kefu.hongyibo.com.cn/page/hotLine#/toolMainSite?activeTab=orderInfo&orderId=${order_id}&orderBusinessType=78&orderArea=${area}`}>
              轨迹查询
            </a>
          </Button>
          <Button
            style={{
              marginLeft: 'auto',
            }}
            onClick={() => faSetstate('showDetail', false)}
            type="primary"
          >
            确认
          </Button>
        </div>
      }
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridColumnGap: '20px',
        }}
      >
        <Descriptions title="司机信息" bordered>
          <Descriptions.Item label="司机ID">{driver_id || ''}</Descriptions.Item>
          <Descriptions.Item label="司机手机号">{driver_phone || ''}</Descriptions.Item>
        </Descriptions>
        <Descriptions title="乘客信息" bordered>
          <Descriptions.Item label="乘客ID">{passenger_id || ''}</Descriptions.Item>
          <Descriptions.Item label="乘客手机号">{passenger_phone || ''}</Descriptions.Item>
        </Descriptions>
      </div>
      <Descriptions title="行程信息" bordered column={2}>
        <Descriptions.Item label="订单ID">{order_id || ''}</Descriptions.Item>
        <Descriptions.Item label="出发城市">{cityList[area] || ''}</Descriptions.Item>
        <Descriptions.Item label="订单指派时间">{assign_time || ''}</Descriptions.Item>
        <Descriptions.Item label="出发地点">{starting_name || ''}</Descriptions.Item>
        <Descriptions.Item label="订单开始时间">{begun_time || ''}</Descriptions.Item>
        <Descriptions.Item label="到达城市">{cityList[to_area] || ''}</Descriptions.Item>
        <Descriptions.Item label="订单完成时间">{finished_time || ''}</Descriptions.Item>
        <Descriptions.Item label="到达地点">{dest_name || ''}</Descriptions.Item>
      </Descriptions>

      <Descriptions title="费用信息" bordered column={3} className="threeLine">
        <Descriptions.Item label="乘客实付金额(元)">{typeof actual_pay_fee === 'number' ? actual_pay_fee / 100 : ''}</Descriptions.Item>
        <Descriptions.Item label="司机实收金额(元)">{typeof basic_fee === 'number' ? basic_fee / 100 : ''}</Descriptions.Item>
        <Descriptions.Item label="订单总费用(元)">{typeof total_fee === 'number' ? total_fee / 100 : ''}</Descriptions.Item>
      </Descriptions>
      {pay_details && pay_details.length ? (
        <Table
          rowKey={(val) => val.channel}
          dataSource={pay_details}
          columns={[
            {
              title: '通道',
              dataIndex: 'channel',
              align: 'center',
            },
            {
              title: '渠道名称',
              dataIndex: 'channel_name',
              align: 'center',
            },
            {
              title: '渠道付款金额(元)',
              dataIndex: 'cost',
              align: 'center',
              render: (val) => val / 100,
            },
            {
              title: '优惠券码',
              dataIndex: 'coupon_id',
              align: 'center',
            },
          ]}
          pagination={false}
        />
      ) : null}
      <Descriptions title="反作弊判定" bordered column={2} className="twoLine">
        <Descriptions.Item label="作弊状态">{cheatStatus[cheat_status] || ''}</Descriptions.Item>
        <Descriptions.Item label="命中反作弊策略名称">{anti_spam_stg || ''}</Descriptions.Item>
      </Descriptions>
      {punitive_details && punitive_details.length ? (
        <Table
          rowKey={(val) => `${val.effective_date}${val.end_date}${val.revert_date}`}
          dataSource={punitive_details}
          columns={[
            {
              title: '处罚方式',
              dataIndex: 'punitive_type',
              align: 'center',
              render: (val) => punitiveType[val],
            },
            {
              title: '状态',
              dataIndex: 'status',
              align: 'center',
              render: (val) => punitiveStatus[val],
            },
            {
              title: '惩罚生效时间',
              dataIndex: 'effective_date',
              align: 'center',
            },
            {
              title: '惩罚结束时间',
              dataIndex: 'end_date',
              align: 'center',
            },
            {
              title: '申诉成功时间',
              dataIndex: 'revert_date',
              align: 'center',
            },
          ]}
          pagination={false}
          loading={serachLoading}
        />
      ) : null}
      <div
        style={{
          position: 'absolute',
          right: '80px',
          top: '44px',
        }}
      >
        <Button onClick={() => noTakeCar(order_id, userName, getOrderList, params)}>认定未上车</Button>
        <Button type="danger" style={{ margin: '0 20px' }} onClick={() => confirmCheat(order_id, userName, getOrderList, params)}>
          手工认定作弊
        </Button>
        {cheat_status && cheat_status === 2 ? (
          <Button type="primary" onClick={() => applyPass(order_id, userName, getOrderList, params)}>
            申诉通过
          </Button>
        ) : null}
      </div>
    </Modal>
  );
};
