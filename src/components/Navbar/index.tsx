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
  LogoutOutlined
} from '@ant-design/icons';



type IState = {
  visible: boolean
  openKeys: string
  selectedKeys: string
}
export class NavBar extends React.Component<IState>{

  state = {
    visible: false,
    openKeys: "",
    selectedKeys: ""
  }

  handleClick = (e:any) => {
    router.push(e.key)
  } 

  logout = () => {
    sessionStorage.clear()
    router.push("/login")
  }

  render(){
  return (
    <div className={styles.nav}>
      <div className={styles.title}>
        力丹会务管理系统</div>
        <Menu
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
          theme="dark"
          onClick={(e) => {this.handleClick(e)}}
        >
          <Menu.Item key="/center" icon={<MailOutlined />}>
            <span>
              <span>首页</span>
            </span>
          </Menu.Item>
          <Menu.Item key="/activity" icon={<AppstoreOutlined />}>
          <span>
            <span>活动管理</span>
          </span>
          </Menu.Item>
          {/* <Menu.Item key="/staff" icon={<AppstoreOutlined />}>
          <span>
            <span>人员管理</span>
          </span>
          </Menu.Item> */}
          {/* <Menu.Item key="/essay"  icon={<SettingOutlined />}>
          <span>
            <span>征文管理</span>
          </span>
          </Menu.Item> */}
          <Menu.Item key="/auth" icon={<LinkOutlined />}>
          <span>
            <span>权限管理</span>
          </span>
          </Menu.Item>
          <Menu.Item key="/schedule"  icon={<CalendarOutlined />}>
          <span>
            <span>日程安排</span>
          </span>
          </Menu.Item>
          <Menu.Item key="/login" className={styles.logout} icon={<LogoutOutlined/>}>
            <span>退出登出</span>
        </Menu.Item>
        </Menu>
      </div>
    )
  }
};
