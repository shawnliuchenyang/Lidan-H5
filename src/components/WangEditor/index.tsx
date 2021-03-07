import React, {FC, useState, useEffect } from 'react';
import E from 'wangeditor'
import styles from './index.less'
import { Select } from "antd";
import { authorization } from '@/utils/axios'
import { baseURL } from '@/config'
const { Option } = Select

const phoneMap = [
  {
    type: "MotoG4",
    width: 360,
    height: 640
  },
  {
    type: "GalaxyS5",
    width: 360,
    height: 640
  },
  {
    type: "iPhoneX",
    width: 375,
    height: 812
  },
  {
    type: "iPhone6/7/8",
    width: 375,
    height: 667
  },
  {
    type: "iPhone6/7/8 Plus",
    width: 414,
    height: 736
  },
  {
    type: "iPhone5/SE",
    width: 320,
    height: 568
  },
  {
    type: "iPad",
    width: 768,
    height: 1024
  },
  {
    type: "SurfaceDuo",
    width: 540,
    height: 720
  },
]

let editor = null

type IProps = {
  value: any
  onChange: (view:any, type: string) => void
  editorid: string
}
const Editor: FC<IProps> = (props) => {

  const [content, setContent] = useState('')
  const [viewWidth, setViewWidth] = useState(360)
  const [viewHeight, setViewHeight] = useState(640)
  const [phonetype, setPhonetype] = useState("Moto_G4")
  const id = `#div_${props.editorid}`

  useEffect(() => {
    // 注：class写法需要在componentDidMount 创建编辑器
    editor = new E(id)
    editor.config.uploadImgServer = `${baseURL}/meeting-service/api/inner/img/fileUpload`
    editor.config.uploadImgHeaders = {
      ...authorization// 设置请求头
      }
    editor.config.uploadFileName = "files"
    editor.config.height = 600

    editor.config.onchange = (newHtml) => {
      setContent(newHtml)
      props.onChange(newHtml, props.editorid)
      // props.onChange(newHtml)
    }
    
    /**一定要创建 */
    editor.create()
    // editor.txt.html(props.value)


    return () => {
      // 组件销毁时销毁编辑器  注：class写法需要在componentWillUnmount中调用
      editor.destroy()
    }
  }, [])

  useEffect(() => {
    // 注：class写法需要在componentDidMount 创建编辑器
   editor.txt.html(props.value)
  }, [props.value])


  // 获取html方法1
  function getHtml() {
    alert(content)
  }

  // 获取html方法2
  function getHtml1() {
    alert(editor.txt.html())
  }

  // 获取text
  function getText() {
    alert(editor.txt.text())
  }

  const handleChange = (e) => {
    const phoneSize = phoneMap.find(item => (item.type == e))
    if(phoneSize){
      setViewWidth(phoneSize.width)
      setViewHeight(phoneSize.height)
      setPhonetype(phoneSize.type)
    }
  }

  return (
    <div>
    <div className={styles.editorfield}>
      <div  className={styles.editorContent} id={`div_${props.editorid}`} ></div>
      <div>
      <div className={styles.btn}>
      <div className={styles.chooseTitle}>手机类型：</div>
      <Select 
      
            // disabled={props.disabled}
            onChange={e => {handleChange(e)}}
            value={phonetype}
            >
              {phoneMap.map((item:any) => (
                <Option key={item.type} value={item.type}>{item.type}</Option>
              ))}

          </Select>
      </div>
        <div className={styles.view} style={{width: viewWidth, height: viewHeight}} dangerouslySetInnerHTML={{__html: content}}></div>
      </div>
    </div>
    </div>
  );
}

export default Editor;
