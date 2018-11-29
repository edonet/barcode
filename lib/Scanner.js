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
import defer from 'xtil/defer';
import { BrowserQRCodeReader, BrowserBarcodeReader } from '@zxing/library';
import './Reader';


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
        this.deferred = null;
        this.listeners = [];
        this.qrcodeReader = new BrowserQRCodeReader(timeBetweenScansMillis);
        this.barcodeReader = new BrowserBarcodeReader(timeBetweenScansMillis, hints);
    }

    /* 开始扫描 */
    async start(callback) {

        // 获取设备
        await this.getInputDevices();

        // 判断存在设备
        if (this.devices.length) {
            let deferred = defer();

            // 创建扫描器元素
            this.createScannerElement();

            // 挂载元素
            this.el.mount();
            this.scanning = true;

            // 添加监听回调
            this.listeners.push((err, result) => {

                // 执行回调
                typeof callback === 'function' && callback(err ? '' : result);

                // 解析结果
                err ? deferred.reject(err) : deferred.resolve(result);
            });

            // 启动解码
            this.decode();

            // 返回结果
            return await deferred.promise;
        }
    }

    /* 停止扫描 */
    stop() {

        // 卸载元素
        this.el.unmount();
        this.scanning = false;

        // 重新读码器
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

    /* 启动解码 */
    decode() {
        if (!this.deferred || this.deferred.selected !== this.selected) {
            let selected = this.selected,
                { deviceId } = this.devices[selected] || {};

            // 生成延时对象
            this.deferred = Promise.race([
                this.qrcodeReader.decodeFromInputVideoDevice(deviceId, this.el.video),
                this.barcodeReader.decodeFromVideoElement(this.el.video)
            ]);

            // 缓存选择设备
            this.deferred.selected = selected;

            // 监听成功回调
            this.deferred = this.deferred.then(res => {
                if (selected === this.selected) {
                    this.listeners.forEach(cb => cb(null, res.text));
                    this.listeners = [];
                    this.stop();
                }
            });

            // 监听失败返回
            this.deferred = this.deferred.catch(err => {
                if (selected === this.selected) {
                    this.listeners.forEach(cb => cb(err));
                    this.listeners = [];
                    this.stop();
                }
            });
        }
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
