const audioWorkletCode = `
class MyProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super(options);
    this.audioData = [];
    this.nextUpdateFrame = 40;
  }

  get intervalInFrames() {
    return 200 / 1000 * sampleRate;
  }

  process(inputs) {
    // 去处理音频数据
    // eslint-disable-next-line no-undef
    if (inputs[0][0]) {
      const output = ${to16kHz}(inputs[0][0], sampleRate);
      const audioData = ${to16BitPCM}(output);
      const data = [...new Int8Array(audioData.buffer)];
      this.audioData = this.audioData.concat(data);
      this.nextUpdateFrame -= inputs[0][0].length;
      if (this.nextUpdateFrame < 0) {
        this.nextUpdateFrame += this.intervalInFrames;
        this.port.postMessage({
          audioData: new Int8Array(this.audioData)
        });
        this.audioData = [];
      }
        return true;
      }
  }
}

registerProcessor('my-processor', MyProcessor);
`;
const audioWorkletBlobURL = window.URL.createObjectURL(
  new Blob([audioWorkletCode], { type: "text/javascript" })
);

function to16BitPCM(input: any) {
  const dataLength = input.length * (16 / 8);
  const dataBuffer = new ArrayBuffer(dataLength);
  const dataView = new DataView(dataBuffer);
  let offset = 0;
  for (let i = 0; i < input.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, input[i]));
    dataView.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return dataView;
}
function to16kHz(audioData: any, sampleRate = 44100) {
  const data = new Float32Array(audioData);
  const fitCount = Math.round(data.length * (16000 / sampleRate));
  const newData = new Float32Array(fitCount);
  const springFactor = (data.length - 1) / (fitCount - 1);
  newData[0] = data[0];
  for (let i = 1; i < fitCount - 1; i++) {
    const tmp = i * springFactor;
    const before: any = Math.floor(tmp).toFixed();
    const after: any = Math.ceil(tmp).toFixed();
    const atPoint = tmp - before;
    newData[i] = data[before] + (data[after] - data[before]) * atPoint;
  }
  newData[fitCount - 1] = data[data.length - 1];
  return newData;
}
export default class WebRecorder {
  audioData: Array<any>;
  stream: any;
  audioContext: any;
  static instance: any;
  isLog: boolean;
  logServer: any;
  requestId: string;
  allAudioData: any;
  constructor(isLog: boolean = false, logServer: any, requestId: string = "") {
    this.audioData = [];
    this.stream = null;
    this.audioContext = null;
    if (!WebRecorder.instance) {
      WebRecorder.instance = this;
    }
    this.isLog = isLog;
    this.logServer = logServer;
    this.requestId = requestId;
    this.allAudioData = [];
  }
  start() {
    this.allAudioData = [];
    if (this.audioContext) {
      this.OnError("录音已开启");
      return;
    }
    const navigator = (window as any).navigator;
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;

    try {
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      this.audioContext.resume();
      if (!this.audioContext) {
        this.OnError("浏览器不支持webAudioApi相关接口");
        return;
      }
    } catch (e) {
      if (!this.audioContext) {
        this.OnError("浏览器不支持webAudioApi相关接口");
        return;
      }
    }

    // 获取用户的麦克风
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video: false,
        })
        .then((stream: any) => {
          getAudioSuccess(stream);
        })
        .catch((e: any) => {
          getAudioFail(e);
        });
    } else if (navigator.getUserMedia) {
      navigator.getUserMedia(
        {
          audio: true,
          video: false,
        },
        (stream: any) => {
          getAudioSuccess(stream);
        },
        function (e: any) {
          getAudioFail(e);
        }
      );
    } else {
      if (
        navigator.userAgent.toLowerCase().match(/chrome/) &&
        location.origin.indexOf("https://") < 0
      ) {
        this.OnError(
          "chrome下获取浏览器录音功能，因为安全性问题，需要在localhost或127.0.0.1或https下才能获取权限"
        );
      } else {
        this.OnError("无法获取浏览器录音功能，请升级浏览器或使用chrome");
      }
      this.audioContext && this.audioContext.close();
      return;
    }
    const getAudioSuccess = (stream: any) => {
      this.stream = stream;
      const mediaStreamSource = this.audioContext.createMediaStreamSource(
        this.stream
      ); // 将声音对象输入这个对象
      if (this.audioContext.audioWorklet) {
        this.audioContext.audioWorklet
          .addModule(audioWorkletBlobURL)
          .then(() => {
            const myNode = new AudioWorkletNode(
              this.audioContext,
              "my-processor",
              { numberOfInputs: 1, numberOfOutputs: 1, channelCount: 1 }
            );
            myNode.port.onmessage = (event) => {
              this.OnReceivedData(event.data.audioData);
              this.allAudioData.push(...event.data.audioData);
            };
            mediaStreamSource
              .connect(myNode)
              .connect(this.audioContext.destination);
          })
          .catch((err: any) => this.OnError(err));
      } else {
        // 创建一个音频分析对象，采样的缓冲区大小为0（自动适配），输入和输出都是单声道
        const scriptProcessor = this.audioContext.createScriptProcessor(
          0,
          1,
          1
        );
        scriptProcessor.onaudioprocess = (e: any) => {
          // 去处理音频数据
          const inputData = e.inputBuffer.getChannelData(0);
          const output = to16kHz(inputData, this.audioContext.sampleRate);
          const audioData = to16BitPCM(output);
          this.audioData.push(...new Int8Array(audioData.buffer));
          this.allAudioData.push(...new Int8Array(audioData.buffer));
          if (this.audioData.length > 6400) {
            const audioDataArray = new Int8Array(this.audioData);
            this.OnReceivedData(audioDataArray);
            this.audioData = [];
          }
        };
        // 连接
        mediaStreamSource.connect(scriptProcessor);
        scriptProcessor.connect(this.audioContext.destination);
      }
    };
    const getAudioFail = (err: any) => {
      this.OnError(err);
      this.stop();
    };
  }
  stop() {
    if (
      !(
        /Safari/.test(navigator.userAgent) &&
        !/Chrome/.test(navigator.userAgent)
      )
    ) {
      this.audioContext && this.audioContext.suspend();
    }
    this.audioContext && this.audioContext.suspend();
    // 关闭通道
    if (this.stream) {
      this.stream.getTracks().map((val: any) => {
        val.stop();
      });
      this.stream = null;
    }
    this.OnStop(this.allAudioData);
  }
  OnReceivedData(data: any) {
    // 获取音频数据
  }
  OnError(res: any) {}

  OnStop(res: any) {}
}
window && ((window as any).WebRecorder = WebRecorder);
