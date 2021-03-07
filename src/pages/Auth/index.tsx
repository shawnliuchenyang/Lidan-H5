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

const Auth: FC = () => {

  const [form] = Form.useForm();

  useEffect(() => {
  }, []);

  const goAccount = (item:any, type: string) => {
    router.push({
      pathname: '/auth/account',
    });
  }

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.brumbs}>权限管理</div>
        </div>
        <div className={styles.body}>
        <Button type="primary" onClick={goAccount}>新建账号</Button>
       </div>
      </div>
    )
}

export default Auth
