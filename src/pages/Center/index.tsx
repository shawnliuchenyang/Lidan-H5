import React, { FC, useEffect, useState } from 'react';
import styles from './styles.less'
import { Button, Table, Input, Select, Modal, message, Radio, Spin, DatePicker, Form, Col, Row} from 'antd'
import * as echarts from 'echarts';
import Utils from '@/utils/common';

const { RangePicker } = DatePicker;

const { username } = Utils.Json2Obj(Utils.getCookie('userInfo'));

const { Option } = Select

const Cargo: FC = () => {

  const [form] = Form.useForm();




  useEffect(() => {
    const myChart = echarts.init(document.getElementById('main'));
    const myChart2 = echarts.init(document.getElementById('main2'));
    const option = {
      tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
          data: ['已报名', '未报名', '已缴费', '未缴费']
      },
      series: [
          {
              name: '会议活动',
              type: 'pie',
              selectedMode: 'single',
              radius: [0, '30%'],
              label: {
                  position: 'inner',
                  fontSize: 14,
              },
              labelLine: {
                  show: false
              },
              data: [
                  {value: 775, name: '已报名'},
                  {value: 679, name: '未报名', selected: true}
              ]
          },
          {
              name: '会议活动',
              type: 'pie',
              radius: ['45%', '60%'],
              labelLine: {
                  length: 30,
              },
              label: {
                  formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                  backgroundColor: '#F6F8FC',
                  borderColor: '#8C8D8E',
                  borderWidth: 1,
                  borderRadius: 4,
                  
                  rich: {
                      a: {
                          color: '#6E7079',
                          lineHeight: 22,
                          align: 'center'
                      },
                      hr: {
                          borderColor: '#8C8D8E',
                          width: '100%',
                          borderWidth: 1,
                          height: 0
                      },
                      b: {
                          color: '#4C5058',
                          fontSize: 14,
                          fontWeight: 'bold',
                          lineHeight: 33
                      },
                      per: {
                          color: '#fff',
                          backgroundColor: '#4C5058',
                          padding: [3, 4],
                          borderRadius: 4
                      }
                  }
              },
              data: [
                  {value: 310, name: '已缴费'},
                  {value: 234, name: '未缴费'},
              ]
          }
      ]
  };

  const option2 = {
    title: {
        text: '最新会议报名人数'
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: ['会议一', '会议二', '会议三']
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['2021/1/1', '2021/1/2', '2021/1/3', '2021/1/4', '2021/1/5', '2021/1/6', '2021/1/7']
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            name: '会议一',
            type: 'line',
            stack: '总量',
            data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
            name: '会议二',
            type: 'line',
            stack: '总量',
            data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
            name: '会议三',
            type: 'line',
            stack: '总量',
            data: [150, 232, 201, 154, 190, 330, 410]
        },
    ]
};
    myChart.setOption(option);
    myChart2.setOption(option2);
  }, []);

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.brumbs}>首页</div>
        </div>
          <div className={styles.body}>
        <h4 className={styles.title}>欢迎使用丽丹会务管理系统1.0.0版本</h4>
          <div className={styles.textField}>
          <p><span className={styles.order}>1.</span> 为解决会议组织承办方在会前、会中、会后的全方面需求</p>
          <p><span className={styles.order}>2.</span> 实现完整“会务管理系统”，实现会前、会中、会后的信息管理与智能化控制。</p>
          <p><span className={styles.order}>3.</span> 实现线上会议报名、日程一览、云直播、历史信息展示、线上缴费、消息通知等多元化功能。</p>
        </div>
        <div className={styles.notice}>最新活动资讯</div>
        <div className={styles.textField}>
          <p><span className={styles.order}>1.</span> XXX活动会议</p>
          <div id="main" style={{ width: '100%', height: 311 }} />
        </div>

        <div className={styles.notice}>最新报名数据</div>
        <div className={styles.textField}>
          <div id="main2" style={{ width: '100%', height: 311 }} />
        </div>
      </div>
        </div>
    )
}

export default Cargo
