import { IConfig } from 'umi-types';
// ref: https://umijs.org/config/
const config: IConfig =  {
  treeShaking: true,
  history: 'hash',
  routes: [
    {
      path: '/meetingCenter',
      title: '会议首页',
      component: './meetingCenter',
    },
    {
      path: '/meetingModule',
      title: '会议模块',
      component: './meetingModule',
    },
    {
      path: '/login',
      title: '登录页',
      component: './login',
    },
    {
      path: '/',
      component: '../layouts/index',
      routes: [
        {
          path: '/',
          redirect: './meetingCenter',
        },

        { path: '/center', component: '../pages/Center', title: '会议中心', favicon: 'https://cdn.wul.ai/file-analyze/logo.png' },
        { path: '/schedule', component: '../pages/Schedule', title: '日程安排' },
        { path: '/staff', component: '../pages/Staff', title: '人员管理' },
        { path: '/auth', component: '../pages/Auth', title: '权限管理' },
        { path: '/auth/account', component: '../pages/Auth/AccountDetail', title: '权限管理' },
        { path: '/eassy', component: '../pages/Eassy', title: '征文管理' },
        { path: '/activity', component: '../pages/Activity', title: '活动管理' },
        { path: '/activity/detail', component: '../pages/ActivityDetail', title: '活动详情' },
        { path: '/activity/banner', component: '../pages/ActivityBanner', title: '轮播图' },
        { path: '/activity/module', component: '../pages/ActivityModule', title: '活动模块' },
        { path: '/staff/detail', component: '../pages/StaffDetail', title: '人员详情' },
      ]
    }
  ],
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: false,
      dll: false,
      title: false,
      links: [
        { rel: 'icon', href: 'https://cdn.wul.ai/file-analyze/logo.png' },
      ],
      
      routes: {
        exclude: [
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,
          /components\//,
        ],
      },
    }],
  ],

  
proxy: {
  '/api/meet': {
      target: 'http://47.108.139.116/',
      'pathRewrite': { '^/api/meet' : '' },
      changeOrigin: true,
      logLevel: 'debug',
  },
},

  theme: {
    "@primary-blue": "#1f77f3",
    "@white": "#fff",
    "@black": "#000",
    "@shadow-gray": "#b3bdc5",
    "@normal-gray": "#687C8A",
    "@dark-gray": "#425B6D",
    "@background-gray": "#f5f7f7",
    "@uibot-blue": "#2249c0",
    "@red":"#ff3e27",
    "@green":"#00845f"
  },
  publicPath: '/H5/'
}

export default config;
