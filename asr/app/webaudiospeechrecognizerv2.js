import WebRecorder from "./webrecorder.js";
import { SpeechRecognizerV2, guid } from "./speechrecognizerv2.js";

export class WebAudioSpeechRecognizerV2 {
  constructor(params, isLog) {
    this.params = params;
    this.recorder = null;
    this.speechRecognizerV2 = null;
    this.isCanSendData = false;
    this.isNormalEndStop = false;
    this.isLog = isLog;
    this.requestId = null;
  }

  start() {
    try {
      this.isLog && console.log('WebAudioSpeechRecognizerV2 start');
      this.requestId = guid();
      this.recorder = new WebRecorder(this.requestId, this.params, this.isLog);
      this.recorder.OnReceivedData = (data) => {
        if (this.isCanSendData) {
          this.speechRecognizerV2 && this.speechRecognizerV2.write(data);
        }
      };
      this.recorder.OnError = (err) => {
        this.speechRecognizerV2 && this.speechRecognizerV2.close();
        this.stop();
        this.OnError(err);
      };
      this.recorder.OnStop = (res) => {
        if (this.speechRecognizerV2) {
          this.speechRecognizerV2.stop();
        }
        this.OnRecorderStop(res);
      };
      this.recorder.start();

      if (!this.speechRecognizerV2) {
        this.speechRecognizerV2 = new SpeechRecognizerV2(this.params, this.requestId, this.isLog);
      }

      this.speechRecognizerV2.OnRecognitionStart = (res) => {
        if (this.recorder) {
          this.OnRecognitionStart(res);
          this.isCanSendData = true;
        } else {
          this.speechRecognizerV2 && this.speechRecognizerV2.close();
        }
      };

      this.speechRecognizerV2.OnRecognitionSentences = (res) => {
        this.OnRecognitionSentences(res);
      };

      this.speechRecognizerV2.OnRecognitionComplete = (res) => {
        this.OnRecognitionComplete(res);
        this.isCanSendData = false;
        this.isNormalEndStop = true;
      };

      this.speechRecognizerV2.OnError = (res) => {
        if (this.speechRecognizerV2 && !this.isNormalEndStop) {
          this.OnError(res);
        }
        this.speechRecognizerV2 = null;
        this.recorder && this.recorder.stop();
        this.isCanSendData = false;
      };

      this.speechRecognizerV2.start();
    } catch (e) {
      console.log(e);
    }
  }

  stop() {
    this.isLog && console.log('WebAudioSpeechRecognizerV2 stop');
    if (this.recorder) {
      this.recorder.stop();
    }
  }

  writeContent(contextPrompt) {
    if (this.speechRecognizerV2) {
      return this.speechRecognizerV2.writeContent(contextPrompt);
    }
    return false;
  }

  destroyStream() {
    this.isLog && console.log('destroyStream', this.recorder);
    if (this.recorder) {
      this.recorder.destroyStream();
    }
  }

  // 开始识别的时候
  OnRecognitionStart(res) {}
  // 句子识别结果回调（透传 socket 消息）
  OnRecognitionSentences(res) {}
  // 识别结束的时候
  OnRecognitionComplete(res) {}
  // 识别失败
  OnError(res) {}
  OnRecorderStop(res) {}
}
typeof window !== 'undefined' && (window.WebAudioSpeechRecognizerV2 = WebAudioSpeechRecognizerV2);
