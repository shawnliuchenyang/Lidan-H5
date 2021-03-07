import React, { FC, useEffect, useState } from 'react';
import styles from './styles.less'
import { Button, Table, Input, Select, Modal, message, Radio, Spin, DatePicker, Form, Col, Row} from 'antd'
import router from 'umi/router';
import { creatUser } from '@/service/Auth'
import Utils from '@/utils/common';

const { RangePicker } = DatePicker;

const { username } = Utils.Json2Obj(Utils.getCookie('userInfo'));

const { Option } = Select

const Auth: FC = (props) => {
  const [form] = Form.useForm();

  useEffect(() => {
  }, []);

  const back = () => {
    router.goBack()
  }

  const submit = async() => {
    let data = form.getFieldsValue()
    const values = await form.validateFields();
    if(!values){
      return
    }
      try {
          const { query } = props.location
          data.id = query.id
          const res = await creatUser(data)
          if(res.returncode === 0){
            message.success("创建成功")
            // back()
          }
      }catch(err){
        message.error(err)
      }
  }

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.brumbs}>创建账号</div>
        </div>
        <div className={styles.body}>
        <Form 
        form={form} 
      >

        <Form.Item label="账号" name="accountId" rules={[{ required: true}]}>
            <Input 
              placeholder="登陆账号"
            />
        </Form.Item>

        <Form.Item label="密码" name="passWord" rules={[{ required: true}]}>
            <Input 
              placeholder="登陆密码"
            />
        </Form.Item>

        <Form.Item label="手机号" name="mobile" rules={[{ required: true}]}>
            <Input 
              placeholder="用户手机号"
            />
        </Form.Item>

        <Form.Item label="角色" name="roleId" rules={[{ required: true}]}>
        <Select placeholder="角色">
            <Option key="0" value="0">管理员</Option>
            <Option key="1" value="1">普通用户</Option>
          </Select>
        </Form.Item>

        <Form.Item label="用户名" name="userName" rules={[{ required: true}]}>
        <Input 
              placeholder="用户名"
            />
        </Form.Item>

        {/* {hasSKUitems(type, "third_sku_id")?
          <Form.Item label="中台卡批次ID" name="third_sku_id" rules={[{ required: true}]}>
            <Input 
              disabled={edit || check}
              placeholder="请输入ID"
              onBlur={() => judgeCardInfo(false)}
            />
          </Form.Item>
        : null} */}

        </Form>

        <div className={styles.btnGroup}>
             <Button onClick={back} className={styles.cancel}>返回</Button>
             <Button onClick={submit} className={styles.submit} type="primary">保存</Button>
          </div>
       </div>
      </div>
    )
}

export default Auth
