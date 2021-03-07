import { axiosPost, axiosGet } from '@/utils/axios';
import { baseURL } from '../config'

// 创建促销
export interface saleCreateParams {
    sku_id: number,
    fresher_special: number,
    start_time: string,
    end_time: string,
    promotion_type: string,
    single_price_value: number,
    renew_price_value?:number,
    initial_stock: number,
    promotion_label: string,
    purchase_limit: string,
    creator: string
  }
export async function saleCreate(params: saleCreateParams) {
	return axiosPost(`${baseURL}/promotion/create`, params);
}

// 更新促销
export interface saleUpdateParams {
    id: number
    sku_id: number,
    fresher_special: number,
    start_time: string,
    end_time: string,
    promotion_type: string,
    single_price_value: number,
    renew_price_value?:number,
    stock: number,
    promotion_label: string,
    purchase_limit: string,
    creator: string
  }
export async function saleUpdate(params: saleUpdateParams) {
	return axiosPost(`${baseURL}/promotion/update`, params);
}

// 查询促销详情
export interface SaleInfoParams {
    id: number
  }
export async function getSaleInfo(params: SaleInfoParams) {
	return axiosGet(`${baseURL}/promotion/detail`, params);
}

