## 版本更新能力

| 版本  |          更新内容           |
| :---- | :-------------------------: |
| 1.0.0 | 口语评测支持 websocket 协议 |

## 发音评估

发音评估提供四种模式：词模式，句子模式，段落模式，自由说模式

## 引入方式

1. 在 htm 中全局引入 TencentSOE-0.0.1.js 或者使用 import 在代码中引入
2. 初始化 soe

```
 new window.SowNewSocketSdk(params) / new SowNewSocketSdk(params);
```

## 使用说明

在第一次使用插件之前，请前往 https://console.cloud.tencent.com/capi 申请安全凭证。 安全凭证包括 secretId 和 secretKey：

secretId 用于标识 API 调用者身份
secretKey 用于加密签名字符串和服务器端验证签名字符串的密钥。
用户必须严格保管安全凭证，避免泄露。

## 口语评测（websocket）

1)获取实时录音评测管理器**speechEvaluationManager**
const speechEvaluationManager = new window.SowNewSocketSdk(params);

**speechEvaluationManager 对象的方法列表：**

| 方法                     |   参数   | 说明                       |
| :----------------------- | :------: | :------------------------- |
| start                    | options  | 开始评测                   |
| stop                     |          | 结束评测                   |
| OnEvaluationStart        | callback | 开始评测回调               |
| OnEvaluationResultChange | callback | 评测结果变化回调           |
| OnEvaluationComplete     | callback | 评测完成回调               |
| OnError                  | callback | 评测错误回调               |
| OnRecorderStop           | callback | 录音结束回调               |
| OnFrameRecorded          | callback | 监听已录制完指定帧大小回调 |

**start(options)说明：**

**接口文档 https://cloud.tencent.com/document/product/1774/107497**

**示例代码:**

```
    // index.js
    // 实例化类 isLog为可选参数，类型为布尔值，当isLog为true时，打印本地日志并将日志存入indexDB。
    const soeEvaluationManager = new window.SowNewSocketSdk(params, isLog);

    // 请在页面onLoad时初始化好下列函数并确保腾讯云账号信息已经设置
    // 开始评测
    soeEvaluationManager.OnRecognitionStart = (res) => {
      console.log('开始评测', res);
    }
    // 评测变化时
    soeEvaluationManager.OnRecognitionResultChange = (res) => {
      console.log('评测变化时', res)
    }
    // 评测结束
    soeEvaluationManager.OnRecognitionComplete = (res) => {
      console.log('评测结束', res);
    }
    // 评测错误
    soeEvaluationManager.OnError = (res) => {
      console.log('评测失败', res);
    }
    // 录音结束（最长10分钟）时回调
    soeEvaluationManager.OnRecorderStop = (res) => {
      console.log('录音结束', res);
    }

    // 下载本地日志时回调
    const logs = soeEvaluationManager.OndownloadLogs();

    // 需要开始评测时调用此方法
    const params = {
          secretkey: '',
          secretid:  '',
          appid: '',  // 腾讯云账号appid（非微信appid）
          token: ''  // 选填参数，若密钥为临时密钥，需传此参数。
          // 录音参数
          server_engine_type : '16k_zh',
          text_mode: '',
          ref_text: '',
          eval_mode: '',
          score_coeff: '',
          // 是否返回中间结果
          sentence_info_enabled: 1 // 值为1时，OnRecognitionResultChange回调会有数据
    };

    speechEvaluationManager.start(params);
    // 需要停止评测时调用此方法
    speechEvaluationManager.stop();
```

2)若需要自己处理音频，只调用评测功能，可使用**SoeNewConnect**
const evaluationManager = new window.SoeNewConnect();

**evaluationManager 对象的方法列表：**

| 方法                     |   参数   | 说明             |
| :----------------------- | :------: | :--------------- |
| start                    | options  | 开始评测         |
| stop                     |          | 结束评测         |
| OnEvaluationStart        | callback | 开始评测回调     |
| OnEvaluationResultChange | callback | 评测结果变化回调 |
| OnEvaluationComplete     | callback | 评测完成回调     |
| OnError                  | callback | 评测错误回调     |

**其他参数和返回字段参考 接口文档 https://cloud.tencent.com/document/product/1774/107497**

**示例代码:**

### logServer(可选参数不传默认不开启)为日志存储插件可以使用 window.SoeNewLogRepor 开启日志存储功能

### isLog 为可选参数，类型为布尔值，当 isLog 为 true 时，打印本地日志并将日志存入 indexDB。

```
    const logServer = window.SoeNewLogReport(isLog);
    logServer.LogInit();
    const evaluationManager = new window.SoeNewConnect(params, isLog, logServer);
    const params = {
      secretkey: '',
      secretid:  '',
      appid: '',  // 腾讯云账号appid（非微信appid）
      token: ''  // 选填参数，若密钥为临时密钥，需传此参数。
      // 录音参数
      server_engine_type : '16k_zh',
      text_mode: '',
      ref_text: '',
      eval_mode: '',
      score_coeff: '',
      // 是否返回中间结果
      sentence_info_enabled: 1 // 值为1时，OnRecognitionResultChange回调会有数据
    };

    if (// 可以开始评测了) { // 此处需要判断是否建立连接成功，可在 OnRecognitionStart 回调中加标识判断
        // 发送数据 (此过程应该是一个连续的过程)
        evaluationManager.write(data);
    }
    // 开始评测(此时连接已经建立)
    evaluationManager.OnEvaluationStart = (res) => {
        console.log('开始评测', res)
    }
    // 评测变化时
    evaluationManager.OnEvaluationResultChange = (res) => {
       console.log('评测变化时', res)
    }
    // 评测结束
    evaluationManager.OnEvaluationComplete = (res) => {
       console.log('评测结束', res)
    }
    // 评测错误
    evaluationManager.OnError = (res) => {
       console.log('评测失败', res)
    }

    // 建立websocket连接
    evaluationManager.start(params);

    // 断开连接
    if (连接已经建立...) {
        evaluationManager.stop();
    }

    // 下载本地日志时回调
    const logs = evaluationManager.OndownloadLogs();
```
