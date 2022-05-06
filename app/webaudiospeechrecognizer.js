import WebRecorder from "./webrecorder.js";
import SpeechRecognizer from "./speechrecognizer.js";

export default class WebAudioSpeechRecognizer {
  constructor(params) {
    this.params = params;
    this.recorder = null;
    this.speechRecognizer = null;
    this.isCanSendData = false;
    this.audioData = [];
    this.timer = null;
  }
  start() {
    this.recorder = new WebRecorder();
    this.recorder.OnReceivedData = (data) => {
      if (this.isCanSendData) {
        this.speechRecognizer.write(data);
      }
    };
    // 录音失败时
    this.recorder.OnError = (err) => {
      this.stop();
      this.OnError(err);
    }
    this.recorder.start();
    if (!this.speechRecognizer) {
      this.speechRecognizer = new SpeechRecognizer(this.params);
    }
    // 开始识别
    this.speechRecognizer.OnRecognitionStart = (res) => {
      this.OnRecognitionStart(res);
      this.isCanSendData = true;
    };
    // 一句话开始
    this.speechRecognizer.OnSentenceBegin = (res) => {
      this.OnSentenceBegin(res);
    };
    // 识别变化时
    this.speechRecognizer.OnRecognitionResultChange = (res) => {
      this.OnRecognitionResultChange(res);
    };
    // 一句话结束
    this.speechRecognizer.OnSentenceEnd = (res) => {
      this.OnSentenceEnd(res);
    };
    // 识别结束
    this.speechRecognizer.OnRecognitionComplete = (res) => {
      this.OnRecognitionComplete(res);
      this.isCanSendData = false;
    };
    // 识别错误
    this.speechRecognizer.OnError = (res) => {
      this.OnError(res);
      this.recorder.stop();
      this.isCanSendData = false;
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    };
    // 建立连接
    this.speechRecognizer.start();
  }
  stop() {
    if (this.recorder) {
      this.recorder.stop();
    }
    if (this.speechRecognizer) {
      this.speechRecognizer.stop();
    }
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
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
window && (window.WebAudioSpeechRecognizer = WebAudioSpeechRecognizer);
