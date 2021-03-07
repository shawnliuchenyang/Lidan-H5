import React from 'react';
import { Modal, Table, message } from 'antd';
import axios from 'axios';
import { getListParams, banListData } from './type';
import { antiURL } from '../../config'

const { post } = axios;
interface Prop {
  getOrderList: (params: getListParams) => void;
  params: getListParams;
  userName: string;
  driverId: number;
  serachLoading: boolean;
  banList: banListData[];
}
export default ({ banList, userName, driverId, params, getOrderList, serachLoading }: Prop) => {
  const unBanDriver = async (case_id: string, punitive_id: string) => {
    try {
      const res = await post(`${antiURL}/release_driver`, {
        driver_id: driverId,
        user_name: userName,
        case_id,
        punitive_id,
      });
      if(res.data.data){
      const{ msg } = res.data.data
      message.info(msg);
      }        
      else{
        message.error(res.data.errmsg)
      }
      getOrderList(params);
    } catch (e) {
      message.error(e);
    }
  };

  const cancelRecord = (val: string, punitive_id: string) => {
    Modal.confirm({
      title: '是否确认撤销本条操作记录?',
      onOk: () => {
        unBanDriver(val, punitive_id);
      },
    });
  };

  return (
    <div>
      <Table
        dataSource={banList}
        rowKey={(val) => val.order_list}
        scroll={{
          y: document.body.offsetHeight - 320,
          scrollToFirstRowOnChange: true,
        }}
        columns={[
          {
            title: '订单ID',
            dataIndex: 'order_list',
            align: 'center',
          },
          {
            title: '封禁开始时间',
            dataIndex: 'start_date',
            align: 'center',
          },
          {
            title: '封禁天数',
            dataIndex: 'days',
            align: 'center',
            render: (val) => (val === 0 ? '永久' : val),
          },
          {
            title: '封禁方',
            dataIndex: 'ban_caller',
            align: 'center',
          },
          {
            title: '封禁方式',
            dataIndex: 'ban_strategy',
            align: 'center',
            render: (val) => {
              let result = '';
              switch (val) {
                case 1:
                  result = '梯度封禁';
                  break;
                case 2:
                  result = '人工封禁';
                  break;
                default:
                  break;
              }
              return result;
            },
          },
          {
            title: '封禁原因',
            dataIndex: 'reason',
            align: 'center',
          },
          {
            title: '操作',
            dataIndex: 'case_id',
            align: 'center',
            render: (val, { punitive_id }) =>
              val ? (
                <span
                  style={{ color: '#1890ff', cursor: 'pointer' }}
                  onClick={() => cancelRecord(val, punitive_id)}
                >
                  撤销
                </span>
              ) : (
                ''
              ),
          },
        ]}
        pagination={false}
        loading={serachLoading}
      />
    </div>
  );
};
