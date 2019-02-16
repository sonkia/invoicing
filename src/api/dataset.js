// 样本集管理
import { isEmpty, merge } from 'lodash';
import API from './utils.js';

/**
 * 提交样本集的内容
 * @param {*string} name - 样本集的名称，必填项
 * @param {string} type - 样本集的名称
 * @returns {Promise(<object|null>)} - 返回对象中包含样本集ID
 */
export const createDataset = (
  {
    name,
    type,
  },
  requestConfig = {}
) =>
  API.post(
    // url
    'commodity/add',
    // data
    {
      name,
      type,
    },
    // config
    requestConfig
  ).then(({ data }) => data || null);

/**
 * 获取样本集的分页数据及查询
 * @param {string} condition - 模糊查询`name`，`description`
 * @param {number} [pageNo = 1] - 分页，默认为1
 * @param {number} [pageSize = 50] - 每页规则，默认为50条每页
 * @param {*object} requestConfig - axios发起请求时的配置
 * @returns {Promise(<object|null>)} - 返回对象中包含样本集列表数据及分页数据
 */
export const getDatasetList = () =>
  API.get(
    // url
    'commodity/query',
  ).then(({ data }) => data || null);
