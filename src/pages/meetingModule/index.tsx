import React, { FC, useEffect, useState } from 'react';
import styles from './styles.less'
import { Button, Table, Input, Select, Modal, message, Radio, Spin, DatePicker, Form, Col, Row} from 'antd'
import router from 'umi/router';
import { getMeeingInfo } from '@/service/meetingCenter'
import LO from "lodash"

const MeettingCenter: FC = (props) => {

  const [form] = Form.useForm();
  const [moduleInfo, setmoduleInfo] = useState([]);
  const [swiperItems, setswiperItems] = useState([]);

  useEffect(() => {
    getList()
  }, []);


  const getList = async(init?:boolean) => {
    const { query } = props.location
    try{
      const res = await getMeeingInfo({
        meetingId:query.conference_id
      })
      if(res.returncode === 0){
        console.log(res.result)
        const expandInfo = LO.get(res, "result.expandInfo",[])
        setmoduleInfo(expandInfo[query.index])
        }
      
    }catch(err){
      message.error(err)
    }
  }

  const goDetail = (index) => {
    const { query } = props.location
    const params = 
    {
      id: query.id,
      index,
    }
    router.push({
      pathname: '/meetingModule',
      query:params
    });
  }

  const renderTitle = () => (
  <div>123</div>
  )

    return (
      <div className={styles.container}>
        <div className={styles.body}>
        <div dangerouslySetInnerHTML={{__html: moduleInfo.modelData}}></div>
        </div>
      </div>
    )
}

export default MeettingCenter
