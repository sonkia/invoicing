/**
 * 子页面入口
 */
import '@babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import { HashRouter, Route,BrowserRouter } from 'react-router-dom';
import { Spin } from 'antd';

import New from './New';
import ProcductTypeList from './List.jsx';

const Main = () => (
  <BrowserRouter>
    <div>
      <Route exact path="/" component={ProcductTypeList} />
      <Route path="/new" component={New} />
      <Route path="/edit/:id" component={New} />
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
                <Main></Main>
            </div>
        );
    }
}
