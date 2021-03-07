import { axiosPost, axiosGet, axiosPostForm } from '@/utils/axios';
import { antiURL } from '../config'

export interface driveAwardParams {
    reward_id: String,
    driver_id: String,
    amount: Number,
    user_name: String,
  }
export async function driveAward(params: driveAwardParams) {
	return axiosPost(`${antiURL}/compensate_driver_reward`, params);
}