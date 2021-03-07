import React, { PureComponent } from "react";
import { Upload, Table, Button, message } from "antd";
import "./index.less";
import {
  SettingOutlined,
} from '@ant-design/icons';
export default class BatchUploadModal extends PureComponent {
  constructor() {
    super();
    this.state = {
      dataSource: [],
      expand: false, // 超出3行展开
      showFileList: [], // 展示已上传的Excel,只展示最近的一个
    };
  }
  render() {
    const { showFileList } = this.state;
    const { uploadInfo, refresh, name } = this.props
    return (
      <div className="popec-batchuploadmodal">
        <Upload
          {...{
            name,
            action: uploadInfo.upload_path,
            accept: ".xlsx, .xls",
            data: {
              user_name: '',
            },
            fileList: showFileList,
            // beforeUpload(file) {
            //   if (file.size / 1024 / 1024 > 10) {
            //     message.error("上传的Excel文件最大不能超过10M");
            //     return false;
            //   }
            // },
            onChange: (info) => {
              if (info.file.status === "uploading") {
                this.setState({
                  showFileList: [info.file]
                });
              }
              if (info.file.status === "removed") {
                this.setState({
                  dataSource: [],
                  showFileList: []
                });
              }
              if (info.file.status === "done") {
                // if (info.file.response.errcode!==0) {
                //   message.error(info.file.response.errmsg || '上传文件解析失败')
                //   this.setState({
                //     dataSource: [],
                //     showFileList: info.fileList.slice(-1)
                //   });
                //   return
                // }
                if(!info.file.response.errno){
                this.setState({
                  dataSource: info.file.response.data,
                  showFileList: info.fileList.slice(-1)
                });
                message.success(`${info.file.name} 上传成功`);
                refresh()
              }
              else{
                message.error(`${info.file.response.errmsg}`);
              }
                
              } else if (info.file.status === "error") {
                message.error(`${info.file.name} 上传失败`);
              }
            },
          }}
        >
          <Button>
            <SettingOutlined /> {this.props.text || "Click to Upload"}
          </Button>
        </Upload>
        {/* <h3 className="result">上传结果：</h3> */}
        {/* <Table
          {...uploadInfo.table_config}
          dataSource={this.state.dataSource}
        ></Table> */}
      </div>
    );
  }
}
