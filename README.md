# 简介

欢迎使用腾讯云语音SDK，腾讯云语音SDK为开发者提供了访问腾讯云语音识别、语音合成等语音服务的配套开发工具，简化腾讯云语音服务的接入流程。

本项目是腾讯云语音SDK的JS语言版本。

# 浏览器兼容性问题
1、sdk内置录音采用 MediaDevices接口，不兼容ie浏览器、夸克浏览器和uc浏览器，其他浏览器兼容性具体文档可参考 https://developer.mozilla.org/zh-CN/docs/Web/API/MediaDevices  
2、目前经验证支持sdk的手机型号、浏览器（持续更新中～）

<table>
<thead>
<tr><th>手机型号</th><th>手机版本</th><th>浏览器</th><th>浏览器版本</th></tr>
</thead>
<tbody>
<tr><td rowspan="3">小米8</td><td rowspan="3">MIUI 12.0.3 (Android版本 10)</td><td>小米浏览器</td><td>V13.8.12</td></tr>
<tr><td>chrome浏览器</td><td>chrome 78.0.3904.96</td></tr>
<tr><td>QQ浏览器</td><td>11.2.1.1506</td></tr>
<tr><td rowspan="2">小米 MIX2</td><td rowspan="2">MIUI 12.0.1 (Android版本 9)</td><td>小米浏览器</td><td>V13.7.16</td></tr>
<tr><td>chrome浏览器</td><td>chrome 78.0.3904.96</td></tr>
<tr><td rowspan="4">小米6</td><td rowspan="4">(Android版本 8)</td><td>小米浏览器</td><td>V13.8.12</td></tr>
<tr><td>chrome浏览器</td><td>chrome V81.0.4044.117</td></tr>
<tr><td>QQ浏览器</td><td>V11.2.0.0508</td></tr>
<tr><td>火狐浏览器</td><td>V84.1.4</td></tr>
<tr><td rowspan="4">OPPO R11 Plus</td><td rowspan="4">(Android版本 9)</td><td>自带浏览器</td><td>V10.7.16.2_a088588_210118</td></tr>
<tr><td>chrome浏览器</td><td>V78.0.3904.96</td></tr>
<tr><td>QQ浏览器</td><td>V11.2.0.0504</td></tr>
<tr><td>火狐浏览器</td><td>V85.1.0</td></tr>
<tr><td rowspan="4">ViVo X23</td><td rowspan="4">(Android版本 8.0.1)</td><td>自带浏览器</td><td>V8.9.14.9</td></tr>
<tr><td>chrome浏览器</td><td>V70.0.3538.110</td></tr>
<tr><td>QQ浏览器</td><td>V11.2.0.0504</td></tr>
<tr><td>火狐浏览器</td><td>V85.1.0</td></tr>
<tr><td rowspan="4">三星SM-G955</td><td rowspan="4">(Android版本 9)</td><td>自带浏览器</td><td>V13.2.1.70</td></tr>
<tr><td>chrome浏览器</td><td>V81.0.4044.117</td></tr>
<tr><td>QQ浏览器</td><td>V11.0.8.8812 LAB</td></tr>
<tr><td>火狐浏览器</td><td>V84.1.4</td></tr>
<tr><td rowspan="4">iPhone8</td><td rowspan="4">iOS 14.3</td><td>Safari</td><td></td></tr>
<tr><td>chrome浏览器</td><td>87.0.4280.77</td></tr>
<tr><td>QQ浏览器</td><td>11.2.2.4684</td></tr>
<tr><td>UC 浏览器</td><td>V13.2.3.1428</td></tr>
<tr><td>IPhone XS Max</td><td>ios 14.2</td><td>safari</td><td></td></tr>
<tr><td>IPhone 8</td><td>ios 13.3.1</td><td>safari</td><td></td></tr>
<tr><td>IPhone 7 Plus</td><td>ios 13.6</td><td>safari</td><td></td></tr>
<tr><td>IPhone 12</td><td>ios 14.3</td><td>chrome浏览器</td><td>V87.0.4280.77</td></tr>
</tbody>
</table>

3、目前经验证不支持sdk的手机型号、浏览器（持续更新中～）

