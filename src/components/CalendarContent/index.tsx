import React, { FC, useEffect, useState } from 'react';
import { Menu, Modal, message, Input } from 'antd';
import styles from './index.less'
import router from 'umi/router';
import Calendar from 'react-calendar';
import moment from 'moment'
import { getActivityList } from '@/service/cargo'
import { createBaseinfo, getMeetingDetail, saveBanner } from '@/service/cargoDetail'

const CalendarContent: FC = (props) => {

  const dateFormat = 'YYYY-MM-DD'
  const [meetInfo, setMeetInfo] = useState({});
  const [loading, setloading] = useState(false);
  const [meetingList, setmeetingList] = useState([]);

  useEffect(() => {
    getList()
}, []);

const getList = async(init?:boolean) => {
  setloading(true)
  try{
    const res = await getActivityList({
      pageSize: 9999,
      pageIndex: 1
    })
    if(res.data){
      console.log(res.data)
      const noDelList = res.data.list.filter(item => !item.isDel)
      setmeetingList(noDelList)
    }
    
  }catch(err){
    message.error(err)
  }
  setloading(false)
}

  const onChange = (value) => {
    console.log('value', value)
  }

  const isDuringDate = (curDate, beginDateStr, endDateStr) => {
      const cur = new Date(curDate);
      const beginDate = moment(beginDateStr, dateFormat)
      const beginStr = moment(beginDate).format(dateFormat)
      const begin = new Date(beginStr)
      const endDate = moment(endDateStr, dateFormat)
      const endStr = moment(endDate).format(dateFormat)
      const end = new Date(endStr)
      // console.log('cur', cur.getDate())
      // console.log('beginStr', beginStr)
      // console.log('endDate', endDate)
    if (cur >= begin && cur <= end) {
        return true;
    }
    return false;
}

  const showTitleContent = ({ date, view }) => {
    const dateStr = moment(date).format(dateFormat)
    // console.log('dateStr', dateStr)
    let title = []
    let hasMeeting = false
    meetingList.map(item => {
      if(isDuringDate(dateStr, item.beginTime, item.endTime)){
        title.push(item.meetingName)
        hasMeeting = true
      }
    })
    
  return (<div className={`${styles.itemContent} ${hasMeeting?styles.meetingContent:""}`}>
      {title && title.length?title.map(item => (
        <div>{item}</div>
      )):"暂无活动"}
    </div>)
  }

    return (
        <div className={styles.calendar}>
          <div className={styles.title}>
            <span className={styles.calendarIcon}/>
            会议日程安排</div>
          <Calendar
            onChange={onChange}
            // value={new Date()}
            showNavigation={true}
            tileContent={showTitleContent}
        />
      </div>
    )
}

export default CalendarContent
