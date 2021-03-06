import React, { FC, useEffect, useState } from 'react';
import styles from './styles.less'
import { Button, InputNumber, Input, Radio, Select, message, Spin, DatePicker, Tooltip, Checkbox, Form} from 'antd'
import router from 'umi/router';
import { createBaseinfo, getMeetingDetail } from '@/service/cargoDetail'
import { encodeData, SKUConfig }  from './utils'
import  WangEditor  from '@/components/WangEditor'
import Utils from '@/utils/common';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { username } = Utils.Json2Obj(Utils.getCookie('userInfo'));
const dateFormat = 'YYYY-MM-DD HH:mm:ss'

type IProps = {
  location: any
}

const Cargo: FC<IProps> = (props) => {

  const [form] = Form.useForm();
  const [loading, setloading] = useState(false);
  const [mode, setmode] = useState("");
  const [type, settype] = useState(1);
  const [meetInfo, setMeetInfo] = useState({});

  const refInput = React.useRef(null);

  useEffect(() => {
      const { query } = props.location
      const asyncOperate = async() => {
        setloading(true)
        if(query.type !== "create"){
          const res  = await getMeetingDetail({meetingId:query.id})
          if(res && res.returncode === 0){
          let data = JSON.parse(JSON.stringify(res))      
          const { data : { baseInfo } } = data
          baseInfo.beginTime = moment(baseInfo.beginTime, dateFormat)
          baseInfo.endTime = moment(baseInfo.endTime, dateFormat)
          form.setFieldsValue(baseInfo)
        }
        }
        setloading(false)
      }
      asyncOperate()

      setmode(query.type)
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
    data.beginTime =  moment(data.beginTime).format(dateFormat)
    data.endTime =  moment(data.endTime).format(dateFormat)
    const { location } = props

      try {
        if(mode === "edit"){
          const { query } = props.location
          data.id = query.id
          const res = await createBaseinfo(data)
          if(res.returncode === 0){
            message.success("????????????")
            // back()
          }
        }
        else{
        const res = await createBaseinfo(data)
        if(res.returncode === 0){
          message.success("????????????")
          // back()
        }
      }
      }catch(err){
        message.error(err)
      }
  }

  const onChange = (e:any, type:string) => {
    if(type == "meet1"){
      setMeetInfo(e)
    }
  }

    return (
      <div className={styles.container}>
        <Spin spinning={loading}>
        <div className={styles.header}>
          <div className={styles.brumbs}>????????????</div>
        </div>
        <div className={styles.body}>
        <Form 
        form={form} 
      >

        <Form.Item label="????????????" name="meetingName" rules={[{ required: true}]}>
            <Input 
              placeholder="?????????????????????"
            />
        </Form.Item>

        <Form.Item label="???????????????" name="sponsor" rules={[{ required: true}]}>
            <Input 
              placeholder="????????????????????????"
            />
        </Form.Item>

        <Form.Item label="????????????" name="address" rules={[{ required: true}]}>
            <Input 
              placeholder="?????????????????????"
            />
        </Form.Item>

        <Form.Item label="??????????????????" name="beginTime" rules={[{ required: true}]}>
          <DatePicker 
            showTime={{ format:'HH:mm:ss'}}
            />
        </Form.Item>

        <Form.Item label="??????????????????" name="endTime" rules={[{ required: true}]}>
          <DatePicker 
            showTime={{ format:'HH:mm:ss'}}
            />
        </Form.Item>
        <Form.Item label="??????????????????" name="layoutColumns" rules={[{ required: true}]}>
          <InputNumber
            min={1}
            />
        </Form.Item>

        </Form>

        <div>

        </div>
          <div className={styles.btnGroup}>
             <Button onClick={back} className={styles.cancel}>??????</Button>
             <Button onClick={submit} className={styles.submit} type="primary">??????</Button>
          </div>
        </div>
        </Spin>
      </div>
    )
}

export default Cargo
