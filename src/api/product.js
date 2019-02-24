// 产品管理
import { isEmpty, merge } from 'lodash';
import API from './utils.js';

/**
 * 提交的内容
 * @param {*string} name - 名称，必填项
 * @param {string} code - code
 * @returns {Promise(<object|null>)} - 返回对象中包含ID
 */
export const createProduct = (
  {
    id,
    name,
    code,
    productType,
    description,
    unitCount,
  },
  requestConfig = {}
) =>
  API.post(
    // url
    'invoicing/product',
    // data
    {
      id,
      name,
      code,
      productType,
      description,
      unitCount,
    },
    // config
    requestConfig
  ).then(({ data }) => data || null);

/**
 * 获取产品列表
 * @param {string} condition - 模糊查询`name`，`code`,`productType`
 * @param {number} [pageNo = 1] - 分页，默认为1
 * @param {number} [pageSize = 20] - 每页规则，默认为20条每页
 * @param {*object} requestConfig - axios发起请求时的配置
 * @returns {Promise(<object|null>)} - 返回列表数据及分页数据
 */
export const getList = (  
  { pageNo = 1, pageSize = 20, condition = ''},
  requestConfig = {}
  ) => 
  API.get(
    // url
    'invoicing/product',
    merge(requestConfig, {
      params: {
        pageNo,
        pageSize,
        condition,
      },
    })
  ).then(({ data }) => data || null);

  export const queryById = (
    id = '', 
    requestConfig = {}
    ) => 
    API.get(
      // url
      `invoicing/product/${id}`,
      requestConfig,
    ).then(({ data }) => data || null);
 
  export const deleteProduct = (id = '', requestConfig = {}) =>
    API.delete(
      // url
      `invoicing/product/${id}`,
      requestConfig,
    ).then(({ data }) => data || null);

  /**
 * 获取列表
 * @param {string} name - 
 * @param {string} id - 
 * @param {*object} requestConfig - axios发起请求时的配置
 * @returns {Promise(<object|null>)} - 返回列表数据及分页数据
 */
export const checkProductNameExisted = (  
  { name = '', id = '' },
  requestConfig = {}
) =>
  API.get(
    'invoicing/product/name/repeat',
    merge(requestConfig, {
      params: {
        name,
        id,
      },
    })
  ).then(({ data }) => data || null);

export const checkProductCodeExisted = (  
  { code = '', id = '' },
  requestConfig = {}
) =>
  API.get(
    'invoicing/product/code/repeat',
    merge(requestConfig, {
      params: {
        code,
        id,
      },
    })
  ).then(({ data }) => data || null);