<table>
<thead>
<tr><th>手机型号</th><th>手机版本</th><th>浏览器</th><th>浏览器版本</th></tr>
</thead>
<tbody>
<tr><td>小米8</td><td>MIUI 12.0.3 (Android版本 10)</td><td>UC浏览器</td><td>V13.2.3.1103</td></tr>
<tr><td rowspan="2">小米 MIX2</td><td rowspan="2">MIUI 12.0.1 (Android版本 9)</td><td>QQ浏览器</td><td>11.2.1.1506</td></tr>
<tr><td>UC浏览器</td><td>V13.2.3.1103</td></tr>
<tr><td rowspan="3">IPhone XS Max</td><td rowspan="3">ios 14.2</td><td>chrome浏览器</td><td>V83.0.4103.88</td></tr>
<tr><td>QQ浏览器</td><td>V11.1.5.4664</td></tr>
<tr><td>火狐浏览器</td><td>V30.0</td></tr>
<tr><td rowspan="3">IPhone 8</td><td rowspan="3">ios 13.3.1</td><td>chrome浏览器</td><td>V87.0.4280.77</td></tr>
<tr><td>QQ浏览器</td><td>V10.6.3.4472</td></tr>
<tr><td>火狐浏览器</td><td>V30.0</td></tr>
<tr><td rowspan="3">IPhone 7 Plus</td><td rowspan="3">ios 13.6</td><td>chrome浏览器</td><td>V87.0.4280.77</td></tr>
<tr><td>QQ浏览器</td><td>V11.2.2.4684</td></tr>
<tr><td>火狐浏览器</td><td>V30.0</td></tr>
</tbody>
</table>

注意：在个别手机版本上也会存在兼容性问题：  
1）ios16.2不支持getUserMedia录音api;  
2）微信浏览器使用录音时，有版本要求 ios14.3+，6.5+（微信版本）；

# 依赖环境

1. 使用相关产品前需要在腾讯云控制台已开通相关语音产品。
2. 在腾讯云控制台[访问管理](https://console.cloud.tencent.com/cam/capi)页面获取 SecretID 和 SecretKey 。
3. 在腾讯云控制台[账号信息](https://console.cloud.tencent.com/developer)页面获取AppId。
4. 将获取的参数填入examples/config.js中  

注意：   
  1）SecretID 和 SecretKey 作为敏感信息，不建议直接放在前端代码里运行，可以通过接口服务获取，同时建议采取临时密钥方案，具体可参考 [临时身份凭证](https://cloud.tencent.com/document/product/1312/48195)  
  2）将获取到的 tmpSecretId、tmpSecretkey 和 Token 依次作为参数 secretid、secretkey 和 token传入


# 项目目录介绍

1. app目录为源码，分别是：  
    1）webrecorder.js —— 录音  
    2）speechrecognizer.js —— 识别  
    3）webaudiospeechrecognizer.js —— 录音+识别
2. dist目录为压缩后的文件
3. examples目录为demo目录


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
SpeechRecognizer类，提供 start()、stop()、write()方法和获取识别结果事件，具体调用参考示例以及examples，本地调试时，可通过传参开启本地日志打印，
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

// 获取采集到的音频数据
recorder.OnReceivedData = (res) => {
   console.log(res);
};
// 采集音频出错
recorder.OnError() = (err) => {
   console.log(err)
}

// 开始录音
recorder.start();

// 结束录音
recorder.stop();
```   
2. SpeechRecognizer 类
```javascript 
    // 实例化类 requestId, isLog为可选参数，requestId为本地调试时本地唯一的id,isLog为布尔值，为true时，打印本地日志。
const speechRecognizer = new SpeechRecognizer(params, requestId, isLog);

if (// 可以开始识别了) { // 此处需要判断是否建立连接成功，可在 OnRecognitionStart 回调中加标识判断
        // 发送数据 (此过程应该是一个连续的过程)
        speechRecognizer.write(data);
}
// 开始识别(此时连接已经建立)
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

// 建立websocket连接
speechRecognizer.start();

// 断开连接
if (连接已经建立...) {
   speechRecognizer.stop();
}
```  

3. WebAudioSpeechRecognizer 类
```javascript 
    // 实例化类 isLog为可选参数，类型为布尔值，当isLog为true时，打印本地日志。
const webAudioSpeechRecognizer = new WebAudioSpeechRecognizer(params, isLog);

// 开始识别(此时连接已经建立)
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

// 建立录音同时建立websocket连接
webAudioSpeechRecognizer.start();

// 断开连接
if (连接已经建立...) {
   webAudioSpeechRecognizer.stop();
}   

// 调用stop方法后不会主动关闭通道，如果需要关闭通道的话，可以调用destroyStream方法
if (webAudioSpeechRecognizer) {
    webAudioSpeechRecognizer.destroyStream();
}

```

具体参见 [examples](https://github.com/TencentCloud/tencentcloud-speech-sdk-js/tree/main/examples) 目录，该目录下包含各语音服务的示例代码。

