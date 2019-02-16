import React from 'react';
import { Menu, Icon } from 'antd';
import App from './App.js';
import CommodityList from './commodity/List.jsx';

const SubMenu = Menu.SubMenu;

export default class Sider extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
        path:"first",
        openKeys: ['sub1'],
        rootSubmenuKeys: ['sub1', 'sub2', 'sub3']
    };

    this.onOpenChange = this.onOpenChange.bind(this);
    this.onClickMenu = this.onClickMenu.bind(this);
  }

  onOpenChange(openKeys){
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    if (this.state.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
      });
    }
  }

  onClickMenu(e){
      this.setState({
          path:e.key
      })
  }

  render() {
    const {path} = this.state;
    return (
        <div style={{height: '100%',paddingLeft: 256}}>
            <div style={{ marginLeft:-256,width: 256, height: '100%', float: 'left',backgroundColor:'#001529' }}>
                <Menu
                    theme="dark"
                    mode="inline"
                    openKeys={this.state.openKeys}
                    onOpenChange={this.onOpenChange}
                    onClick={this.onClickMenu}
                    style={{ width: 256 }}
                >
                    <SubMenu key="sub1" title={<span><Icon type="appstore" /><span>Navigation One</span></span>}>
                        <Menu.Item key="first">Option 1</Menu.Item>
                        <Menu.Item key="second" >Option 2</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub2" title={<span><Icon type="appstore" /><span>Navigation Two</span></span>}>
                        <Menu.Item key="five" >Option 1</Menu.Item>
                        <Menu.Item key="sex">Option 2</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub3" title={<span><Icon type="setting" /><span>Navigation Three</span></span>}>
                        <Menu.Item key="nine" >Option 1</Menu.Item>
                        <Menu.Item key="ten" >Option 2</Menu.Item>
                    </SubMenu>
                </Menu>
            </div>

            <div style={{height: '100%',width: '100%',float: 'right'}}> 
                {path === "first" ? <CommodityList></CommodityList> : <App></App>}
            </div>
        </div>
      
    );
  }
}
