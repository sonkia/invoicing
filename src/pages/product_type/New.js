/**
 * 商品类型管理 - 新建
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Input,message } from 'antd';
import { Link } from 'react-router-dom';
import {
  createProductType,
  checkProductTypeNameExisted,
  checkProductTypeCodeExisted,
  queryById,
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
      titleName:"新建商品类型",
      nameValVisable: false, // 修改：实验名称校验放提交后
      codeValVisable: false,
      nameVal: '', // 修改：实验名称校验放提交后
      codeVal:'',
      descriptionVal:'',
      id:null,
      submitBtnLoading: false, // 确认提交按钮状态切换
    };

    this.validNameFunction = this.validNameFunction.bind(this);
    this.validCodeFunction = this.validCodeFunction.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getProductTypeById = this.getProductTypeById.bind(this);
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    if(id){
      this.getProductTypeById(id);
    }
  }

  getProductTypeById(id){
    queryById(id)
      .then(data => {
        this.setState({
          id:id,
          nameVal: "" + data.data.name,
          codeVal: "" + data.data.code,
          descriptionVal: data.data.description,
          titleName:"修改商品类型",
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
    const { nameVal } = this.state;
    if (value !== nameVal) {
      this.setState({
        nameValVisable: false,
      });
      callback();
    }
  };

  // 判断实验code是否重复
  validCodeFunction(rule, value, callback){
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
            checkProductTypeNameExisted(nameCheckParams).then(data => {
                if (data.data === true) {
                  message.error("商品类型名称已存在,请重新输入");
                  this.setState({
                    nameValVisable: true,
                    nameVal: values.name,
                    submitBtnLoading: false,
                  });
                } else {
                    checkProductTypeCodeExisted(codeCheckParams).then(data => {
                        if (data.data === true) {
                          message.error("商品类型编码已存在,请重新输入");
                          alert(1);
                          this.setState({
                            codeValVisable: true,
                            codeVal: values.code,
                            submitBtnLoading: false,
                          });
                        } else {
                          createProductType({
                            id:this.state.id,
                            name: values.name,
                            code: values.code,
                            description: values.description,
                          }).then(data1 => {
                              this.setState({
                                submitBtnLoading: false,
                              });
                              const { history } = this.props;
                              history.push(``);
                            }).catch(error => {
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
      nameVal,
      codeVal,
      descriptionVal,
      titleName } = this.state;
    return (
      <div>
        <h2 style={{textAlign:"center"}}>{titleName}</h2>
        <Form>
          <FormItem {...formItemLayout} label="商品类型名称">
            {getFieldDecorator('name', {
              initialValue: nameVal,
              rules: [
                {
                  required: true,
                  message: '商品类型名称不能为空',
                },
                {
                  pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/,
                  message: '仅允许输入中英文、数字',
                },
              ],
            })(
              // 修改：实验名称校验放提交后
              <Input
                  placeholder="请输入商品类型名称"
                  maxLength={50}
                />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="商品类型编码">
            {getFieldDecorator('code', {
              initialValue: codeVal,
              rules: [
                {
                  required: true,
                  message: '商品类型编码不能为空',
                },
                {
                  pattern: /^[A-Za-z0-9]+$/,
                  message: '仅允许输入英文、数字',
                },
              ],
            })(
              <Input
                  placeholder="请输入商品类型编码"
                  maxLength={50}
                />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="商品类型描述">
            {getFieldDecorator('description', {
              initialValue: descriptionVal,
            })(
              <TextArea
                rows={4}
                placeholder="请输入商品类型描述"
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

