import React, { FC, useEffect, useState } from 'react';
import styles from './styles.less'
import { Button, InputNumber, Input, Radio, Select, message, Spin,  Form, Space, Divider} from 'antd'
import router from 'umi/router';
import { saveModule, getMeetingDetail } from '@/service/cargoDetail'
import  WangEditor  from '@/components/WangEditor'
import  ImgUploader  from '@/components/img-uploader'
import Utils from '@/utils/common';
import { baseURL } from '@/config'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select

const moduleType = [
  {
    key: 1,
    desc: "富文本"
  },
  {
    key: 2,
    desc: "链接"
  },
]

type IProps = {
  location: any
}

const ActivityBanner: FC<IProps> = (props) => {

  const [form] = Form.useForm();
  const [loading, setloading] = useState(false);
  const [mode, setmode] = useState(true);
  const [type, settype] = useState(1);
  const [moduleInfo, setmoduleInfo] = useState([]);

  const refInput = React.useRef(null);

  useEffect(() => {
      const { query } = props.location
      const asyncOperate = async() => {
        setloading(true)
          const res  = await getMeetingDetail({meetingId:query.id})
          if(res && res.returncode === 0){
          let data = JSON.parse(JSON.stringify(res))      
          const { data : { expandInfo } } = data
          if(expandInfo.length){
            setmoduleInfo(expandInfo)
            form.setFieldsValue({modelList:expandInfo})
          }
        }
        setloading(false)
      }
      asyncOperate()

      // setmode(query.type)
  }, []);

  const back = () => {
    router.goBack()
  }

  const handleChange = (e:any, name:number, key:string) => {
    console.log('e',e)
    console.log('name',name)
    console.log('key',key)
    setmode(!mode)
  }

  const onFinish = async(data:any) => {
    console.log(data)
    const { query } = props.location
    const valid = await form.validateFields();
    if(!valid){
      return
    }
    try {
      const params = {
        modelList:data.modelList,
        meetingId: query.id
      }
      const res = await saveModule(params)
      if(res.returncode === 0){
        message.success(`成功编辑${res.data.successTotal}个模块` )
        if(res.data.failTotal){
          message.error(`失败${res.data.failTotal}个模块` )
        }
        // back()
      }
    }catch(err){
      message.error(err)
    }
  };
  const formData = form.getFieldsValue()

    return (
      <div className={styles.container}>
        <Spin spinning={loading}>
        <div className={styles.header}>
          <div className={styles.brumbs}>会议模块编辑</div>
        </div>
        <div className={styles.body}>
          <div>
          {/* {moduleInfo.map((item, index) => (
            renderModule(item, index)
          ))} */}
                  <Form 
        name="dynamic_form_nest_item" 
        onFinish={onFinish}
        autoComplete="off" 
        form={form} 
        >
      <Form.List name="modelList">
        {(fields, { add, remove }) => {
          return(
          <>
            {fields.map(field => (
              <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item
                  {...field}
                  label="模块名称"
                  name={[field.name, 'title']}
                  fieldKey={[field.fieldKey, 'title']}
                  rules={[{ required: true }]}
                >
                  <Input placeholder="请输入模块名称" />
                </Form.Item>
                <Form.Item
                  {...field}
                  label="模块描述"
                  name={[field.name, 'modelDesc']}
                  fieldKey={[field.fieldKey, 'modelDesc']}
                  rules={[{ required: true }]}
                >
                  <Input placeholder="请输入模块描述" />
                </Form.Item>
                <Form.Item
                  {...field}
                  label="模块标题图片"
                  name={[field.name, 'icon']}
                  fieldKey={[field.fieldKey, 'icon']}
                  rules={[{ required: true }]}
                >
                  <ImgUploader 
                    title='模块标题图片'
                    action={`${baseURL}/meeting-service/api/inner/img/fileUpload`}
                    filePath='download_url'
                    imgFormat={['png', 'jpg']}
                    showRemoveIcon={true}
                    name={'files'}
                    imgUploaderTitle='点击上传图片'
                    imgSizeInfo= {'支持png, gif格式的图片，大小须为50px*50px'}
                    imgWidth={50}
                    imgHeight={50}
                    zoom={0.2}
                  />
                </Form.Item>
                <Form.Item
                  {...field}
                  label="模块类型"
                  name={[field.name, 'dataType']}
                  fieldKey={[field.fieldKey, 'dataType']}
                  rules={[{ required: true }]}
                >
                <Select 
                    onChange={e => {handleChange(e, field.name, field.fieldKey)}}
                    >
                        <Option key={1} value={1}>{"富文本"}</Option>
                        <Option key={2} value={2}>{"链接"}</Option>
                  </Select>
                </Form.Item>
                {formData.modelList&&formData.modelList[field.fieldKey]&& formData.modelList[field.fieldKey].dataType == 2?<Form.Item
                  {...field}
                  label="直播链接"
                  name={[field.name, 'modelData']}
                  fieldKey={[field.fieldKey, 'modelData']}
                  rules={[{ required: true }]}
                >
                  <Input placeholder="请输入直播跳转链接" />
                </Form.Item>:null}

                {formData.modelList&&formData.modelList[field.fieldKey]&& formData.modelList[field.fieldKey].dataType == 1?<Form.Item
                  {...field}
                  label="页面富文本"
                  name={[field.name, 'modelData']}
                  fieldKey={[field.fieldKey, 'modelData']}
                >
                  <WangEditor 
                    editorid={field.fieldKey}
                    />
                </Form.Item>:null}
                <a onClick={() => remove(field.name)}><MinusCircleOutlined/>&nbsp;取消模块</a>
                <Divider />
              </Space>
            ))}
            <Form.Item>
              <Button style={{width: "200px"}} type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                新增模块
              </Button>
            </Form.Item>
          </>
          )
      }}
      </Form.List>
      <Form.Item>
      <Button onClick={back} className={styles.cancel}>返回</Button>
        <Button type="primary" htmlType="submit">
          保存
        </Button>
      </Form.Item>
    </Form>
          </div>
        </div>
        </Spin>
      </div>
    )
}

