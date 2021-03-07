import React, { FC, useEffect, useState } from 'react';
import styles from './styles.less'
import { Button, InputNumber, Input, Radio, Select, message, Spin, DatePicker, Tooltip, Checkbox, Form, Space, Divider} from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import router from 'umi/router';
import { createBaseinfo, getMeetingDetail, saveBanner } from '@/service/cargoDetail'
import { encodeData, SKUConfig }  from './utils'
import  WangEditor  from '@/components/WangEditor'
import  ImgUploader  from '@/components/img-uploader'
import Utils from '@/utils/common';
import moment from 'moment';
import { baseURL } from '@/config'

const { Option } = Select;
const { RangePicker } = DatePicker;
const { username } = Utils.Json2Obj(Utils.getCookie('userInfo'));
const dateFormat = 'YYYY-MM-DD HH:mm:ss'
type IProps = {
  location: any
}

const ActivityBanner: FC<IProps> = (props) => {

  const [form] = Form.useForm();
  const [loading, setloading] = useState(false);
  const [mode, setmode] = useState("");
  const [type, settype] = useState(1);
  const [meetInfo, setMeetInfo] = useState({});
  const [bannerInfo, setbannerInfo] = useState([]);

  const refInput = React.useRef(null);

  useEffect(() => {
      const { query } = props.location
      const asyncOperate = async() => {
        setloading(true)
          const res  = await getMeetingDetail({meetingId:query.id})
          if(res && res.returncode === 0){
          let data = JSON.parse(JSON.stringify(res))      
          const { data : { banner } } = data
          if(banner.length){
            setbannerInfo(banner)
            console.log('banner', {banner:banner})
            
            form.setFieldsValue({banner:banner})
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

  const onFinish = async(data:any) => {
    const { query } = props.location
    const values = await form.validateFields();
    if(!values){
      return
    }
    try {
      const params = {
        banner: data.banner,
        meetingId: query.id
      }
      const res = await saveBanner(params)
      if(res.returncode === 0){
        message.success("保存成功")
    }
    }catch(err){
      message.error(err)
    }

  };

    return (
      <div className={styles.container}>
        <Spin spinning={loading}>
        <div className={styles.header}>
          <div className={styles.brumbs}>会议模块编辑</div>
        </div>
        <div className={styles.body}>
        <Form 
        name="dynamic_form_nest_item" 
        onFinish={onFinish}
        autoComplete="off" 
        form={form} 
        >
      <Form.List name="banner">
        {(fields, { add, remove }) => {
          return(
          <>
            {fields.map(field => (
              <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item
                  {...field}
                  label="轮播图图片"
                  name={[field.name, 'imgUrl']}
                  fieldKey={[field.fieldKey, 'imgUrl']}
                  rules={[{ required: true }]}
                >
                  <ImgUploader 
                    action={`${baseURL}/meeting-service/api/inner/img/fileUpload`}
                    filePath='download_url'
                    imgFormat={['png', 'jpg']}
                    showRemoveIcon={true}
                    name={'files'}
                    imgUploaderTitle='点击上传图片'
                  />
                </Form.Item>
                <Form.Item
                  {...field}
                  label="图片点击后跳转链接"
                  name={[field.name, 'jumpUrl']}
                  fieldKey={[field.fieldKey, 'jumpUrl']}
                >
                  <Input placeholder="请输入跳转链接" />
                </Form.Item>
                <Form.Item
                  {...field}
                  label="图片排序顺序"
                  name={[field.name, 'sort']}
                  fieldKey={[field.fieldKey, 'sort']}
                  rules={[{ required: true }]}
                >
                  <InputNumber placeholder="排序顺序,数字越小越靠前" />
                </Form.Item>
                <a onClick={() => remove(field.name)}><MinusCircleOutlined/>&nbsp;取消图片</a>
                <Divider />
              </Space>
            ))}
            <Form.Item>
              <Button style={{width: "200px"}} type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                新增轮播图图片
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
        <div>
        {/* <WangEditor 
          onChange={onChange}
          type="meet1"
            /> */}
        </div>
        </div>
        </Spin>
      </div>
    )
}

export default ActivityBanner
