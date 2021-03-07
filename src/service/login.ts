import { axiosPost, axiosGet, axiosPostForm } from '@/utils/axios';
import { baseURL } from '../config'

export interface loginParams {
    accountId: String,
    password: String,
  }
export async function login(params: loginParams) {
	return axiosPostForm(`${baseURL}/meeting-service/api/inner/user/login`, params);
}