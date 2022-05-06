import '../examples/lib/cryptojs.js';

export class NewCredential {
  constructor(query){
    this.config = {
      appid: query.appid,
      secretid: query.secretid,
      token: query.token
    };
    this.query = query || null;
  }

  formatSignString(params){
    let strParam = "";
    let signStr = "asr.cloud.tencent.com/asr/v2/";
    if(this.config['appid']){
      signStr += this.config['appid'];
    }
    const keys = Object.keys(params);
    keys.sort();
    for (let i = 0, len = keys.length; i < len; i++) {
      strParam += `&${keys[i]}=${params[keys[i]]}`;
    }
    return `${signStr}?${strParam.slice(1)}`;
  }
  async createQuery(){
    const params = {};
    const time = new Date().getTime();
    const guid = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0,
          v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    };

    async function getServerTime(){
     return new Promise((resolve, reject)=>{
        try {
          const xhr = new XMLHttpRequest();
          xhr.open("GET", 'https://asr.cloud.tencent.com/server_time', true);
          xhr.send();
          xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
              resolve(xhr.responseText);
            }
          }
        } catch (error) {
          reject(error);
        }
      })
    }
    const serverTime = await getServerTime();
    params['secretid'] = this.config.secretid || '';
    params['engine_model_type'] = this.query.engine_model_type || '16k_zh';
    params['timestamp'] = parseInt(serverTime) || Math.round(time / 1000);
    params['expired'] = Math.round(time / 1000) + 24 * 60 * 60;
    params['nonce'] = Math.round(time / 100000);
    params['voice_id'] = guid();

    // 非必填参数
    this.query.hasOwnProperty('voice_format') && (params['voice_format'] = this.query.voice_format);
    this.query.hasOwnProperty('hotword_id') && (params['hotword_id'] = this.query.hotword_id);
    this.query.hasOwnProperty('needvad') && (params['needvad'] = this.query.needvad);
    this.query.hasOwnProperty('filter_dirty') && (params['filter_dirty'] = this.query.filter_dirty);
    this.query.hasOwnProperty('filter_modal') && (params['filter_modal'] = this.query.filter_modal);
    this.query.hasOwnProperty('filter_punc') && (params['filter_punc'] = this.query.filter_punc);
    this.query.hasOwnProperty('convert_num_mode') && (params['convert_num_mode'] = this.query.convert_num_mode);
    this.query.hasOwnProperty('word_info') && (params['word_info'] = this.query.word_info);
    this.query.hasOwnProperty('vad_silence_time') && (params['vad_silence_time'] = this.query.vad_silence_time);

    this.config.token &&  (params['token'] = this.config.token);

    return params;
  }
  // 获取签名原文
  async getSignStr() {
    const queryStr = await this.createQuery();
    return this.formatSignString(queryStr);
  }
}

export default class SpeechRecognizer {
    constructor(params) {
        this.appid = params.appid || ''
        this.secretid = params.secretid || ''
        this.socket = null;
        this.isSignSuccess = false; // 是否鉴权成功
        this.isSentenceBegin = false; // 是否一句话开始
        this.query = {
            ...params
        };
        // 用户鉴权函数
        this.signCallback = params.signCallback || null;
        this.isRecognizeComplete = false; // 当前是否识别结束
    }
    // 暂停识别，关闭连接
    stop() {
        if (this.socket && this.socket.readyState === 1) {
          this.socket.send(JSON.stringify({type: 'end'}));
        } else {
          this.OnError('连接未建立或连接已关闭');
          if (this.socket && this.socket.readyState === 1) {
            this.socket.close();
          }
        }
    }
    // 拼接鉴权数据
    async getUrl() {
        if (!this.appid || !this.secretid) {
          this.OnError('请确认是否填入appid和secretid');
          return false
        }
        const asr = new NewCredential(this.query);
        const signStr = await asr.getSignStr();
        return `${signStr}&signature=${encodeURIComponent(this.signCallback(signStr))}`;
    }
    // 建立websocket链接 data 为用户收集的音频数据
    async start(){
        const url = await this.getUrl();
        if (!url) {
          this.OnError('鉴权失败');
          return
        }
        const self = this;
        if ('WebSocket' in window) {
          this.socket = new WebSocket(`wss://${url}`);
        } else if ('MozWebSocket' in window) {
          this.socket = new MozWebSocket(`wss://${url}`);
        } else {
          this.OnError('浏览器不支持WebSocket')
          return
        }
        this.socket.onopen = (e) => { // 连接建立时触发
        };
        this.socket.onmessage = (e) => { // 连接建立时触发
          const response = JSON.parse(e.data);
          if (response.code !== 0) {
            this.OnError(response.message);
            self.socket.close();
            return;
          } else {
            if (!this.isSignSuccess) {
              this.OnRecognitionStart(response);
              this.isSignSuccess = true;
            }
            if (response.final === 1) {
              this.isRecognizeComplete = true;
              this.OnRecognitionComplete(response);
              return;
            }
            if (response.result) {
              if (response.result.slice_type === 0) {
                this.OnSentenceBegin(response);
                this.isSentenceBegin = true;
              } else  if (response.result.slice_type === 2) {
                if (!this.isSentenceBegin) {
                  this.OnSentenceBegin(response);
                }
                this.OnSentenceEnd(response);
              } else {
                this.OnRecognitionResultChange(response);
              }
            }
          }
        };
        this.socket.onerror = (e) => { // 通信发生错误时触发
          this.socket.close();
          this.OnError(e);
        }
        this.socket.onclose = (event) => {
          if (!this.isRecognizeComplete) {
            this.OnError(event);
          }
        }
    }
    // 发送数据
    write(data) {
      if (!this.socket || this.socket.readyState !== 1) {
        this.OnError('连接未建立，请稍后发送数据！')
        return
      }
      this.socket.send(data);
    };
    // 开始识别的时候
    OnRecognitionStart(res) {

    }
    // 一句话开始的时候
    OnSentenceBegin(res) {

    }
    // 识别结果发生变化的时候
    OnRecognitionResultChange() {

    }
    // 一句话结束的时候
    OnSentenceEnd() {

    }
    // 识别结束的时候
    OnRecognitionComplete() {

    }
    // 识别失败
    OnError() {

    }
}
window && (window.SpeechRecognizer = SpeechRecognizer);
