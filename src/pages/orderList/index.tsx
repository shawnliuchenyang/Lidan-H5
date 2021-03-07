import React, { PureComponent } from 'react';
import moment from 'moment';
import { Form, Input, DatePicker, Button, Table, message, Radio, Tabs, Descriptions } from 'antd';
import { ColumnProps } from 'antd/es/table';
import { FormInstance } from 'antd/es/form';
import { RadioChangeEvent } from 'antd/es/radio';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { defeatByFate } from '../../context';
import OrderDetail from './orderDetail';
import DriverInfo from './driverInfo';
import BanModal from './banModal';
import { reasonList, cityList } from '../../service/orderList'
import {
  orderListState,
  getListParams,
  cityListType,
  orderDetail,
  orderListData,
  driverInfoType,
  banListData,
} from './type';

import axios from 'axios';
import styles from './index.less';
import { antiURL } from '../../config'

const { get, post } = axios;
const { Item: FormItem } = Form;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const userName = defeatByFate;
const cheatStatus = ['未作弊', '未处置', '已处置', '申诉成功', '撤销'];

interface Prop extends RouteComponentProps {}
class OrderList extends PureComponent<Prop, orderListState> {
  state: orderListState = {
    serachLoading: false, // 查询过程中的按钮loading
    cityList: {},
    showDetail: false, // 是否显示详情页
    showBanModal: false, // 是否显示封禁司机模态框
    orderList: [],
    searchType: '订单ID', // 默认订单ID查询,
    driverInfo: {
      driver_id: 0,
    },
    temParams: {},
    banList: [], // 司机封禁列表
    banReasonList: [], // 司机封禁原因
    orderDetail: {
      order_id: '',
      cheat_status: 0,
      area: 0,
      to_area: 0,

      // order_id: 35209891143246,
      // driver_id: 580544630920528,
      // driver_phone: '00016003030',
      // passenger_id: 17594680693054,
      // passenger_phone: '00016003726',
      // area: 1,
      // to_area: 1,
      // assign_time: '2020-03-31 19:29:31',
      // begun_time: '2020-03-31 19:29:29',
      // finished_time: '2020-03-31 19:29:39',
      // starting_name: '融科智创（新橙海大厦A座）',
      // dest_name: '西二旗-地铁站',
      // cheat_status: 3,
      // anti_spam_stg: '人工认定',
      // total_fee: 2656,
      // basic_fee: 2656,
      // actual_pay_fee: 0,
      // pay_details: null,
      // punitive_details: [
      //   {
      //     punitive_type: 2,
      //     status: 2,
      //     effective_date: '2020-04-08 16:49:20',
      //     end_date: '0001-01-01',
      //     revert_date: '0001-01-01',
      //     extra_info:
      //       '{"handle":{"driver_id":580544630920528,"days":1,"level":1,"start_date":"2020-04-08 16:49:20","revert_date":"","resp":"{\\"action_errno\\":0,\\"case_id\\":\\"144115189331526920\\",\\"data\\":[{\\"data\\":{\\"expire_time\\":1586588811,\\"level\\":1,\\"start_time\\":1586502411,\\"status\\":1,\\"token\\":\\"72057631500413081\\"},\\"errmsg\\":\\"ok\\",\\"errno\\":0,\\"token\\":\\"72057631500413081\\"}],\\"err_action_index\\":0,\\"errmsg\\":\\"success\\",\\"errno\\":0,\\"internal_errmsg\\":\\"\\",\\"trace_id\\":\\"0a5680175e8d900f392ca339031bd502\\"}"},"revert":{"driver_id":580544630920528,"days":1,"level":1,"start_date":"2020-04-08 16:49:20","revert_date":"2020-04-08 18:15:15","resp":"{\\"action_errno\\":0,\\"case_id\\":\\"144115189331838241\\",\\"data\\":[{\\"data\\":{\\"expire_time\\":0,\\"level\\":0,\\"start_time\\":0,\\"status\\":0,\\"token\\":\\"72057631507723797\\"},\\"errmsg\\":\\"ok\\",\\"errno\\":0,\\"token\\":\\"72057631507723797\\"}],\\"err_action_index\\":0,\\"errmsg\\":\\"success\\",\\"errno\\":0,\\"internal_errmsg\\":\\"\\",\\"trace_id\\":\\"0a565b415e8da4335fffdcc0031c6302\\"}"}}',
      //   },
      // ],
    }, // 订单详情
  };

