import { axiosPost, axiosGet, axiosPostForm } from '@/utils/axios';
import { antiURL } from '../config'

export interface reasonListParams {
  }
export async function reasonList(params: reasonListParams) {
	return axiosGet(`${antiURL}/ban_reason_list`, params);
}

export async function batchBanDriver(params: any) {

  return axiosPostForm(`${antiURL}/batch_ban_driver`, params);
}