import { createContext } from 'react';
import Cookie from 'js-cookie';
let userName = '' 
userName = Cookie.get('userInfo')?JSON.parse(Cookie.get('userInfo') as string).username:''
if(!userName){
    userName = Cookie.get('s_userinfo')?JSON.parse(Cookie.get('s_userinfo') as string).username:'';
}
if(!userName){
    userName = 'shawnliuchenyang' 
}
// const userName = 'wangkuowangkuo';
export const UserNameContext = createContext(userName);
export const defeatByFate = userName; // 这个，是因为，orderlist 用了class，然后，懒得改了，😁
