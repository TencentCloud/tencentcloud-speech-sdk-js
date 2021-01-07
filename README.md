# 简介

欢迎使用腾讯云语音SDK，腾讯云语音SDK为开发者提供了访问腾讯云语音识别、语音合成等语音服务的配套开发工具，简化腾讯云语音服务的接入流程。

本项目是腾讯云语音SDK的JS语言版本。

# 依赖环境

1. 使用相关产品前需要在腾讯云控制台已开通相关语音产品。
2. 在腾讯云控制台[访问管理](https://console.cloud.tencent.com/cam/capi)页面获取 SecretID 和 SecretKey 。
3. 在腾讯云控制台[账号信息](https://console.cloud.tencent.com/developer)页面获取AppId。
4. 将获取的参数填入examples/config.js中

# 获取demo安装  项目启动

1. git clone https://github.com/TencentCloud/tencentcloud-speech-sdk-js.git
2. cd tencentcloud-speech-sdk-js
3. 执行 npm install 添加依赖包
4. 执行 npm run dev 访问 http://localhost:3000/examples/index.html 等各html文件可以看到本地运行demo，获取实时识别结果
服务端项目部署引用参考 sdk调用方式

# sdk 调用方式

1. 参考demo 引入examples/config.js、examples/asrauthentication.js和examples/speechrecognizer.js，需设置用户的SecretID，SecretKey 和 AppId。
2. 简单版（使用内置录音）
```javascript 
    const webAudioSpeechRecognizer = new WebAudioSpeechRecognizer();
```
  WebAudioSpeechRecognizer 类，提供 start()、stop()和获取识别结果事件，具体调用参考示例以及examples  
3. 进阶版（自定义数据源）
```javascript 
    const speechRecognizer = new SpeechRecognizer();
```
SpeechRecognizer类，提供 start()、stop()、write()方法和获取识别结果事件，具体调用参考示例以及examples 
除此之外，sdk 也提供了 WebRecorder类，可以获取采集到的浏览器数据（目前内置音频只能获取到16KHz的音频）。  
WebRecorder类 提供start()、stop()方法、OnReceivedData()和OnError()事件。


# 参数特别说明

1. 传参说明  
   因为内置WebRecorder采样16k的数据，所以参数 engine_model_type 需要选择16k的引擎，为 '16k_zh'，其他参数具体可见官网api 文档 https://cloud.tencent.com/document/product/1093/48982
2. examples/asrauthentication.js 为鉴权函数，如需自己鉴权，直接覆盖就可


# 详细说明及示例
示例写法采用es6写法，若要兼容低版本浏览器，需要按照ES5语法书写。
1. WebRecorder 类，采集浏览器音频数据
```javascript 
    // 实例化类
    const recorder = new WebRecorder(); 
    // 开始录音
    recorder.start();
    // 获取采集到的音频数据
    recorder.OnReceivedData = (res) => {
        console.log(res);
    }; 
    // 采集音频出错
    recorder.OnError() = (err) => {
        console.log(err)
    }
    // 结束录音
    recorder.stop();
```   
2. SpeechRecognizer 类
```javascript 
    // 实例化类
    const speechRecognizer = new SpeechRecognizer(params); 
    // 建立websocket连接
    speechRecognizer.start();
    if (// 可以开始识别了) { // 此处需要判断是否建立连接成功，可在 OnRecognitionStart 回调中加标识判断
        // 发送数据 (此过程应该是一个连续的过程)
        speechRecognizer.write(data);
    }
    // 开始识别
    speechRecognizer.OnRecognitionStart = (res) => {
        console.log('开始识别', res)
    }
    // 一句话开始
    speechRecognizer.OnSentenceBegin = (res) => {
       console.log('一句话开始', res)
    }
    // 识别变化时
    speechRecognizer.OnRecognitionResultChange = (res) => {
       console.log('识别变化时', res)
    }
    // 一句话结束
    speechRecognizer.OnSentenceEnd = (res) => {
       console.log('一句话结束', res)
    }
    // 识别结束
    speechRecognizer.OnRecognitionComplete = (res) => {
       console.log('识别结束', res)
    }
    // 识别错误
    speechRecognizer.OnError = (res) => {
       console.log('识别失败', res)
    }   
    // 断开连接
    speechRecognizer.stop();
```  
    
3. WebAudioSpeechRecognizer 类
```javascript 
    // 实例化类
    const webAudioSpeechRecognizer = new WebAudioSpeechRecognizer(params); 
    // 建立录音同时建立websocket连接
    webAudioSpeechRecognizer.start();
    // 开始识别
    webAudioSpeechRecognizer.OnRecognitionStart = (res) => {
       console.log('开始识别', res)
    }
    // 一句话开始
    webAudioSpeechRecognizer.OnSentenceBegin = (res) => {
       console.log('一句话开始', res)
    }
    // 识别变化时
    webAudioSpeechRecognizer.OnRecognitionResultChange = (res) => {
       console.log('识别变化时', res)
    }
    // 一句话结束
    webAudioSpeechRecognizer.OnSentenceEnd = (res) => {
       console.log('一句话结束', res)
    }
    // 识别结束
    webAudioSpeechRecognizer.OnRecognitionComplete = (res) => {
       console.log('识别结束', res)
    }
    // 识别错误
    webAudioSpeechRecognizer.OnError = (res) => {
       console.log('识别失败', res)
    }
     // 断开连接
    webAudioSpeechRecognizer.stop();     
``` 
具体参见 [examples](https://github.com/TencentCloud/tencentcloud-speech-sdk-js/examples) 目录，该目录下包含各语音服务的示例代码。  

# 浏览器兼容性问题
1、sdk内置录音采用 MediaDevices接口，不兼容ie 浏览器，其他浏览器兼容性具体文档可参考 https://developer.mozilla.org/zh-CN/docs/Web/API/MediaDevices

