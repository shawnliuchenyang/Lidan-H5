import React, { FC, useEffect, useState } from 'react';
import styles from './styles.less'
import { Button, Table, Input, Select, Modal, message, Radio, Spin, DatePicker, Form, Col, Row} from 'antd'
import router from 'umi/router';
import Calendar from '@/components/CalendarContent';
import 'react-calendar/dist/Calendar.css';
import Utils from '@/utils/common';

const { RangePicker } = DatePicker;

const { username } = Utils.Json2Obj(Utils.getCookie('userInfo'));

const { Option } = Select

const dateFormat = 'YYYY-MM-DD HH:mm:ss'

const Cargo: FC = () => {

  const [form] = Form.useForm();

  useEffect(() => {
  }, []);


    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.brumbs}>日程安排</div>
        </div>
        <div className={styles.body}>
            <Calendar/>
       </div>
      </div>
    )
}

export default Cargo
