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
import React, { Component, createRef } from 'react';
import * as barcode from '../lib';

console.log(barcode);

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
        this.ref = createRef();
        this.state = { result: '' };
        this.qrcode = new barcode.QRCode();
        this.scanner = new barcode.Scanner();

        // 绑定回调
        this.handleInput = this.handleInput.bind(this);
        this.startScanning = this.startScanning.bind(this);
        this.saveAs = () => this.qrcode.saveAs();
    }

    /* 渲染组件 */
    render() {
        return (
            <div>
                <p>
                    <button onClick={ this.startScanning }>scan</button>
                    <button onClick={ this.saveAs }>save</button>
                </p>
                <textarea value={ this.state.result } onChange={ this.handleInput }></textarea>
                <p ref={ this.ref } />
            </div>
        );
    }

    /* 组件加载完成 */
    componentDidMount() {
        this.qrcode.appendTo(this.ref.current);
    }

    /* 开始扫描 */
    async startScanning() {
        try {
            this.scanner.start(result => this.setState({ result }));
        } catch (err) {
            console.error(err);
        }
    }

    /* 监听文本输入 */
    handleInput(event) {
        let result = event.target.value;

        // 更新二维码
        this.qrcode.render(result);
        this.setState({ result });
    }
}
