import { axiosPost, axiosPostForm } from '@/utils/axios';
import { baseURL, cityGroupURL, cityURL } from '../config'

// 查询列表
export async function getActivityList(params: any) {
	return axiosPostForm(`${baseURL}/meeting-service/api/inner/meeting/list`, params);
}



