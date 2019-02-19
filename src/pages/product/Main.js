/**
 * 子页面入口
 */
import '@babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import { HashRouter, Route,BrowserRouter,Link } from 'react-router-dom';
import { Spin } from 'antd';
import New from './New';
import ProcductList from './List.jsx';

const Main = () => (
  <BrowserRouter>
    <div>
      <Route exact path="/" component={ProcductList} />
      <Route path="/new" component={New} />
      <Route path="/edit/:id" component={ProcductList} />
    </div>
  </BrowserRouter>
);

export default class App extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        return (
            <div >
                <Main>
                </Main>
                
            </div>
        );
    }
}
