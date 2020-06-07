import Cookies from "js-cookie"

export const setUserName = (username) => {
  Cookies.set('username', username, {expires: 7})
}
export const getUserName = () => {
  return Cookies.get('username')
}

import originJsonp from 'jsonp'

export default function jsonp(url, data, option) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + (data)

  return new Promise((resolve, reject) => {
    originJsonp(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

