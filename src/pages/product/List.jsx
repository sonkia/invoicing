import React from 'react';
import { Table, Button,Modal,message,Tooltip,Icon } from 'antd';
import { concat } from 'lodash';
import {
        createdProduct,
        getList,
        deleteProduct,
    } from '../../api/product';
import { Link } from 'react-router-dom';


export default class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            deleteModalVisible: false, // 删除遮罩状态
            deleteIsSelected: false, // 是否为批量删除
            deleteModalShowId: '', // 打开遮罩层上面显示的此条数据的id
            deleteBtnSureLoading:false,
            dataList:[],
            selectedRowKeys: [], // Check here to configure the default column
            loading: false,
        };
        this.start = this.start.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
        this.getListData = this.getListData.bind(this);
        this.openDeleteVisibleModal = this.openDeleteVisibleModal.bind(this);
        this.setDeleteVisibleSure = this.setDeleteVisibleSure.bind(this);
        this.setDeleteVisibleCancel = this.setDeleteVisibleCancel.bind(this);
        this.initData = this.initData.bind(this);
    }

    componentDidMount() {
        this.initData();
    }

    initData(){
        this.getListData(      {
            condition:"",
            pageSize: 20,
            pageNo: 1,
          });
    }

    //  取消删除操作
    setDeleteVisibleCancel() {
        this.setState({
        deleteModalVisible: false,
        });
    }

    // 确认删除操作
    setDeleteVisibleSure() {
        const { deleteModalShowId, selectedRowKeys, deleteIsSelected } = this.state;
        const deleteArr = [];
        if (deleteIsSelected) {
        deleteArr.push(...selectedRowKeys);
        } else {
        deleteArr.push(deleteModalShowId);
        }
        this.setState(
        {
            deleteBtnSureLoading: true,
        },
        () => {
            deleteProduct(deleteArr)
            .then(() => {
                this.setState(
                {
                    deleteModalVisible: false,
                    deleteBtnSureLoading: false,
                    expandedRowKeys: [],
                    selectedRowKeys: [],
                    deleteBtnStatus: true,
                    getSampleSetListPage: 1,
                    getSampleSetListTotalPage: 0,
                },
                () => this.initData()
                );
                message.success('删除成功!');
                <Link to={{ pathname: `new`, }}>新增</Link>
            })
            .catch(error => {
                message.error('删除失败!');
                this.setState({
                deleteModalVisible: false,
                deleteBtnSureLoading: false,
                });
                console.error(error);
            });
        }
        );
    }
    openDeleteVisibleModal(deleteType, record, e) {
        // deleteType - true / 批量删除 -false / 单个删除
        if (deleteType) {
          const { selectedRowKeys } = this.state;
          if (selectedRowKeys.length === 0) {
            message.warning('请先选择要删除的数据');
            return;
          }
          this.setState({
            deleteModalVisible: true,
            deleteModalShowId: '',
            deleteIsSelected: true,
          });
        } else {
          e.stopPropagation();
          this.setState({
            deleteModalVisible: true,
            deleteModalShowId: record.id,
            deleteIsSelected: false,
          });
        }
      }

    // 获取列表数据
    getListData(params) {
        this.setState(
            () => {
                getList(params)
                .then(data => {
                    this.setState(({ dataList = [] }) => ({
                    dataList:data.data,
                    }));
                })
                .catch(error => {
                    message.error('列表数据加载失败！');
                });
            }
        );
    }

    start(){
        this.setState({ loading: true });
        // ajax request after empty completing
        setTimeout(() => {
        this.setState({
            selectedRowKeys: [],
            loading: false,
        });
        }, 1000);
    }

    onSelectChange(selectedRowKeys){
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }

    render() {
        const columns = [{
            title: '产品名称',
            dataIndex: 'name',
        }, {
            title: '产品编码',
            dataIndex: 'code',
        }, {
            title: '产品类型',
            dataIndex: 'productType',
        }, {
            title: '产品描述',
            dataIndex: 'description',
        }, {
            title: '整件单品数量',
            dataIndex: 'unitCount',
        },{
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            render: (text, record) => (
              <div>
                <Icon
                    type="form"
                    onClick={e => {
                        e.stopPropagation();
                        // 跳转至建模
                        this.props.history.push(`/new`);
                    }}
                    title="编辑"
                />
                <Icon
                    style={{ marginLeft: 30 }}
                    type="delete"
                    onClick={e => this.openDeleteVisibleModal(false, record, e)}
                    title="删除"
                />
              </div>
            ),
          }];
        
        const { dataList,loading, selectedRowKeys,
            deleteModalVisible, // 删除遮罩状态
            deleteIsSelected, // 是否为批量删除
            deleteModalShowId, // 打开遮罩层上面显示的此条数据的id
            deleteBtnSureLoading,
        } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;
        return (
            <div style={{marginLeft:10,marginRight:10,marginTop:10}}>
                <div style={{marginBottom:10}}>
                    <Button
                        type="primary"
                        onClick={this.start}
                        disabled={!hasSelected}
                        loading={loading}
                    >
                        Reload
                    </Button>
                    <Button
                        type="primary"
                    >
                        <Tooltip placement="bottom" title="新增">
                            <Link to={{ pathname: `new`, }}>新增</Link>
                        </Tooltip>
                    </Button>
                </div>
                <Table style={{textAlign:"center"}} rowKey={record => record.id} bordered={true} rowSelection={rowSelection} columns={columns} dataSource={dataList}/>
                <Modal
                    title="提示"
                    wrapClassName="vertical-center-modal"
                    footer={null}
                    centered
                    bodyStyle={{ textAlign: 'center' }}
                    visible={deleteModalVisible}
                    onCancel={() => this.setDeleteVisibleCancel()}
                    >
                    <p>是否确认删除？</p>
                    <div>
                        <Button
                        type="primary"
                        onClick={() => this.setDeleteVisibleSure()}
                        loading={deleteBtnSureLoading}
                        >
                        确认
                        </Button>
                        <Button style={{ marginLeft: 30 }}
                        onClick={() => this.setDeleteVisibleCancel()}
                        >
                        取消
                        </Button>
                    </div>
                    </Modal>
            </div>
        );
    }
}
