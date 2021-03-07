import moment from 'moment';
import {TIME_STATUS} from '@/interface'

export function geMeetingStatus(status:number){
    let desc = ""
    if(status === 0){
        desc = "已下线"
    }
    if(status === 1){
        desc = "已上线"
    }
    return desc
}

export const cargoStatus = [
    {
        key: 1,
        desc: "上架"
    },
    {
        key: 2,
        desc: "下架"
    },
    {
        key: 3,
        desc: "待审核"
    },
    {
        key: 4,
        desc: "审核驳回"
    },
]

export const meetingStatus = [
    {
        key: 0,
        desc: "已下线"
    },
    {
        key: 1,
        desc: "已上线"
    },
]

export const realStatus = {
    1: {
        status:1,
    },
    2: {
        status:-1,
    },    
    3: {
        status:-1,
        audit_status:1
    },
    4: {
        status:-1,
        audit_status:2
    }
}

export const saleStatus = [
    {
        key: 1,
        desc: "进行中"
    },
    {
        key: 2,
        desc: "下线"
    },
    {
        key: 3,
        desc: "待审核"
    },
    {
        key: 4,
        desc: "审核驳回"
    },
]

export function getSaleStatus(audit_status:number, status:number, startTime:string, endTime:string){
    let time = TIME_STATUS.DURNING
    const now = moment().format("YYYY-MM-DD HH:mm:ss")
    if(moment(now).isBefore(startTime)){
        time = TIME_STATUS.BEFORE
    }
    if(moment(now).isAfter(endTime)){
        time = TIME_STATUS.AFTER
    }
    if(audit_status === 2){
        return "审核驳回"
    }
    if(audit_status === 1){
        return "待审核"
    }
    if(status === -1 || audit_status === 0){
        return "下线"
    }
    if(audit_status === 3 && status === 1 && time===TIME_STATUS.BEFORE){
         return "待生效"
    }
    if(audit_status === 3 && status === 1 && time===TIME_STATUS.DURNING){
        return "进行中"
    }
    if(audit_status === 3 && status === 1 && time===TIME_STATUS.AFTER){
        return "已失效"
    }
}

interface Utils {
	getCookie: (name: any) => any;
    Json2Obj: (str: any) => any;
    isJSON: (str: any) => any;
    getUrlParamValue: (name: string, url: string) => any
}

const Utils: Utils = {
    getCookie(name: string) {
        let c_start;
        let c_end;

        if (document.cookie.length > 0) {
            c_start = document.cookie.indexOf(`${name}=`);

            if (c_start != -1) {
                c_start = c_start + name.length + 1;
                c_end = document.cookie.indexOf(';', c_start);
                if (c_end == -1) {
                    c_end = document.cookie.length;
                }
                return decodeURIComponent(document.cookie.substring(c_start, c_end));
            }
        }
        return '';
    },

    Json2Obj(str: string) {
        if (this.isJSON(str)) {
            return JSON.parse(str);
        }
        return {};
    },

    isJSON(str: string) {
		if (typeof str === 'string') {
			try {
				const obj = JSON.parse(str);
				if (typeof obj === 'object' && obj) {
					return true;
				}
				return false;
			} catch (e) {
				return false;
			}
		}
		return false;
    },

            // 获取浏览器参数
        getUrlParamValue (name, url = window.location.href) {
            const reg = new RegExp(`(\\?|&)${name}=([^(&|%|#)]*)(&|$|%)`);
            const r = url.match(reg);
            if (r != null) {
                return unescape(r[2]);
            }
            return '';
        }
    
}



export default Utils;