export default ActivityBanner

// import React, { FC, useEffect, useState } from 'react';
// import styles from './styles.less'
// import { Button, InputNumber, Input, Radio, Select, message, Spin, DatePicker, Tooltip, Checkbox, Form, Space, Divider} from 'antd'
// import router from 'umi/router';
// import { saveModule, getMeetingDetail } from '@/service/cargoDetail'
// import  WangEditor  from '@/components/WangEditor'
// import  ImgUploader  from '@/components/img-uploader'
// import Utils from '@/utils/common';

// type IProps = {
//   location: any
// }

// const ActivityBanner: FC<IProps> = (props) => {
//   const moduleMaps = [
//     {
//       modelType:0,
//       title:"会议信息",
//       modelData: ""
//     },
//     {
//       modelType:1,
//       title:"组织机构",
//       modelData: ""
//     },
//     {
//       modelType:2,
//       title:"大咖齐聚",
//       modelData: ""
//     },
//     {
//       modelType:3,
//       title:"日程一览",
//       modelData: ""
//     },
//     {
//       modelType:4,
//       title:"直播回放",
//       modelData: ""
//     },
//     {
//       modelType:5,
//       title:"往期风采",
//       modelData: ""
//     },
//     {
//       modelType:6,
//       title:"参展企业",
//       modelData: ""
//     },
//     {
//       modelType:7,
//       title:"联系我们",
//       modelData: ""
//     },
//     {
//       modelType:8,
//       title:"视频回放",
//       modelData: ""
//     },
//   ]

//   const [form] = Form.useForm();
//   const [loading, setloading] = useState(false);
//   const [mode, setmode] = useState("");
//   const [type, settype] = useState(1);
//   const [moduleInfo, setmoduleInfo] = useState([]);

//   const refInput = React.useRef(null);

  // useEffect(() => {
  //   // setmoduleInfo(moduleMaps)
  //     const { query } = props.location
  //     const asyncOperate = async() => {
  //       setloading(true)
  //         const res  = await getMeetingDetail({meetingId:query.id})
  //         if(res && res.returncode === 0){
  //         let data = JSON.parse(JSON.stringify(res))      
  //         const { data : { expandInfo } } = data
  //         if(expandInfo.length){
  //           expandInfo.forEach(item => {
  //             const { modelType } = item
  //             const index = moduleMaps.findIndex(item => (item.modelType ==modelType))
  //             moduleMaps[index] = item 
  //           })
  //           setmoduleInfo(moduleMaps)
  //         }
  //         else{
  //           setmoduleInfo(moduleMaps)
  //         }
  //       }
  //       setloading(false)
  //     }
  //     asyncOperate()

  //     // setmode(query.type)
  // }, []);

//   const back = () => {
//     router.goBack()
//   }

//   const changeValue = (e:any, id:number) => {
//     const newInfo = moduleInfo
//     const key = Number(id)
//     newInfo[key].modelData = e
//     setmoduleInfo(newInfo)
//   }

//   const renderModule = (item:any, index: number) => {
//     const { modelType, modelData } = item
//     const module = moduleMaps.find(item => (item.modelType == modelType))
//     const title = module.title
//       return (
//         <div>
//           <div className={styles.moduleTitle}>模块设置-{title}</div>
//           {modelType == 4?
//             <Input 
//                 placeholder="请输入直播链接"
//                 // value={item.modelData}
//                 onChange={(e) => changeValue(e.target.value, modelType)}
//               />:null
//           }
//           {
//             modelType !== 4?
//               <WangEditor 
//               value={modelData}
//               editorid={item.modelType}
//               onChange={changeValue}
//                 />:null
//           }
//           <Divider/>
//         </div>
//       )
//   }

  // const submit = async() => {
  //     try {
  //         const { query } = props.location
  //         const newInfo = moduleInfo.map(item => {
  //           return {
  //             ...item,
  //             isDel: 0,
  //           }
  //         })
  //         const params = {
  //           meetingId: query.id,
  //           modelList: newInfo
  //         }
  //         const res = await saveModule(params)
  //         if(res.returncode === 0){
  //           message.success(`成功编辑${res.data.successTotal}个模块` )
  //           if(res.data.failTotal){
  //             message.error(`失败${res.data.failTotal}个模块` )
  //           }
  //           // back()
  //         }
  //     }catch(err){
  //       message.error(err)
  //     }
  // }

//     return (
//       <div className={styles.container}>
//         <Spin spinning={loading}>
//         <div className={styles.header}>
//           <div className={styles.brumbs}>会议模块编辑</div>
//         </div>
//         <div className={styles.body}>
//           <div>
//           {moduleInfo.map((item, index) => (
//             renderModule(item, index)
//           ))}
//           </div>
//         <div>
//         </div>
//           <div className={styles.btnGroup}>
//              <Button onClick={back} className={styles.cancel}>返回</Button>
//              <Button onClick={submit} className={styles.submit} type="primary">保存</Button>
//           </div>
//         </div>
//         </Spin>
//       </div>
//     )
// }

// export default ActivityBanner
