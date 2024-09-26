import WebRecorder from "./webRecorder";
import SoeNewConnect from "./soeSocket";
export default class SowNewSocketSdk {
  recorder: any;
  soeRecognizer: any;
  params: any;
  isCanSendData: boolean;
  audioData: Array<any>;
  timer: any;
  constructor(params: any) {
    this.params = params;
    this.recorder = null;
    this.soeRecognizer = null;
    this.isCanSendData = false;
    this.audioData = [];
    this.timer = null;
  }
  start() {
    try {
      this.recorder = new WebRecorder();
      this.recorder.OnReceivedData = (data: any) => {
        if (this.isCanSendData) {
          this.soeRecognizer.write(data);
        }
      };
      // 录音失败时
      this.recorder.OnError = (err: any) => {
        this.soeRecognizer && this.soeRecognizer.close();
        this.stop();
        this.OnError(err);
      };
      this.recorder.OnStop = (res: any) => {
        if (this.soeRecognizer) {
          this.soeRecognizer.stop();
        }
        this.OnRecorderStop(res);
      };
      this.recorder.start();

      if (!this.soeRecognizer) {
        this.soeRecognizer = new SoeNewConnect(this.params);
      }
      // 开始识别
      this.soeRecognizer.OnEvaluationStart = (res: any) => {
        if (this.recorder) {
          // 录音正常
          this.OnEvaluationStart(res);
          this.isCanSendData = true;
        } else {
          this.soeRecognizer && this.soeRecognizer.close();
        }
      };
      // 一句话开始
      this.soeRecognizer.OnSentenceBegin = (res: any) => {
        this.OnSentenceBegin(res);
      };
      // 识别变化时
      this.soeRecognizer.OnEvaluationResultChange = (res: any) => {
        this.OnEvaluationResultChange(res);
      };
      // 一句话结束
      this.soeRecognizer.OnSentenceEnd = (res: any) => {
        this.OnSentenceEnd(res);
      };
      // 识别结束
      this.soeRecognizer.OnEvaluationComplete = (res: any) => {
        this.soeRecognizer && this.soeRecognizer.close();
        this.OnEvaluationComplete(res);
        this.isCanSendData = false;
      };
      // 识别错误
      this.soeRecognizer.OnError = (res: any) => {
        this.OnError(res);
        this.recorder.stop();
        this.isCanSendData = false;
        if (this.timer) {
          clearInterval(this.timer);
          this.timer = null;
        }
      };
      // 建立连接
      this.soeRecognizer.start();
    } catch (error) {
      console.log('error', error);
    }
  }
  destroyStream() {
    if (this.recorder) {
      this.recorder.destroyStream();
    }
  }
  // 开始识别的时候
  OnEvaluationStart(res: any) {
    console.log("OnEvaluationStart", res);
  }
  // 一句话开始的时候
  OnSentenceBegin(res: any) {
    console.log("OnSentenceBegin", res);
  }
  // 识别结果发生变化的时候
  OnEvaluationResultChange(res: any) {
    console.log("OnEvaluationResultChange", res);
  }
  // 一句话结束的时候
  OnSentenceEnd(res: any) {
    console.log("OnSentenceEnd", res);
  }
  // 识别结束的时候
  OnEvaluationComplete(res: any) {
    console.log("OnEvaluationComplete", res);
  }
  stop() {
    if (this.recorder) {
      this.recorder.stop();
    }
    if (this.soeRecognizer) {
      console.log("soeRecognizer_stop");
      this.soeRecognizer.stop();
    }
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
  // 识别失败
  OnError(err: any) {
    console.log("error", err);
  }
  OnRecorderStop(res: any) {}
}

window && ((window as any).SowNewSocketSdk = SowNewSocketSdk);
