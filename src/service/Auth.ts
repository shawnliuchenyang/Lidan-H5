import { axiosPost, axiosPostForm } from '@/utils/axios';
import { baseURL } from '../config'

// 查询列表
export async function creatUser(params: any) {
	return axiosPostForm(`${baseURL}/meeting-service/api/inner/user/save`, params);
}
