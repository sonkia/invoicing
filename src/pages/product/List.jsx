import React from 'react';
import { Table, Button,message,Tooltip } from 'antd';
import { concat } from 'lodash';
import {
        createdProduct,
        getList,
    } from '../../api/product';
import { Link } from 'react-router-dom';

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
}];

export default class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            dataList:[],
            selectedRowKeys: [], // Check here to configure the default column
            loading: false,
        };
        this.start = this.start.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
        this.getListData = this.getListData.bind(this);
    }

    componentDidMount() {
        this.getListData(      {
            condition:"",
            pageSize: 20,
            pageNo: 1,
          });
    }

    // 获取列表数据
    getListData(params) {
        this.setState(
            () => {
                getList(params)
                .then(data => {
                    this.setState(({ dataList = [] }) => ({
                    dataList:concat(dataList, data.data),
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
        const { dataList,loading, selectedRowKeys } = this.state;
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
                            <Link
                                to={{
                                pathname: `new`,
                                }}
                            >
                                新增
                            </Link>
                        </Tooltip>
                    </Button>
                </div>
                <Table rowKey={record => record.id} bordered={true} rowSelection={rowSelection} columns={columns} dataSource={dataList}/>
            </div>
        );
    }
}
