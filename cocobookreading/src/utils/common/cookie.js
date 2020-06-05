import Cookies from "js-cookie"

export const setUserName = (username)=>{
  Cookies.set('username', username,{expires:7})
}
export const getUserName = ()=> {return Cookies.get('username')}
