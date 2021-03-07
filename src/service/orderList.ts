import { axiosPost, axiosGet, axiosPostForm } from '@/utils/axios';
import { antiURL } from '../config'

export interface reasonListParams {
  }
export async function reasonList(params: reasonListParams) {
	return axiosGet(`${antiURL}/ban_reason_list`, params);
}

export interface cityListParams {
}
export async function cityList(params: cityListParams) {
return axiosGet(`${antiURL}/cities`, params);
}
