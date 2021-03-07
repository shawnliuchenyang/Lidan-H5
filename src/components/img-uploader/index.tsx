/**
 * 从nova-components 搬过来，补充preDealResponse适配不同上传接口
 * 图片上传（支持拖拽，自定义格式、大小等）
 */
import React from 'react';
import { Upload, message } from 'antd';
import { authorization } from '@/utils/axios'
import { MinusCircleOutlined, DeleteOutlined } from '@ant-design/icons';

import './index.less';

const UploadDragger = Upload.Dragger;
/**
 * action              [string]     上传接口（与后端rd定义）
 * name                [string]     发到后台的文件参数名(默认file)（与后端rd定义）
 * data                [object|function(file)]     上传所需参数或返回上传参数的方法
 * imgUploaderTitle    [string]     主title（见下图第一行：点击上传图片或拖入图片）
 * imgSizeInfo         [string]     图片相关的说明信息
 * imgWidth            [number]     图片原尺寸宽度
 * imgHeight           [number]     图片原尺寸高度
 * imgFormat           [Array]      支持的图片格式
 * imgFormatInfo       [string]     支持格式说明信息（支持格式：jpg、png、gif...）
 * imgFileSize         [number]     文件大小限制（单位kb！！！）
 * onSuccess           [Function]   上传成功后的回调，回传图片地址
 * filePath            [string]     上传成功后返回的图片地址（和后端rd定义）， 默认是filePath
 * readonly            [boolean]    只读模式
 * showRemoveIcon      [boolean]    是否展示删除icon（默认值true）
 * isSquare            [boolean]    是否是正方形（默认值false）
 * freePhysicalSize    [boolean]    是否自由尺寸（默认值fasle）
 */
class ImgUploader extends React.Component {
    constructor(props) {
        super(props);
        const {
            imgWidth, imgHeight, value, isSquare
        } = props;
        // 正方形（以宽度优先）
        if (isSquare) {
            const whValue = +(imgWidth || imgHeight || 300); // 必须为number类型，下方都使用严格校验
            this.imgWidth = whValue;
            this.imgHeight = whValue;
        } else {
            this.imgWidth = +imgWidth || 710; // 必须为number类型，下方都使用严格校验
            this.imgHeight = +imgHeight || 264; // 必须为number类型，下方都使用严格校验
        }

        this.imgUrl = value || '';
        this.state = {
            uploadStatus: ''
        };
    }

    onStateChange(key, value) {
        this.setState({
            [key]: value
        });
    }

    shouldComponentUpdate(nextProps) {
        const { value, onChange, onSuccess, imgWidth, imgHeight, isSquare} = nextProps;
        if (isSquare) {
            const whValue = +(imgWidth || imgHeight || 300); // 必须为number类型，下方都使用严格校验
            this.imgWidth = whValue;
            this.imgHeight = whValue;
        } else {
            this.imgWidth = +imgWidth || 710; // 必须为number类型，下方都使用严格校验
            this.imgHeight = +imgHeight || 264; // 必须为number类型，下方都使用严格校验
        }
        // 这里支持外部配置value，联动变更。（比如根据某个select选择不同项，展示不同图片）；如果没有联动，设置默认图片使用defaultValue即可
        if (value !== this.props.value) {
            this.imgUrl = value;
            if (typeof onChange === 'function') {
                onChange(value);
            }
            if (typeof onSuccess === 'function') {
                onSuccess(value);
            }
        }
        return true;
    }

    onMouseEnter = () => {
        if (!this.imgUrl) {
            return;
        }
        this.onStateChange('hover', true);
    }

    onMouseLeave = () => {
        this.onStateChange('hover', false);
    }

    remove = () => {
        const { onChange, onSuccess } = this.props;
        const value = '';
        this.imgUrl = value;
        if (typeof onChange === 'function') {
            onChange(value);
        }
        if (typeof onSuccess === 'function') {
            onSuccess(value);
        }
        this.onStateChange('hover', false);
    }

    getValue() {
        return this.imgUrl;
    }

    setValue(value) {
        const { onChange } = this.props;
        if (!value) {
            return;
        }
        this.imgUrl = value;
        if (typeof onChange === 'function') {
            onChange(value);
        }
    }

    checkData(data) {
        return super.baseCheck(data);
    }

    beforeUpload(file) {
        // 图片格式、图片文件大小(单位默认是kb)
        let {
            imgFormat, imgFileSize
        } = this.props;
        const { isSquare = false, freePhysicalSize = false } = this.props;
        imgFormat = imgFormat && imgFormat.constructor === Array ? imgFormat : [];
        imgFormat = imgFormat.map(item => `image/${item === 'jpg' ? 'jpeg' : item}`);
        // 是否在指定格式中
        const formatFlag = imgFormat.length === 0 || imgFormat.indexOf(file.type) > -1;
        // 默认是1M
        imgFileSize = imgFileSize || 1024;
        const fileSizeFlag = file.size / 1024 <= (imgFileSize || 1024);
        if (!formatFlag) {
            message.error('图片格式不符合要求！');
        } else if (!fileSizeFlag) {
            message.error(`上传图片不得超过${imgFileSize}kb`);
        }
        const flag = formatFlag && fileSizeFlag;

        if (!flag) {
            return flag;
        }

        // 图片格式、文件大小符合要求并且不是自由尺寸时，则判断宽高
        // if (flag && (!freePhysicalSize || isSquare)) {
        //     return this.checkImgWidthHeight(file, this.imgWidth, this.imgHeight);
        // }
        return flag;
    }

