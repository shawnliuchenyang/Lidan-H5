import { axiosPostForm, axiosGet, axiosPost } from '@/utils/axios';
import { baseURL } from '../config'


// 创建会议接口
export interface baseinfoParams {
    address: number
    beginTime?: number,
    endTime: string,
    meetingName?: string,
    sponsor: number,
    id?: number,
    isDel?: number,
    meetingStatus?: string,
  }
export async function createBaseinfo(params: baseinfoParams) {
	return axiosPostForm(`${baseURL}/meeting-service/api/inner/meeting/save/baseinfo`, params);
}

// 获取会议详情
export interface meetingDetailParams {
  meetingId: number
}
export async function getMeetingDetail(params: meetingDetailParams) {
return axiosGet(`${baseURL}/meeting-service/api/inner/meeting/detail`, params);
}

// 存储轮播图
export interface saveBannerParams {
  meetingId: number
}
export async function saveBanner(params: saveBannerParams) {
return axiosPost(`${baseURL}/meeting-service/api/inner/meeting/save/banner`, params);
}

// 存模块信息
export async function saveModule(params: any) {
return axiosPost(`${baseURL}/meeting-service/api/inner/meeting/save/expandinfo`, params);
}


