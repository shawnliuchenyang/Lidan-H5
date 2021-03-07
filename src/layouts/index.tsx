import React from 'react';
import styles from './index.less';
import { NavBar } from '../components/Navbar';
import { TitleBar } from '../components/TitleBar';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import Utils from '@/utils/common';

moment.locale('zh-cn')
const BasicLayout: React.FC = props => {
  
  return (
    <div id="app" className={styles.container}>
       <ConfigProvider locale={zhCN}> 
        <NavBar/>
        <div className={`${styles.rightContainer}`}>{props.children}</div>
        </ConfigProvider>
    </div>
  );
};

export default BasicLayout;
