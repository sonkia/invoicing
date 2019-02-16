import React from 'react';
import { Table, Button,message } from 'antd';
import { concat } from 'lodash';
import {
        createDataset,
        getDatasetList,
    } from '../../api/dataset';

const columns = [{
    title: 'Name',
    dataIndex: 'name',
}, {
    title: 'Type',
    dataIndex: 'type',
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
        this.getListData();
    }

    // 获取列表数据
    getListData(params) {
        this.setState(
            () => {
                getDatasetList(params)
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
                </div>
                

                <Table rowKey={record => record.id} bordered={true} rowSelection={rowSelection} columns={columns} dataSource={dataList}/>
            </div>
        );
    }
}
