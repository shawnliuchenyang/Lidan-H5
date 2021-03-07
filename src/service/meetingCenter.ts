import { axiosGet } from '@/utils/axios';
import { baseURL } from '../config'

export interface MeeingInfoParams {
    meetingId: Number
  }
export async function getMeeingInfo(params: MeeingInfoParams) {
	return axiosGet(`${baseURL}/meeting-service/api/open/meeting/detail`, params);
}