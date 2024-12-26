import { SoeNewCredential } from "../lib/credential";
import * as CryptoJS from "crypto-js";
export default class SoeNewConnect {
  appid: string;
  secretid: string;
  secretkey: string;
  socket: WebSocket | null;
  isSignSuccess: boolean;
  isRecognizeComplete: boolean;
  isSentenceBegin: boolean;
  query: any;
  isLog: boolean;
  logServer: any;
  constructor(query: any, isLog: boolean = false, logServer: any) {
    this.appid = query.appid || "";
    this.secretid = query.secretid || "";
    this.secretkey = query.secretkey || "";
    this.socket = null;
    this.isSignSuccess = false; // 是否鉴权成功
    this.isSentenceBegin = false; // 是否一句话开始
    // 用户鉴权函数
    this.isRecognizeComplete = false; // 当前是否识别结束
    this.query = query;
    this.isLog = isLog;
    this.logServer = logServer;
  }
  // 签名函数示例
  signCallback(signStr: string) {
    // 使用CryptoJS的HmacSHA1方法计算HMAC
    const hmac = CryptoJS.HmacSHA1(signStr, this.secretkey);

    // 将计算结果转换为Base64编码的字符串
    const signature = CryptoJS.enc.Base64.stringify(hmac);
    return signature;
  }
  // 暂停识别，关闭连接
  stop() {
    if (this.socket && this.socket.readyState === 1) {
      this.socket.send(JSON.stringify({ type: "end" }));
    } else {
      // this.OnError("连接未建立或连接已关闭");
      if (this.socket && this.socket.readyState === 1) {
        this.socket.close();
      }
    }
  }
  // 拼接鉴权数据
  async getUrl() {
    if (!this.appid || !this.secretid) {
    }
    const soe = new SoeNewCredential(this.query);
    const { urlStr, signStr } = await soe.getSignStr();
    return `${urlStr}&signature=${encodeURIComponent(
      this.signCallback(signStr)
    )}`;
  }
  async start() {
    const url = await this.getUrl();
    const self = this;
    if ("WebSocket" in window) {
      this.socket = new WebSocket(`wss://${url}`);
    } else {
      return;
    }
    if (this.socket) {
      this.socket.onopen = (e) => {
        // 连接建立时触发
      };
      this.socket.onmessage = (e) => {
        // 连接建立时触发
        const response = JSON.parse(e.data);
        if (response.code !== 0) {
          this.OnError(response.message);
          self.socket?.close();
          return;
        } else {
          if (!this.isSignSuccess) {
            this.OnEvaluationStart(response);
            this.isSignSuccess = true;
          }
          if (response.final === 1) {
            this.isRecognizeComplete = true;
            this.OnEvaluationComplete(response);
            return;
          }
          if (response.result) {
            this.OnEvaluationResultChange(response);
          }
        }
      };
      this.socket.onerror = (e: any) => {
        // 通信发生错误时触发
        this.socket?.close();
        this.OnError(e);
      };
      this.socket.onclose = (event: any) => {
        if (!this.isRecognizeComplete) {
          this.OnError(event);
        }
      };
    }
  }
  // 发送数据
  write(data: any) {
    if (!this.socket || this.socket.readyState !== 1) {
      this.OnError("连接未建立，请稍后发送数据！");
      return;
    }
    this.socket.send(data);
  }
  // 开始识别的时候
  OnEvaluationStart(res: any) {}
  // 识别结果发生变化的时候
  OnEvaluationResultChange(res: any) {}
  // 识别结束的时候
  OnEvaluationComplete(res: any) {}
  // 识别失败
  OnError(err: any) {}
  close() {
    // if (this.socket && this.socket.readyState === 1) {
    this.socket && this.socket.close(1000);
    return;
    // }
  }
  async OndownloadLogs() {
    if (!this.logServer) {
      return;
    }
    const res = await this.logServer.QueryLog();
    return res;
  }
}

window && ((window as any).SoeNewConnect = SoeNewConnect);
