import React from 'react';
import { Menu, Icon, Modal, message, Input } from 'antd';
import styles from './index.less'
import router from 'umi/router';
import {
  MailOutlined,
  CalendarOutlined,
  AppstoreOutlined,
  SettingOutlined,
  LinkOutlined,
} from '@ant-design/icons';



type IState = {
  visible: boolean
  openKeys: string
  selectedKeys: string
}
export class TitleBar extends React.Component<IState>{

  state = {
    visible: false,
    openKeys: "",
    selectedKeys: ""
  }

  handleClick = (e:any) => {
    router.push(e.key)
  } 

  render(){
  return (
    <div className={styles.titleBar}>

      </div>
    )
  }
};
