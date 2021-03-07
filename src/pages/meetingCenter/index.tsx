import React, { FC, useEffect, useState } from 'react';
import styles from './styles.less'
import { Button, Table, Input, Select, Modal, message, Radio, Spin, DatePicker, Form, Col, Row} from 'antd'
import router from 'umi/router';
import { getMeeingInfo } from '@/service/meetingCenter'
import ReactSwiper from 'reactjs-swiper';
import { Helmet } from "react-helmet";
import {
  HomeOutlined,
} from '@ant-design/icons';
import LO from "lodash"

const MeettingCenter: FC = (props) => {

  const [form] = Form.useForm();
  const [meetingInfo, setmeetingInfo] = useState([]);
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
        setmeetingInfo(res.result)
        const banner = LO.get(res.result, 'banner', [])
        const items = banner.map((item:any)=>{
          const swiperItems = {
            image: item.imgUrl
          }
          if(item.jumpUrl){
            swiperItems.link = item.jumpUrl
          }
          return swiperItems
        })

        setswiperItems(items)
        }
      
    }catch(err){
      message.error(err)
    }
  }

  const swiperOptions = {
    preloadImages: true,
    autoplay: 4000,
    autoplayDisableOnInteraction: false,
    showPagination: false
  };

  const goDetail = (index:number) => {
    const { query } = props.location
    const params = 
    {
      conference_id: query.conference_id,
      index,
    }
    router.push({
      pathname: '/meetingModule',
      query:params
    });
  }

  const goLink = (url:string) => {
    window.open(url, "_self")
  }

  const renderTitle = () => (
  <div className={styles.meetingTitle}>{LO.get(meetingInfo, "baseInfo.meetingName", "")}</div>
  )

  const renderSwiper = () => (
    <div className={styles.swiperField}>
      <ReactSwiper swiperOptions={swiperOptions} showPagination items={swiperItems}
      className="swiper-example" />
    </div>
  )

  const renderFooter = () => (
    <div className={styles.footer}>
      <Row>
        <Col span={12}>
          <div className={styles.footerItem}>
            <div>
            <HomeOutlined className={styles.footerIcon}/>
              <div>首页</div>
            </div>
          </div>
        </Col>
        <Col span={12}>
        <div className={styles.footerItem}>
          <div>
            <HomeOutlined className={styles.footerIcon}/>
            <div>我的</div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )

  const renderModules = () => {
    const expandInfo = LO.get(meetingInfo, 'expandInfo', [])
    return(
    <div className={styles.modulesField}>
      {
        expandInfo.map((item, index) => {
        const dataType = LO.get(item, "dataType", 1)
        if(dataType == 1){
          return(  
            <div className={styles.moudleItem} onClick={() => goDetail(index)}>
              <div className={styles.innerItem}>
              <img src={item.icon} className={styles.moduleImg}/>
              <div>{item.title}</div>
              </div>
            </div>
            )
        }
        if(dataType == 2){
          return(  
            <div className={styles.moudleItem} onClick={() => goLink(item.modelData)}>
              <div className={styles.innerItem}>
              <img src={item.icon} className={styles.moduleImg}/>
              <div>{item.title}</div>
              </div>
            </div>
            )
        }
        })
      }
    </div>
    )
  }

    return (
      <div className={styles.container}>
        <Helmet>
          <meta charSet="utf-8" />
            <title>{LO.get(meetingInfo, "baseInfo.meetingName", "")}</title>
        </Helmet>
        <div className={styles.body}>
          {renderTitle()}
          {renderSwiper()}
          {renderModules()}
        </div>
        {/* {renderFooter()} */}
      </div>
    )
}

export default MeettingCenter
