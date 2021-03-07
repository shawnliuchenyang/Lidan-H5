import { axiosPost, axiosGet } from '@/utils/axios';
import { baseURL } from '../config'

// 查询促销列表
export interface SaleListParams {
    sku_id?: number,
    type?: number,
    time?: string,
    status?: number,
    audit_status?: number,
    fresher_special?: number,
    page?: number,
    limit?: number,
    start_time?: string,
    end_time?: string
  }
export async function getSaleListInfo(params: SaleListParams) {
	return axiosGet(`${baseURL}/promotion/list`, params);
}

// 促销申请上架
export interface SaleApplyParams {
    id: number
  }
export async function saleApply(params: SaleApplyParams) {
	return axiosPost(`${baseURL}/promotion/apply`, params);
}

// 促销上架审核
export interface SaleApproveParams {
    id: number
    auditor: string
    audit_status: number
  }
export async function saleApprove(params: SaleApproveParams) {
	return axiosPost(`${baseURL}/promotion/approve`, params);
}

// 促销立即下架
export interface SaleStopParams {
    id: number
  }
export async function saleStop(params: SaleStopParams) {
	return axiosPost(`${baseURL}/promotion/stop`, params);
}