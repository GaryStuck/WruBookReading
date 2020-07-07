/*
，需求：

所有对服务器的请求先访问 '/GetMaintenanceState'接口，如果服务器正在维护就拦截请求，跳转到维护页面并显示维护信息；如果服务器正在运行，再发起请求。

需要登录后发送的请求：（登录时请求接口'Token'，将 access_token 和 refresh_token 保存在localStorage），每次请求都要带自定义请求头 Authorization。
access_token 过期后，用 refresh_token 重新请求刷新token，如果refresh_token 过期跳转到登录页面重新获取token。

因为我们的所有接口除了网络问题，返回的 status 都是200(OK)，请求成功 IsSuccess 为 true，请求失败 IsSuccess 为 false。请
求失败会返回响应的错误码 ErrorTypeCode，10003 —— access_token 不存在或过期，10004 —— refresh_token 不存在或过期。
*/
import axios from 'axios';
import router from '../router';
import { Message } from 'element-ui';

function getUrl(url) {
  if (url.indexOf(baseUrl) === 0) {
    return url;
  }
  url = url.replace(/^\//, '');
  url = baseUrl + '/' + url;
  return url;
}
function checkMaintenance() {
  let status = {};
  let url = getUrl('/GetMaintenanceState');
  return axios({
    url,
    method: 'get'
  })
    .then(res => {
      if (res.data.IsSuccess) {
        status = {
          IsRun: res.data.Value.IsRun, // 服务器是否运行
          errMsg: res.data.Value.MaintenanceMsg // 维护时的信息
        };
        // localStorageSet 为封装好的方法，储存字段的同时，储存时间戳
        localStorage.setItem('maintenance', status);
        // 传递获取的结果
        return Promise.resolve(status);
      }
    })
    .catch(() => {
      return Promise.reject();
    });
}
// 封装刷新token的函数
function getRefreshToken() {
  let url = getUrl('/Token');
  // 登录时已经获取token储存在localStorage中
  let token = JSON.parse(localStorage.getItem('token'));
  return axios({
    url,
    method: 'post',
    data: 'grant_type=refresh_token&refresh_token=' + token.refresh_token,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      // 开发者密钥
      Authorization: 'Basic xxxxxxxxxxx'
    }
  })
    .then(res => {
      if (res.data.IsSuccess) {
        var token_temp = {
          access_token: res.data.access_token,
          refresh_token: res.data.refresh_token
        };
        localStorage.setItem('token', JSON.stringify(token_temp));
        // 将access_token储存在session中
        sessionStorage.setItem('access_token', res.data.access_token);
        return Promise.resolve();
      }
    })
    .catch(() => {
      return Promise.reject();
    });
}

const instance = axios.create();

instance.interceptors.request.use(
  config => {
    // 获取储存中本地的维护状态，localStorageGet方法，超过10分钟返回false
    let maintenance = localStorage.getItem('maintenance');
    // 如果本地不存在 maintenance 或 获取超过10分钟，重新获取
    if (!maintenance) {
      return checkMaintenance()
        .then(res => {
          if (res.IsRun) {
            // 获取session中的access_token
            let access_token = sessionStorage.getItem('access_token');
            // 如果不存在字段，则跳转到登录页面
            if (!access_token) {
              router.push({
                path: '/login',
                query: { redirect: router.currentRoute.fullPath }
              });
              // 终止这个请求
              return Promise.reject();
            } else {
              config.headers.Authorization = `bearer ${access_token}`;
            }
            config.headers['Content-Type'] = 'application/json;charset=UTF-8';
            // 这一步就是允许发送请求
            return config;
          } else {
            // 如果服务器正在维护，跳转到维护页面，显示维护信息
            router.push({
              path: '/maintenance',
              query: { redirect: res.errMsg }
            });
            return Promise.reject();
          }
        })
        .catch(() => {
          // 获取服务器运行状态失败
          return Promise.reject();
        });
    } else { // 本地存在 maintenance
      if (maintenance.IsRun) {
        let access_token = sessionStorage.getItem('access_token');
        if (!access_token) {
          router.push({
            path: '/login',
            query: { redirect: router.currentRoute.fullPath }
          });
          return Promise.reject();
        } else {
          config.headers.Authorization = `bearer ${access_token}`;
        }
        config.headers['Content-Type'] = 'application/json;charset=UTF-8';
        return config;
      } else {
        router.push({
          path: '/maintenance',
          query: { redirect: maintenance.errMsg }
        });
        return Promise.reject();
      }
    }
  },
  err => {
    // err为错误对象，但是在我的项目中，除非网络问题才会出现
    return Promise.reject(err);
  }
);

// 是否正在刷新的标记
let isRefreshing = false;
// 重试队列，每一项将是一个待执行的函数形式
let requests = [];
instance.interceptors.response.use(
  response => {
    if (response.data.ErrorTypeCode == 10003) {
      const config = response.config;
      if (!isRefreshing) {
        isRefreshing = true;
        return getRefreshToken()
          .then(() => {
            let access_token = sessionStorage.getItem('access_token');
            config.headers.Authorization = `bearer ${access_token}`;
            config.headers['Content-Type'] = 'application/json;charset=UTF-8';
            // 已经刷新了token，将所有队列中的请求进行重试
            requests.forEach(cb => cb(access_token));
            requests = [];
            return instance(config);
          })
          .catch(() => {
            // refreshtoken 获取失败就只能到登录页面
            sessionStorage.removeItem('user');
            router.push({
              path: '/login',
              query: { redirect: router.currentRoute.fullPath }
            });
            return Promise.reject();
          })
          .finally(() => {
            isRefreshing = false;
          });
      } else {
        // 正在刷新token，将返回一个未执行resolve的promise
        return new Promise(resolve => {
          // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
          requests.push(token => {
            config.headers.Authorization = `bearer ${token}`;
            config.headers['Content-Type'] = 'application/json;charset=UTF-8';
            resolve(instance(config));
          });
        });
      }
    }
    if (response.data.ErrorTypeCode == 10004) {
      router.push({
        path: '/login',
        query: { redirect: router.currentRoute.fullPath }
      });
      return Promise.reject();
    }
    return response.data;
  },
  err => {
    return Promise.reject(err);
  }
);

function request({ url, method, Value = null }) {
  url = getUrl(url);
  method = method.toLowerCase() || 'get';
  let obj = {
    method,
    url
  };
  if (Value !== null) {
    if (method === 'get') {
      obj.params = { Value };
    } else {
      obj.data = { Value };
    }
  }
  return instance(obj)
    .then(res => {
      return Promise.resolve(res);
    })
    .catch(() => {
      Message.error('请求失败，请检查网络连接');
      return Promise.reject();
    });
}

export function get(setting) {
  setting.method = 'GET';
  return request(setting);
}

export function post(setting) {
  setting.method = 'POST';
  return request(setting);
}

/*testing request
import { post, get } from '@/common/network';

post({
  url: '/api/xxxxx',
  Value: {
    GoodsName,
    GoodsTypeId
  }
}).then(res => {
    //.....
})
 */
