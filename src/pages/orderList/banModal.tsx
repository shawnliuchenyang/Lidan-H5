import React, { useState } from 'react';
import { Input, InputNumber, Modal, message, Form, Select, Switch } from 'antd';
import axios from 'axios';
import { getListParams, orderListState } from './type';
import { antiURL } from '../../config'

const { post } = axios;
const { TextArea } = Input;
const { Option } = Select;

interface Prop {
  showModal: boolean;
  userName: string;
  driverId: number;
  faSetstate: (target: keyof orderListState, value: any) => void;
  params: getListParams;
  getOrderList: (params: getListParams) => void;
  banReasonList: string[];
}

export default ({
  banReasonList,
  showModal,
  faSetstate,
  userName,
  driverId,
  getOrderList,
  params,
}: Prop) => {
  const [form] = Form.useForm();
  const [currentType, setCurrentType] = useState('');
  const [banForever, setBanForever] = useState(false);
  const handleSubmit = async () => {
    try {
      const { dayNum, reasonType, reason, banForever } = await form.validateFields();
      const realReason = reasonType === 'else' ? reason : reasonType;
      const realDayNum = banForever ? -1 : dayNum;
      const res = await post(`${antiURL}/ban_driver`, {
        driver_id: driverId,
        days: realDayNum,
        user_name: userName,
        reason: realReason,
      });
      if(res.data.data){
      const { msg } = res.data.data
      faSetstate('showBanModal', false);
      faSetstate('serachLoading', true);
      getOrderList(params);
      
      message.success(msg);
      setBanForever(false);
      form.resetFields();
      }
      else{
        message.error(res.data.errmsg)
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };
  return (
    <Modal
      title="封禁司机"
      visible={showModal}
      onOk={handleSubmit}
      onCancel={() => faSetstate('showBanModal', false)}
      className="antiCheatBanDriverModal"
    >
      <Form form={form}>
        <Form.Item label="永久封禁" name="banForever" className="isBanForever">
          <Switch
            onChange={(val) => {
              setBanForever(val);
            }}
          />
        </Form.Item>
        {banForever ? null : (
          <Form.Item
            label="封禁天数"
            name="dayNum"
            rules={[{ required: true, message: '封禁天数为必填项' }]}
          >
            <InputNumber min={0} placeholder="请输入" />
          </Form.Item>
        )}

        <Form.Item
          label="封禁原因"
          name="reasonType"
          rules={[{ required: true, message: '封禁原因为必填项' }]}
          style={{ width: '100%', margin: '20px 0 0' }}
        >
          <Select placeholder="请选择封禁原因" onChange={(val) => setCurrentType(`${val}`)}>
            {banReasonList.map((val) => (
              <Option key={val} value={val}>
                {val}
              </Option>
            ))}
            <Option value="else">其他</Option>
          </Select>
        </Form.Item>
        {currentType === 'else' && (
          <Form.Item
            label=""
            name="reason"
            rules={[{ required: true, message: '封禁原因为必填项' }]}
            style={{ width: '100%', margin: '20px 0 0', paddingLeft: '81px' }}
          >
            <TextArea placeholder="请输入封禁原因" />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};