  formRef = React.createRef<FormInstance>();

  componentDidMount() {
    this.getCityList();
    this.getBanReason();
  }

  getCityList = async () => {
    try {
      const res = await cityList({});
      if(res.data){
        this.setState({ cityList: res.data})
      }
    } catch {}
  };

  getOrderList = async (params: getListParams) => {
    const realParams = {
      user_id: '',
      phone: '',
      order_id: '',
      start_date: moment().subtract(10, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      end_date: moment().format('YYYY-MM-DD HH:mm:ss'),
      page_size: 10,
      page_num: 1,
      is_cheat: 0,
      user_name: userName,
      ...params,
    };
    try {
      const res = await post(`${antiURL}/order_list`, realParams);
      if(res.data && res.data.data){
      const { details, driver_info } = res.data.data

      if(details && driver_info){
      this.setState({
        orderList: details,
        driverInfo: driver_info,
      });
    }
    else {
      message.error('暂无匹配项')
    }
      // FIXME: 这里有个问题，就是，在没有司机id的情况下，后端直接抛出错误了， 在tool/request就拦截住了，但，还有一种情况是无权限，待优化
      if (!details.length && !Object.keys(driver_info).length) {
        message.info('暂无匹配项');
      } else {
        const { driver_id } = driver_info;
        const res = await post(`${antiURL}/ban_list`, {
          driver_id,
          user_name: userName,
        });
        const { ban_list } = res.data.data
        if(ban_list){
        this.setState({
          banList: ban_list,
        });
      }
      }
    }
    else{
      message.error(res.data.errmsg)
    }
    } catch(err) {
      message.error(err)
    } finally {
      this.setState({ serachLoading: false });
    }
  };

  handleSubmit = (value: {
    number: string;
    time: moment.Moment[];
    onlyCheat: number;
    type: 'order_id' | 'phone' | 'user_id';
  }) => {
    const { number, time, onlyCheat, type } = value;
    this.setState({
      serachLoading: true,
    });
    const params: getListParams = {
      is_cheat: onlyCheat - 0,
      start_date: time[0].format('YYYY-MM-DD HH:mm:ss'),
      end_date: time[1].format('YYYY-MM-DD HH:mm:ss'),
    };
    params[type] = number;

    this.setState({
      temParams: params,
    });
    this.getOrderList(params);
  };

  handleSubmitFail = (error: any) => {
    console.log(error, 'fail');
  };

  returnTableColumns = () => {
    const { cityList } = this.state;
    return [
      {
        title: '订单号',
        dataIndex: 'order_id',
      },
      {
        title: '乘客ID',
        dataIndex: 'passenger_id',
      },
      {
        title: '作弊状态',
        dataIndex: 'cheat_status',
        render: (val: number) => cheatStatus[val],
        width: '90px',
        onFilter: (value: any, record: { cheat_status: any }) => record.cheat_status === value,
        filters: [
          {
            text: '未作弊',
            value: 0,
          },
          {
            text: '未处置',
            value: 1,
          },
          {
            text: '已处置',
            value: 2,
          },
          {
            text: '申诉成功',
            value: 3,
          },
          {
            text: '撤销',
            value: 4,
          },
          {
            text: '申诉失败',
            value: 5,
          },
        ],
      },
      {
        title: '命中反作弊策略',
        dataIndex: 'anti_spam_stg',
      },
      {
        title: '订单指派时间',
        dataIndex: 'assign_time',
        // @ts-ignore
        sorter: (a, b) => new Date(a.assign_time).getTime() - new Date(b.assign_time).getTime(),
      },
      {
        title: '订单开始时间',
        dataIndex: 'begun_time',
      },
      {
        title: '订单完成时间',
        dataIndex: 'finished_time',
      },
      {
        title: '出发城市',
        dataIndex: 'area',
        render: (val: string) => cityList[val],
        width: '80px',
      },
      {
        title: '到达城市',
        dataIndex: 'to_area',
        render: (val: string) => cityList[val],
        width: '80px',
      },
      {
        title: '操作',
        width: '70px',
        render: ({ order_id, assign_time }: orderListData) => (
          <span className={styles.jumpSpan} onClick={() => this.jumpToDetail(order_id, assign_time)}>
            查看详情
          </span>
        ),
      },
    ];
  };

  jumpToDetail = async (id: number, time: string) => {
    try {
      const res = await post(`${antiURL}/order_info`, {
        order_id: id,
        order_date: time.slice(0, 7),
        user_name: userName,
      });
      const orderDetail = res.data.data
      if(orderDetail){
      this.setState(
        {
          orderDetail,
        },
        () => {
          this.setState({
            showDetail: true,
          });
        }
      );
      }
      else{
        message.error(res.data.errmsg)
      }
    } catch {}
  };

  getBanReason = async () => {
    try {
      const res = await reasonList({});
      if(res.data){
      this.setState({ banReasonList: res.data });
      }
      else{
        this.setState({
          banReasonList: [
            '未坐车产生费用去尾处置',
            '司机收取不合理附加费去尾处置',
            '司机加价议价去尾处置',
          ],
        });
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
      this.setState({
        banReasonList: [
          '未坐车产生费用去尾处置',
          '司机收取不合理附加费去尾处置',
          '司机加价议价去尾处置',
        ],
      });
    }
  };

  changeSerachType = (val: RadioChangeEvent) => {
    const {
      target: { value },
    } = val;
    const { setFields, getFieldValue, getFieldError } = this.formRef.current as FormInstance;
    const number = getFieldValue('number');
    const error = getFieldError('number');
    const newField: {
      name: string;
      value: string;
      errors?: string[];
    } = {
      name: 'number',
      value: number,
    };
    const hasError = !!error.length;

    let target = '订单ID';
    switch (value) {
      case 'phone':
        target = '手机号';
        break;
      case 'user_id':
        target = '司机ID';
        break;
      case 'order_id':
      default:
        break;
    }
    if (hasError) {
      if (number) {
        newField.errors = [`${target}只能包含数字`];
      } else {
        newField.errors = [`${target}为必填项`];
      }
    }
    this.setState({
      searchType: target,
    });
    setFields([newField]);
  };

  returnForm = (hasData: boolean) => {
    const { serachLoading, searchType } = this.state;
    return (
      <Form
        ref={this.formRef}
        // @ts-ignore
        onFinish={this.handleSubmit}
        onFinishFailed={this.handleSubmitFail}
        className={`${styles.olForm} ${hasData ? '' : styles.noData}`}
        initialValues={{
          time: [moment().subtract(10, 'day').startOf('day'), moment()],
          onlyCheat: '0',
          type: 'order_id',
        }}
      >
        <FormItem label="查询方式" name="type" className={styles.typeForm}>
          <Radio.Group onChange={this.changeSerachType}>
            <Radio value="order_id">订单ID</Radio>
            <Radio value="user_id">司机ID</Radio>
            <Radio value="phone">手机号</Radio>
          </Radio.Group>
        </FormItem>
        <FormItem name="onlyCheat" label="查询条件" className={styles.radioForm}>
          <Radio.Group>
            <Radio value="0">查看全部</Radio>
            <Radio value="1">只看作弊</Radio>
          </Radio.Group>
        </FormItem>
        <FormItem
          label="查询参数"
          name="number"
          className={styles.numberForm}
          rules={[
            { pattern: /^\d*$/, message: `${searchType}只能包含数字` },
            { required: true, message: `${searchType}为必填项` },
          ]}
        >
          <Input placeholder={`请输入${searchType}`} autoComplete="off" />
        </FormItem>
        <FormItem className={styles.timeForm} label="时间范围" name="time">
          <RangePicker showTime allowClear={false} />
        </FormItem>
        <div className={styles.buttonControl}>
          <Button type="primary" htmlType="submit" loading={serachLoading}>
            {serachLoading ? '' : '开始查询'}
          </Button>
        </div>
      </Form>
    );
  };
  changeState = (key: keyof orderListState, value: any) => {
    this.setState({
      [key]: value,
    } as orderListState);
  };

  returnTabs = (hasData: boolean) => {
    const {
      driverInfo: { driver_id, phone, score, ban_status, ban_start_date, ban_end_date },
      banList,
      serachLoading,
      temParams,
    } = this.state;
    let nowStatus;
    if (ban_status === 1) {
      nowStatus = '封禁中';
    } else if (ban_status === 2) {
      nowStatus = '永久封禁';
    } else {
      nowStatus = '正常';
    }
    return (
      <div className={`${styles.olTabs} ${hasData ? '' : styles.noData}`}>
        <div className={styles.descripDiv}>
          <Descriptions bordered>
            <Descriptions.Item label="司机ID">{driver_id}</Descriptions.Item>
            <Descriptions.Item label="手机号">{phone}</Descriptions.Item>
            <Descriptions.Item label="信用分">{score}</Descriptions.Item>
            <Descriptions.Item label="封禁状态">{nowStatus}</Descriptions.Item>
            <Descriptions.Item label="封禁开始时间">{ban_start_date}</Descriptions.Item>
            <Descriptions.Item label="封禁结束时间">{ban_end_date}</Descriptions.Item>
          </Descriptions>
          <Button
            type="danger"
            onClick={() => {
              this.setState({
                showBanModal: true,
              });
            }}
          >
            封禁司机
          </Button>
        </div>

        <Tabs defaultActiveKey="2">
          <TabPane tab="封禁记录" key="1">
            <DriverInfo
              serachLoading={serachLoading}
              params={temParams}
              getOrderList={this.getOrderList}
              banList={banList}
              userName={userName}
              driverId={driver_id}
            />
          </TabPane>
          <TabPane tab="订单记录" key="2">
            {this.returnTable(hasData)}
          </TabPane>
        </Tabs>
      </div>
    );
  };

  returnTable = (hasData: boolean) => {
    const { orderList, serachLoading } = this.state;
    return (
      <Table<orderListData>
        rowKey={(val) => val.order_id}
        scroll={{
          y: document.body.offsetHeight - 320,
          scrollToFirstRowOnChange: true,
        }}
        dataSource={orderList}
        columns={this.returnTableColumns()}
        className={`${styles.olTabs} ${hasData ? '' : styles.noData}`}
        pagination={false}
        loading={serachLoading}
      />
    );
  };

  render() {
    const {
      banReasonList,
      driverInfo,
      orderList,
      showDetail,
      orderDetail,
      cityList,
      temParams = {},
      showBanModal,
      serachLoading,
    } = this.state;
    const { driver_id } = driverInfo;

    const hasData = !!(orderList.length || Object.keys(driverInfo).length > 2);
    return (
      <div className={styles.ACOrderList}>
        {this.returnForm(hasData)}
        {this.returnTabs(hasData)}
        <BanModal
          getOrderList={this.getOrderList}
          banReasonList={banReasonList}
          params={temParams}
          driverId={driver_id}
          userName={userName}
          showModal={showBanModal}
          faSetstate={this.changeState}
        />
        <OrderDetail
          serachLoading={serachLoading}
          getOrderList={this.getOrderList}
          params={temParams}
          showDetail={showDetail}
          orderDetail={orderDetail}
          faSetstate={this.changeState}
          cityList={cityList}
          userName={userName}
        />
      </div>
    );
  }
}
export default withRouter(OrderList);
