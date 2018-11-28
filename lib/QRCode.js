/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2018-11-28 21:37:18
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
import observer from 'xtil/observer';
import base64 from 'xtil/base64';
import { BrowserQRCodeSvgWriter } from '@zxing/library';


/**
 *****************************************
 * 生成条码对象
 *****************************************
 */
export default class QRCode {

    /* 初始化对象 */
    constructor({ size = 210 } = {}) {

        // 定义属性
        this.ob = observer();
        this.svg = null;
        this.size = size;

        // 添加监听
        this.ob.subscribe(svg => this.svg = svg);

        // 创建生成器
        this.writer = new BrowserQRCodeSvgWriter({ appendChild: this.ob.notify });
    }

    /* 渲染条码 */
    render(content, hints) {
        if (content) {
            return this.writer.write(content, this.size, this.size, hints);
        }
    }

    /* 保存文件 */
    saveAs(name = 'qrcode.svg') {
        if (this.svg) {
            let serializer = new XMLSerializer(),
                base64Code = base64.encode(serializer.serializeToString(this.svg)),
                base64URL = 'data:image/svg+xml;base64,' + base64Code,
                a = document.createElement('a');

            // 设置属性
            a.download = name;
            a.href = base64URL;
            a.click();
        }
    }

    /* 添加监听 */
    subscribe(callback) {
        return this.ob.subscribe(callback);
    }

    /* 挂载到接点 */
    appendTo(target) {
        if (target) {

            // 挂载元素
            this.svg && target.appendChild(this.svg);

            // 添加监听
            this.ob.subscribe(() => target.innerHTML = '');
            this.ob.subscribe(svg => target.appendChild(svg));
        }
    }

    /* 销毁对象 */
    destroy() {
        this.ob = this.ob.clear();
        this.svg = null;
        this.size = null;
        this.writer = null;
    }
}
