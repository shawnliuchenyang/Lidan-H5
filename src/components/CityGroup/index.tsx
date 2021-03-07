import React, { FC, useEffect, useState } from 'react';
import styles from './styles.less'
import { getAllCityGroup } from '@/service/cargoDetail'
import { Select } from 'antd'

type IProps = {
  disabled: boolean
  value?: any;
  onChange?: (value: any) => void;
}

const cityGroup: FC<IProps> = (props) => {

  const [cityGroups, setcityGroups] = useState([]);
  const [showCitys, setshowCitys] = useState([]);
  const [choosedGroup, setchoosedGroup] = useState([]);

  useEffect(() => {
    const asyncOperate = async() => {
      const groups = await getAllCityGroup()
      setcityGroups(groups.data.list)
    }
    asyncOperate()
}, []);

const handleCityGroup = (groups: any) => {
  const { onChange } = props
  const citysList = []
  groups.map(item => {
    const citys = cityGroups.find(group => (group.city_group_id == item))
    citysList.push(citys)
  })

  setshowCitys(citysList)
  setchoosedGroup(groups)
  onChange(citysList)
}

    return (
      <div>
          <Select 
            mode="multiple"
            disabled={props.disabled}
            placeholder="请选择城市组"
            filterOption={(inputValue, option: any) => {
              const list = cityGroups;
              const id = option.props.value;
              const item = list.find((item: any) => (item.city_group_id == id))
              const { city_activity_group_name, city_group_id } = item
              return !inputValue ||  city_activity_group_name.match(inputValue) || inputValue == `${city_group_id}`;
          }}
            value={choosedGroup}
            onChange={(e) => handleCityGroup(e)}
            >

            {cityGroups.map((item:any) => (
              <Option key={item.city_group_id} value={item.city_group_id}>{item.city_activity_group_name}</Option>
            ))}
          </Select>
          {
              showCitys && showCitys.length ? showCitys.map((item, index) => (
                  <div key={index}>
                      <span>{item?item.city_activity_group_name:''} :&nbsp;</span>
                      {
                            item.city_list.map((city, index) => (
                            <span key={index}>&nbsp;{city?city.name:''}</span>
                            ))
                      }
                  </div>
              )):null
            }
      </div>
    )
}

export default cityGroup
