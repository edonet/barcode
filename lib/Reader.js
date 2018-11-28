/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2018-11-28 11:14:23
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
import { BrowserCodeReader, NotFoundException } from '@zxing/library';


/**
 *****************************************
 * 抛出接口
 *****************************************
 */
export default BrowserCodeReader;


/**
 *****************************************
 * 扩展原型方法
 *****************************************
 */
BrowserCodeReader.prototype.getStreamFromDevice = getStreamFromDevice;
BrowserCodeReader.prototype.decodeFromVideoStream = decodeFromVideoStream;
BrowserCodeReader.prototype.decodeFromVideoElement = decodeFromVideoElement;


/**
 *****************************************
 * 从设备获取视频流
 *****************************************
 */
function getStreamFromDevice(deviceId) {
    return navigator.mediaDevices.getUserMedia({
        video: deviceId ? { deviceId: { exact: deviceId } } : { facingMode: { exact: 'environment' } }
    });
}


/**
 *****************************************
 * 从视频流中解析
 *****************************************
 */
function decodeFromVideoStream(videoStream, videoElement) {
    let deferred = this.decodeFromVideoElement(videoElement);

    // 设置自动播放
    this.videoElement.setAttribute('autoplay', 'true');

    // 设置视频流
    this.stream = videoStream;
    this.videoElement.srcObject = videoStream;

    // 返回结果
    return deferred;
}


/**
 *****************************************
 * 从视频元素中解析
 *****************************************
 */
function decodeFromVideoElement(videoElement) {

    // 重置对象
    this.reset();

    // 格式化元素
    this.prepareVideoElement(videoElement);

    // 返回结果
    return new Promise((resolve, reject) => {

        // 设置解析回调
        this.videoPlayingEventListener = () => {
            this.decodeOnceWithDelay(resolve, reject);
        };

        // 设置结束回调
        this.videoPlayEndedEventListener = () => {
            this.stop();
            reject(new NotFoundException());
        };

        // 绑定回调
        this.videoElement.addEventListener('playing', this.videoPlayingEventListener);
        this.videoElement.addEventListener('ended', this.videoPlayEndedEventListener);
    });
}