    checkImgWidthHeight(file, w, h) {
        const {
            imgWidth, imgHeight, freePhysicalSize, isSquare
        } = this.props;
        return new Promise(((resolve, reject) => {
            const filereader = new FileReader();
            filereader.onload = (e) => {
                const src = e.target.result; // base64图片
                const img = new Image();
                img.onload = function imgOnload() {
                    if (isSquare) {
                        // 自由尺寸或者非自由尺寸没有设置宽和高（也视为为自由尺寸）
                        if (freePhysicalSize || (!imgWidth && !imgHeight)) {
                            if (this.width !== this.height) {
                                message.warning('请上传正方形图片！');
                                reject();
                            } else {
                                resolve();
                            }
                        } else if ((w && this.width !== w) || (h && this.height !== h)) {
                            message.warning(`请上传尺寸为${w || h} 的正方形状图片`);
                            reject();
                        } else {
                            resolve();
                        }
                    } else if (!freePhysicalSize
                        && ((w && this.width !== w) || (h && this.height !== h))) {
                        message.warning(`请上传符合尺寸的图片，宽高分别为${w} *${h}`);
                        reject();
                    } else {
                        resolve();
                    }
                };
                img.onerror = reject;
                img.src = src;
            };
            filereader.readAsDataURL(file);
        }));
    }

    getConfig() {
        const self = this;
        let {
            filePath,
            data
        } = this.props;
        const {
            action,
            name, onSuccess,
            beforeUpload: propsBeforeUpload,
            onChange,
        } = this.props;
        const { fileList } = this.state;
        filePath = filePath || 'filePath';
        data = data || {};
        // 校验回调是否是函数
        const flag = propsBeforeUpload && propsBeforeUpload.constructor === Function;
        // 如果外部自定义beforeUpload，重置this，防止外部变更任何内部方法及属性
        const beforeUpload = flag ? propsBeforeUpload.bind(null) : this.beforeUpload.bind(this);
        return {
            name: name || 'files',
            data,
            multiple: false,
            showUploadList: false,
            action,
            fileList,
            headers: {
                ...authorization
            },
            beforeUpload,
            onChange(info) {
                if (info.file.status === 'uploading') {
                    self.onStateChange('uploadStatus', 'uploading');
                } else {
                    self.onStateChange('fileList', info.fileList);
                }
            },
            onSuccess(originRes) {
                let imgUrl = '';
                self.onStateChange('uploadStatus', '');
                const res = originRes;
                // 状态码字段都不统一。。。
                if (res && (+res.errno === 0)) {
                    const resData = res.data[0] || {};
                    console.log('resData', resData)
                    imgUrl = resData.url || '';
                    message.success(data.errmsg || '上传成功！');
                    if (typeof onSuccess === 'function') {
                        onSuccess(imgUrl);
                    }
                } else {
                    message.error(res.message || '上传失败！');
                }

                self.imgUrl = imgUrl;
                if (typeof onChange === 'function') {
                    onChange(imgUrl);
                }
            },
            onError() {
                self.onStateChange('uploadStatus', '');
                message.error('上传失败，请稍后再试！');
            }
        };
    }

    render() {
        const {
            imgUploaderTitle,
            imgSizeInfo,
            imgFormatInfo,
            readonly,
            zoom
        } = this.props;
        let {
            showRemoveIcon
        } = this.props;

        showRemoveIcon = showRemoveIcon !== undefined ? !!showRemoveIcon : true;
        const imageUrl = this.imgUrl;
        const { hover, uploadStatus } = this.state;
        let clsName = hover ? 'components-img-uploader-wrap hover' : 'components-img-uploader-wrap';

        if (readonly) {
            clsName = 'components-img-uploader-wrap readonly';
        }

        return (
            <div
                style={{
                    width: this.imgWidth / (zoom?zoom:2),
                    height: this.imgHeight /  (zoom?zoom:2)
                }}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
                className={clsName}
            >
                {' '}
                {imageUrl
                    ? <img alt="activityImage" src={imageUrl} className="uploaded-img" />
                    : ''}
                {' '}
                <div
                    className={
                        uploadStatus === 'uploading'
                            ? 'status-tip-wrap'
                            : 'status-tip-wrap hide'
                    }
                >
                    {' '}
                    <span>
                        {' '}
                        {'上传中...'}
                        {' '}
                    </span>
                </div>
                {' '}
                {showRemoveIcon
                    && imageUrl
                    && (
                        <DeleteOutlined className="btn-delete" onClick={this.remove} />
                    )
                    }
                {' '}
                <UploadDragger
                    {...this.getConfig()}
                    className={imageUrl ? 'dragger-wrap hide' : 'dragger-wrap'}
                >
                    <p className="ant-upload-drag-icon upload-icon">
                        {/* <Icon type="plus-circle" /> */}
                    </p>
                    {' '}
                    <p className="introduce-upload-title">
                        {' '}
                        {imgUploaderTitle}
                        {' '}
                    </p>
                    {' '}
                    <div className="introduce">
                        <p className="ant-upload-hint">
                            {' '}
                            {imgSizeInfo}
                            {' '}
                        </p>
                        {' '}
                        <p className="ant-upload-hint img-uploader-sub-title">
                            {' '}
                            {imgFormatInfo}
                            {' '}
                        </p>
                        {' '}
                    </div>
                    {' '}
                </UploadDragger>
                {' '}
            </div>
        );
    }
}

export default ImgUploader

