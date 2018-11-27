/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2018-11-27 13:51:45
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
import * as zxing from '@zxing/library';


/**
 *****************************************
 * 定义扫描器
 *****************************************
 */
export default async function createSanner() {
    let reader = await createCodeReader(),
        el = createScannerElement();

    // 返回接口
    return {
        start() {
            return el.mount() && reader.start(el.id);
        },
        stop() {
            return reader.stop() || el.unmount();
        }
    };
}


/**
 *****************************************
 * 创建条码读取器
 *****************************************
 */
async function createCodeReader() {
    let qrcodeReader = new zxing.BrowserQRCodeReader(),
        barcodeReader = new zxing.BrowserBarcodeReader(),
        devices = await qrcodeReader.getVideoInputDevices(),
        state = { device: 0, scaning: false };

        alert(devices);

    // 返回接口
    return {
        async start(videoId) {
            let { deviceId } = devices[state.device] || {},
                result;

            // 更新状态
            state.scaning = true;

            alert(deviceId, videoId);

            // 执行解析
            result = await Promise.race([
                qrcodeReader.decodeFromInputVideoDevice(deviceId, videoId),
                barcodeReader.decodeFromInputVideoDevice(deviceId, videoId)
            ]);

            alert(result);

            // 更新状态
            state.scaning = false;

            // 停止扫描
            this.stop();

            // 返回结果
            return result.text;
        },
        stop() {
            state.scaning = false;
            qrcodeReader.reset();
            barcodeReader.reset();
        },
        changeInputDevice(id = 0) {
            if (id !== state.device) {
                state.device = id;
            }
        }
    };
}


/**
 *****************************************
 * 创建元素
 *****************************************
 */
function createScannerElement() {
    let id = 'BARCODE_' + new Date(),
        el = document.createElement('div'),
        video = document.createElement('video');

    // 设置属性
    video.id = id;
    video.width = window.innerWidth;
    video.height = window.innerHeight;

    // 设置样式
    el.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0;';

    // 加载元素
    el.appendChild(video);

    // 返回对象
    return {
        id,
        mount: () => document.body.appendChild(el),
        unmount: () => document.body.removeChild(el)
    };
}
