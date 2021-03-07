import Utils from '@/utils/common';
import moment from 'moment';
const dateFormat = 'YYYY-MM-DD HH:mm:ss'

export const SKUConfig = {
  // 省钱卡
  1: [
      "third_sku_id", 
      "name", 
      "stock", 
      "price", 
      "inner_name", 
      "priority", 
      "dateRange", 
      "cityType", 
      "tags", 
      "description", 
      "purchase_notice", 
      "card_label", 
      "access_control", 
      "rights_tags", 
      "algorithm_switch", 
      "promotion_stock", 
      "promotion_purchase_limit",
      "area",
      "citygroup"
    ],

  // 加油包
  101: [
        "main_sku_id", 
        "name", 
        "stock", 
        "price", 
        "inner_name", 
        "priority", 
        "dateRange", 
        "cityType", 
        "tags", 
        "description", 
        "purchase_notice", 
        "purchase_limit", 
        "spend_times_limit",
        "area",
        "citygroup",
        "rights_tags"
      ],

    // 无车赔
    102: [
      "main_sku_id", 
      "name",
      "inner_name",  
      "description", 
      "dateRange", 
      "spend_times_limit",
      "time_limit",
      "amount_limit",
      "open_limit",
      "compensate_fee_limit",
      "over_time_limit"
    ],
}

export const  encodeData = (data:any, mode:string, id?: number) => {
  const { username } = Utils.Json2Obj(Utils.getCookie('userInfo'));
  let res = JSON.parse(JSON.stringify(data))

    let sku_info = {}
    // 处理城市组
    if(res.cityType == 2){
        res.area = []
        res.choosedGroup.map(item => {
          item.city_list.map(city => {
            res.area.push(+city.id)
          })
        })
      }
      res.area = Array.from(new Set(res.area))
      delete res.cityType
      const enable_time = (moment(res.dateRange[0]).format(dateFormat))
      const expire_time = (moment(res.dateRange[1]).format(dateFormat))

        res = {
          ...res,
          ...res.tags,
          enable_time,
          expire_time,
          app_id: 1,
          renew_price:0,
          // initial_stock: res.stock,
          area: `[${res.area}]`,
          creator:username?username:"shawnliuchenyang",
        }
        if(mode === "create" || mode === "copy"){
          res.initial_stock = res.stock
          delete res.stock
        }
        if(mode === "edit"){
          res.id = Number(id)
        }

        delete res.tags
        delete res.dateRange
        delete res.choosedGroup
    
          // 省钱卡传卡角标文案, 标签
          if(res.type == 1){
            sku_info = {
              card_label: res.card_label,
              rights_tags: res.rights_tags
            } 
            res.price = Math.round(res.price*100),
            res.sku_info = sku_info
            delete res.card_label
            delete res.rights_tags
          }
    
          // 加油包传个购买次数限制
        if(res.type == 101){
          sku_info = {
            spend_times_limit: res.spend_times_limit,
            rights_tags: res.rights_tags
          }
          res.price = Math.round(res.price*100),
          res.sku_info = sku_info
          res.main_sku_id = +res.main_sku_id
          delete res.spend_times_limit
        }

        if(res.type == 102){
          sku_info = {
            spend_times_limit: res.spend_times_limit,
            over_time_limit: Math.round(res.over_time_limit * 60),
            compensate_fee_limit: Math.round(res.compensate_fee_limit * 100),
            open_limit: res.open_limit
          }
          res.sku_info = sku_info
          res.main_sku_id = +res.main_sku_id

          // 默认值
          res.priority = 5
          res.area = "[]"
          delete res.spend_times_limit
          delete res.over_time_limit
          delete res.compensate_fee_limit
          delete res.open_limit
          if(mode === "create" || mode === "copy"){
            res.initial_stock = 0
          }
        }

          return res
}
