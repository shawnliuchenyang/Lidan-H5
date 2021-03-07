import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import qs from 'qs';
import { notification, message } from 'antd';
import router from 'umi/router';
// import { API_VERSION } from '@/config';

export let authorization = {
	'authorization': sessionStorage.getItem('authorization') || '',
  };
  
   export function setMetaData () {
	const meta = {
	  'authorization': sessionStorage.getItem('authorization') || '',
	}
	authorization = meta
  }


  // axios基本配置
const baseConfig = {
	// withCredentials: true, // 允许跨域
	timeout: 100000, // 超时设置
	retry: 2, // 超时重新发请求的次数
	retryDelay: 100, // 超时后再次发请求的间隔时间
	retryCount: 0,
};

/**
 * axios超时判断
 */
const isTimeoutError = (err: AxiosError) =>
	err.code === 'ECONNABORTED' && err.message.includes('timeout');

/**
 * axios非超时,错误处理
 */

const commonErrorHandler = (err: AxiosError) => {
	notification.error({
		duration: 8,
		message: `${err.config.url},请求出错`,
		description: `${(err.response && (err.response.data.msg || err.response.data.error)) ||
			err.message} `, // 超时信息会在err.message
	});
	return { data: '' };
};

/**
 * axios超时,错误处理
 */
const timeoutHandle = async (err: AxiosError) => {
	const { config }: any = err;

	config.retryCount = config.retryCount || 0;
	if (config.retryCount > baseConfig.retry) {
		commonErrorHandler(err);
		config.retryCount = 0;
		return Promise.resolve({ data: '' });
	}
	config.retryCount += 1;
	// eslint-disable-next-line @typescript-eslint/no-use-before-define
	return axios(config).catch(errorHandler(err));
};

/**
 * 统一错误处理
 * @param  {AxiosError} err
 * @description: 和后端统一返回数据类型：{ data: {}, error: ''},请求不符合条件，返回状态码后端要进行相应的设置，并设置error对应的信息
 */
const errorHandler = (err: AxiosError): any =>
	isTimeoutError(err) ? timeoutHandle(err) : commonErrorHandler(err);

/**
 * 请求做统一错误拦截，提醒
 * @param  {object} option ： 请求参数
 */
const request = async (option: AxiosRequestConfig): Promise<any> => {
	const { data = {} } = await axios({ ...baseConfig, ...option }).catch(errorHandler);
	const { returncode, message } = data;
	// tag下载时候errno特殊处理
	if (+returncode == 4000000){
		sessionStorage.clear()
		router.push("/login")
	}
	if (+returncode !== 0) {
		notification.error({
			duration: 8,
			message: message || '请求出错',
		});
	}
	return data;
};

/**
 * get请求
 * @param  {string} url: 请求路径
 * @param  {object} params ： 请求参数~
 * @param  {object} options : 自定义配置
 */
const axiosGet = async (url: string, params?: object, options?: AxiosRequestConfig): Promise<any> =>
	request({
		url,
		headers: {
			...authorization
		},
		params: { ...params},
		...options,
	});

/**
 * post请求1
 * @param  {string} url: 请求路径
 * @param  {object} data ： 请求参数
 * @param  {object} options : 自定义配置
 * @description: post数据为application/json，一般用于新增,建议都用JSON传数据，可以比较方便的表示更为复杂的结构（有嵌套对象）
 */
const axiosPost = async (url: string, data: object, options?: AxiosRequestConfig): Promise<any> =>
	request({
		url,
		data: { ...data },
		method: 'post',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			...authorization
		},
		...options,
	});

/** post请求2
 * @param  {string} url: 请求路径
 * @param  {object} data ： 请求参数
 * @param  {object} options : 自定义配置
 * @description: post数据为application/x-www-form-urlencoded，不建议用，不方便表示更为复杂的结构（有嵌套对象）
 */
const axiosPostForm = async (
	url: string,
	data: object,
	options?: AxiosRequestConfig,
): Promise<any> =>
	request({
		url,
		data: qs.stringify({ ...data }),
		method: 'post',
		headers: {
			Accept: '*/*',
			'Content-Type': 'application/x-www-form-urlencoded',
			...authorization
		},
		...options,
	});


	/** post请求3
 * @param  {string} url: 请求路径
 * @param  {object} data ： 请求参数
 * @param  {object} options : 自定义配置
 * @description: post数据为application/x-www-form-urlencoded，不建议用，不方便表示更为复杂的结构（有嵌套对象）
 */
const axiosPostForm2 = async (
	url: string,
	data: object,
	options?: AxiosRequestConfig,
): Promise<any> =>
	request({
		url,
		data: qs.stringify({ ...data }),
		method: 'post',
		headers: {
			Accept: '*/*',
			'Content-Type': 'multipart/form-data',
		},
		...options,
	});

/**
 * put请求
 * @param  {string} url: 请求路径
 * @param  {object} data ： 请求参数
 * @param  {object} options : 自定义配置
 * @description:用于更数据，需要提交整个对象，（区别于patch只提交修改的信息，个人觉得put完全ok)
 */
const axiosPut = async (url: string, data: object, options?: AxiosRequestConfig): Promise<any> =>
	request({
		url,
		data: { ...data },
		method: 'put',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		...options,
	});
/**
 * delete请求
 * @param  {string} url: 请求路径
 * @param  {object} data ： 请求参数
 * @param  {object} options : 自定义配置
 * @description:用于删除数据
 */
const axiosDelete = async (url: string, data: object, options?: AxiosRequestConfig): Promise<any> =>
	request({
		url,
		data: { ...data },
		method: 'delete',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		...options,
	});
const axiosAll = async (fetch: Promise<any>[]): Promise<any> => {
	const data = await Promise.all(fetch).catch(errorHandler);
	return data;
};


export { axiosGet, axiosPost, axiosPut, axiosDelete, axiosPostForm, axiosAll, axiosPostForm2 };
