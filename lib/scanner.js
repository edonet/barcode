/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2018-11-28 10:58:05
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
import './Reader';
import { BrowserQRCodeReader, BrowserBarcodeReader } from '@zxing/library';


/**
 *****************************************
 * 定义条码扫描器
 *****************************************
 */
export default class Scanner {

    /* 初始化扫描器 */
    constructor(timeBetweenScansMillis, hints) {
        this.el = null;
        this.devices = null;
        this.selected = 0;
        this.scanning = false;
        this.qrcodeReader = new BrowserQRCodeReader(timeBetweenScansMillis);
        this.barcodeReader = new BrowserBarcodeReader(timeBetweenScansMillis, hints);
    }

    /* 开始扫描 */
    async start(callback) {

        // 获取设备
        await this.getInputDevices();

        // 判断存在设备
        if (this.devices.length) {
            let { deviceId } = this.devices[this.selected] || {},
                result;

            // 创建扫描器元素
            this.createScannerElement();

            // 挂载元素
            this.el.mount();
            this.scanning = true;

            // 启动条码扫描
            result = await Promise.race([
                this.qrcodeReader.decodeFromInputVideoDevice(deviceId, this.el.video),
                this.barcodeReader.decodeFromVideoElement(this.el.video)
            ]);

            // 执行回调
            typeof callback === 'function' && callback(result.text);

            // 卸载元素
            this.el.unmount();
            this.scanning = false;

            // 停止扫描
            this.stop();

            // 返回结果
            return result.text;
        }
    }

    /* 停止扫描 */
    stop() {
        this.qrcodeReader.reset();
        this.barcodeReader.reset();
    }

    /* 获取设备列表 */
    async getInputDevices() {

        // 获取设备
        if (null === this.devices) {
            this.devices = await this.qrcodeReader.getVideoInputDevices();
        }

        // 返回结果
        return this.devices;
    }

    /* 创建扫描器设备 */
    createScannerElement() {

        // 创建元素
        if (null === this.el) {
            let el = document.createElement('div'),
                video = document.createElement('video');

            // 设备属性
            video.width = window.innerWidth;
            video.height = window.innerHeight;

            // 设置样式
            el.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0;';

            // 加载元素
            el.appendChild(video);

            // 生成接口
            this.el = {
                video,
                mount: () => document.body.appendChild(el),
                unmount: () => document.body.removeChild(el)
            };
        }

        // 返回结果
        return this.el;
    }
}
