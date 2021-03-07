import React, { FC, useEffect, useState } from 'react';
import styles from './styles.less'
import { Button, Table, Input, Select, Modal, message, Radio, Spin, DatePicker, Form, Col, Row} from 'antd'
import router from 'umi/router';
import { getMeeingInfo } from '@/service/meetingCenter'
import LO from "lodash"
import {Helmet} from "react-helmet";

const MeettingCenter: FC = (props) => {
  const [moduleInfo, setmoduleInfo] = useState([]);
  const [meetingInfo, setmeetingInfo] = useState([]);

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
        setmeetingInfo(res.result)
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
        <Helmet>
          <meta charSet="utf-8" />
            <title>{LO.get(meetingInfo, "baseInfo.meetingName", "")}</title>
        </Helmet>
        <div className={styles.body}>
        <div dangerouslySetInnerHTML={{__html: moduleInfo.modelData}}></div>
        </div>
      </div>
    )
}

export default MeettingCenter
