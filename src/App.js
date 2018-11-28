/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2018-11-28 13:43:34
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
import React, { Component } from 'react';
import { Scanner } from '../lib';


/**
 *****************************************
 * 创建任务
 *****************************************
 */
export default class App extends Component {

    /* 初始化组件 */
    constructor(props, ...args) {
        super(props, ...args);

        // 定义属性
        this.state = { result: '' };
        this.scanner = new Scanner();

        // 绑定回调
        this.startScanning = this.startScanning.bind(this);
    }

    /* 渲染组件 */
    render() {
        return (
            <div>
                <button onClick={ this.startScanning }>start</button>
                <p>{ this.state.result }</p>
            </div>
        );
    }

    /* 开始扫描 */
    async startScanning() {
        try {
            this.scanner.start(result => this.setState({ result }));
        } catch (err) {
            console.error(err);
        }
    }
}
