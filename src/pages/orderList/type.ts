export interface getListParams {
  user_id?: string;
  phone?: string;
  order_id?: string;
  start_date?: string;
  end_date?: string;
  page_size?: number;
  page_num?: number;
  is_cheat?: number;
  user_name?: string;
}

export interface banListData {
  order_id: number;
  order_list: string;
  start_date: string;
  days: string;
  ban_caller: string;
  reason: string;
  punitive_id: string;
  case_id: string;
}
export interface orderListData {
  order_id: number;
  driver_id: number;
  passenger_id: number;
  driver_phone: string;
  passenger_phone: string;
  begun_time: string;
  assign_time: string;
  finished_time: string;
  starting_name: string;
  dest_name: string;
  area: number;
  to_area: number;
  cheat_status: number;
  anti_spam_stg: string;
}

export interface orderDetail {
  order_id: string;
  driver_phone?: string;
  driver_id?: string;
  passenger_phone?: string;
  passenger_id?: string;
  begun_time?: string;
  assign_time?: string;
  finished_time?: string;
  cheat_status: number;
  area: number;
  to_area: number;
  starting_name?: string;
  dest_name?: string;
  total_fee?: number;
  actual_pay_fee?: number;
  basic_fee?: number;
  anti_spam_stg?: string;
  pay_details?: {
    channel: number;
    channel_name?: string;
    cost?: number;
    coupon_id?: string;
  }[];
  punitive_details?: {
    punitive_type?: number;
    status?: number;
    effective_date?: string;
    end_date?: string;
    revert_date?: string;
    extra_info?: {};
  }[];
}

export interface cityListType {
  [key: string]: string;
}

export interface driverInfoType {
  driver_id: number;
  phone?: string;
  score?: number;
  ban_status?: number;
  ban_start_date?: string;
  ban_end_date?: string;
}

export interface orderListState {
  serachLoading: boolean;
  cityList: cityListType;
  showDetail: boolean;
  showBanModal: boolean;
  orderList: orderListData[];
  searchType: string;
  driverInfo: driverInfoType;
  temParams: getListParams;
  banList: banListData[];
  orderDetail: orderDetail;
  banReasonList: string[];
}
