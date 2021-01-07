function to16BitPCM(input) {
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
function to16kHz(audioData) {
  const data = new Float32Array(audioData);
  const fitCount = Math.round(data.length * (16000 / 44100));
  const newData = new Float32Array(fitCount);
  const springFactor = (data.length - 1) / (fitCount - 1);
  newData[0] = data[0];
  for (let i = 1; i < fitCount - 1; i++) {
    const tmp = i * springFactor;
    const before = Math.floor(tmp).toFixed();
    const after = Math.ceil(tmp).toFixed();
    const atPoint = tmp - before;
    newData[i] = data[before] + (data[after] - data[before]) * atPoint;
  }
  newData[fitCount - 1] = data[data.length - 1];
  return newData;
}
export default class WebRecorder {
  constructor() {
    if (!WebRecorder.instance) {
      this.audioContext = null;
      WebRecorder.instance = this;
    }
  }
  start() {
    if (this.audioContext) {
      this.OnError('录音已开启');
      return;
    }
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
      || navigator.mozGetUserMedia || navigator.msGetUserMedia;

    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.audioContext.resume();
      if (!this.audioContext) {
        this.OnError('浏览器不支持webAudioApi相关接口');
        return;
      }
    } catch (e) {
      if (!this.audioContext) {
        this.OnError('浏览器不支持webAudioApi相关接口');
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
        .then(stream => {
          getAudioSuccess(stream);
        })
        .catch(e => {
          getAudioFail(e);
        });
    } else if (navigator.getUserMedia) {
      navigator.getUserMedia(
        {
          audio: true,
          video: false,
        },
        stream => {
          getAudioSuccess(stream);
        },
        function(e) {
          getAudioFail(e);
        }
      );
    } else {
      if (navigator.userAgent.toLowerCase().match(/chrome/) && location.origin.indexOf('https://') < 0) {
        this.OnError('chrome下获取浏览器录音功能，因为安全性问题，需要在localhost或127.0.0.1或https下才能获取权限');
      } else {
        this.OnError('无法获取浏览器录音功能，请升级浏览器或使用chrome');
      }
      this.audioContext && this.audioContext.close();
      return;
    }
    const getAudioSuccess = (stream) => {
        // 将麦克风的声音输入这个对象
        const mediaStreamSource = this.audioContext.createMediaStreamSource(stream); // 将声音对象输入这个对象
        // 创建一个音频分析对象，采样的缓冲区大小为0（自动适配），输入和输出都是单声道
        const scriptProcessor = this.audioContext.createScriptProcessor(0,1,1);
        scriptProcessor.onaudioprocess = e => {
          // 去处理音频数据
          const inputData = e.inputBuffer.getChannelData(0);
          const output = to16kHz(inputData);
          const audioData = to16BitPCM(output);

          this.OnReceivedData(audioData.buffer);
        };

        // 连接
        mediaStreamSource.connect(scriptProcessor);
        scriptProcessor.connect(this.audioContext.destination);
    };
    const getAudioFail = (err) => {
      this.OnError(err);
      this.stop();
    };
  }
  stop() {
    if (!(/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent))){
      this.audioContext && this.audioContext.suspend();
    }
  }
  OnReceivedData(data) { // 获取音频数据

  }
  OnError(res) {

  }
}
window && (window.WebRecorder = WebRecorder);
