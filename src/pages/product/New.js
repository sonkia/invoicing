/**
 * 商品管理 - 新建
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Input,Select,message } from 'antd';
import { Link } from 'react-router-dom';
import {
  createProduct,
  checkProductNameExisted,
  checkProductCodeExisted,
  queryById
} from '../../api/product';
import {
  getProductTypes
} from '../../api/product_type';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 8 },
};
const formLayout = {
  wrapperCol: { span: 8 },
};



class New extends React.Component {
    static propTypes = {
      form: PropTypes.shape({
        getFieldDecorator: PropTypes.func.isRequired,
        validateFields: PropTypes.func.isRequired,
        getFieldValue: PropTypes.func.isRequired,
        setFields: PropTypes.func.isRequired,
      }).isRequired,
      history: PropTypes.shape({
        push: PropTypes.func.isRequired,
      }).isRequired,
      location: PropTypes.any.isRequired,
      match: PropTypes.any.isRequired,
    };

    constructor(props) {
        super(props);

    this.state = {
      titleName:"新建商品",
      productTypes:[],
      nameValVisable: false, // 修改：实验名称校验放提交后
      codeValVisable: false,
      nameVal: '', // 修改：实验名称校验放提交后
      codeVal: '',
      productTypeVal: '',
      descriptionVal: '',
      unitCountVal: null,
      id:null,
      submitBtnLoading: false, // 确认提交按钮状态切换
    };

    this.validNameFunction = this.validNameFunction.bind(this);
    this.validCodeFunction = this.validCodeFunction.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getProductTypes = this.getProductTypes.bind(this);
    this.getProductById = this.getProductById.bind(this);
  }

  componentDidMount() {
    this.getProductTypes();
    const { id } = this.props.match.params;
    if(id){
      this.getProductById(id);
    }
    
  }

  getProductById(id){
    queryById(id)
      .then(data => {
        this.setState({
          id:id,
          nameVal: "" + data.data.name,
          codeVal: "" + data.data.code,
          productTypeVal: data.data.productType,
          descriptionVal: data.data.description,
          unitCountVal: ("" + data.data.unitCount),
          titleName:"修改商品",
        });
      })
      .catch(error => {
        alert(error);
        console.error(error);
      });
  }

  getProductTypes(){
    getProductTypes()
      .then(data => {
        this.setState({
          productTypes: data.data,
        });
      })
      .catch(error => {
        alert(error);
        console.error(error);
      });

  }

  // 判断实验名称是否重复
  validNameFunction(rule, value, callback){
    // 修改：实验名称校验放提交后
    alert(value)
    const { nameVal } = this.state;
    if (value !== nameVal) {
      this.setState({
        nameValVisable: false,
      });
      callback();
    }
  };

  validCodeFunction(rule, value, callback){
    // 修改：实验名称校验放提交后
    const { codeVal } = this.state;
    if (value !== codeVal) {
      this.setState({
        codeValVisable: false,
      });
      callback();
    }
  };

  // 提交
  handleSubmit(e){
    // 修改：实验名称校验放提交后
    // e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState(
          {
            submitBtnLoading: true,
          },
          () => {
            let nameCheckParams = {name: values.name,};
            let codeCheckParams = {code: values.code,};
            if(this.state.id){
              nameCheckParams = {
                name: values.name,
                id:this.state.id
              };
              codeCheckParams = {
                code: values.code,
                id:this.state.id
              };
            }
            checkProductNameExisted(nameCheckParams).then(data => {
                if (data.data === true) {
                  message.error("商品名称已存在,请重新输入");
                  this.setState({
                    nameValVisable: true,
                    nameVal: values.name,
                    submitBtnLoading: false,
                  });
                } else {
                  checkProductCodeExisted(codeCheckParams).then(data => {
                      if (data.data === true) {
                        message.error("商品编码已存在,请重新输入");
                        this.setState({
                          codeValVisable: true,
                          codeVal: values.code,
                          submitBtnLoading: false,
                        });
                      } else {
                        createProduct({
                          id:this.state.id,
                          name: values.name,
                          code: values.code,
                          productType: values.productType,
                          description: values.description,
                          unitCount:values.unitCount,
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
                    }).catch(error => {
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
    const { nameValVisable, 
      codeValVisable, 
      submitBtnLoading,
      productTypes,
      nameVal,
      codeVal,
      productTypeVal,
      descriptionVal,
      unitCountVal,
      titleName
    } = this.state;
    return (
      <div>
        <h2 style={{textAlign:"center"}}>{titleName}</h2>
        <Form>
          <FormItem {...formItemLayout} label="商品名称">
            {getFieldDecorator('name', {
              initialValue: nameVal,
              rules: [
                {
                  required: true,
                  message: '名称不能为空',
                },
                {
                  pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/,
                  message: '仅允许输入中英文、数字',
                },
              ],
            })(
              <Input
                placeholder="请输入商品名称"
                maxLength={50}
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="商品编码">
            {getFieldDecorator('code', {
              initialValue: codeVal,
              rules: [
                {
                  required: true,
                  message: '名称不能为空',
                },
                {
                  pattern: /^[A-Za-z0-9]+$/,
                  message: '仅允许输入英文、数字',
                },
              ],
            })(
              <Input
                placeholder="请输入商品编码"
                maxLength={50}
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="商品类型">
            {getFieldDecorator('productType', {
               initialValue: productTypeVal,
               rules: [
                {
                  required: true,
                  message: '商品类型不能为空',
                },
              ],
            })(
              <Select rows={4}
                placeholder="请选择商品类型"
                maxLength={500}
                style={{ resize: 'none' }}
                autosize>
                {
                  productTypes.map(function(name){
                    return <Option key={name} value={name}>{name}</Option>
                  })
                }
                
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="商品描述">
            {getFieldDecorator('description', {
              initialValue: descriptionVal,
            })(
              <TextArea
                rows={4}
                placeholder="请输入商品描述"
                maxLength={500}
                style={{ resize: 'none' }}
                autosize
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="整件单品数量">
            {getFieldDecorator('unitCount', {
              initialValue: unitCountVal,
              rules: [
                {
                  required: true,
                  message: '单品数量不能为空',
                },
                {
                  pattern: /^[1-9]((\d?)|(\d\d?))$/,
                  message: '仅允许输入大于0小于1000的数字',
                },
              ],
            })(
              <Input
                  placeholder="请输入整件单品数量"
                  maxLength={50}
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

