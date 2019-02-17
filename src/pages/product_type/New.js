/**
 * 产品类型管理 - 新建
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Input } from 'antd';
import { Link } from 'react-router-dom';
import {
  createProductType,
  checkProductTypeNameExisted,
  checkProductTypeCodeExisted,
} from '../../api/product_type';

const FormItem = Form.Item;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 8 },
};
const formTailLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 8 },
};



class New extends React.Component {

    static propTypes = {
        form: PropTypes.shape({
          getFieldDecorator: PropTypes.func.isRequired,
          validateFields: PropTypes.func.isRequired,
        }).isRequired,
        history: PropTypes.shape({
          push: PropTypes.func.isRequired,
        }).isRequired,
    };
    constructor(props) {
        super(props);

    this.state = {
      nameValVisable: false, // 修改：实验名称校验放提交后
      nameVal: '', // 修改：实验名称校验放提交后
      submitBtnLoading: false, // 确认提交按钮状态切换
    };

    this.validFunction = this.validFunction.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // 判断实验名称是否重复
  validFunction(rule, value, callback){
    // 修改：实验名称校验放提交后
    const { nameVal } = this.state;
    if (value !== nameVal) {
      this.setState({
        nameValVisable: false,
      });
      callback();
    }
  };

  // 提交
  handleSubmit(e){
    // 修改：实验名称校验放提交后
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState(
          {
            submitBtnLoading: true,
          },
          () => {
            checkProductTypeNameExisted({
              name: values.name,
            })
              .then(data => {
                if (data.data === true) {
                  // callback('该实验名称已存在,请重新输入');
                  this.setState({
                    nameValVisable: true,
                    nameVal: values.name,
                    submitBtnLoading: false,
                  });
                } else {
                  createProductType({
                    name: values.name,
                    code: values.code,
                    description: values.description,
                  })
                    .then(data1 => {
                      this.setState({
                        submitBtnLoading: false,
                      });
                      const { history } = this.props;
                      history.push(``);
                    })
                    .catch(error => {
                      this.setState({
                        submitBtnLoading: false,
                      });
                      console.error(error);
                    });
                }
              })
              .catch(error => {
                this.setState({
                  submitBtnLoading: false,
                });
                console.error(error);
              });
          }
        );
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    console.log('0000' + getFieldDecorator);
    const { nameValVisable, submitBtnLoading } = this.state;
    return (
      <div>
        <h2 style={{textAlign:"center"}}>新建产品类型</h2>
        <Form>
          <FormItem {...formItemLayout} label="产品类型名称">
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: '名称不能为空',
                },
                {
                  pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/,
                  message: '仅允许输入中英文、数字',
                },
                {
                  validator: this.validFunction,
                },
              ],
            })(
              // 修改：实验名称校验放提交后
              <div>
                <Input
                  placeholder="请输入产品类型名称"
                  maxLength={50}
                />
                {nameValVisable ? (
                  <div>
                    该名称已存在,请重新输入{' '}
                  </div>
                ) : (
                  ''
                )}
              </div>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="产品类型编码">
            {getFieldDecorator('code', {
              rules: [
                {
                  required: true,
                  message: '编码不能为空',
                },
                {
                  pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/,
                  message: '仅允许输入中英文、数字',
                },
                {
                  validator: this.validFunction,
                },
              ],
            })(
              <div>
                <Input
                  placeholder="请输入编码"
                  maxLength={50}
                />
                {nameValVisable ? (
                  <div>
                    该编码已存在,请重新输入{' '}
                  </div>
                ) : (
                  ''
                )}
              </div>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="产品类型描述">
            {getFieldDecorator('description', {})(
              <TextArea
                rows={4}
                placeholder="请输入描述"
                maxLength={500}
                style={{ resize: 'none' }}
                autosize
              />
            )}
          </FormItem>
          <FormItem wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: { span: 16, offset: 9 },
          }}>
            <Button
              type="primary"
              onClick={this.handleSubmit}
              loading={submitBtnLoading}
            >
              提交
            </Button>
            <Link style={{ marginLeft: 50 }} to="/">
              <Button>取消</Button>
            </Link>
            
          </FormItem>
        </Form>
      </div>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(New);
export default WrappedNormalLoginForm;

