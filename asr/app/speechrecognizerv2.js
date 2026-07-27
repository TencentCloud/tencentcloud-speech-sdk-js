import '../examples/lib/cryptojs.js';

// 识别需要过滤的参数（host 不传入 ws 参数，单独处理）
const needFiltrationParams = ['appid', 'secretkey', 'signCallback', 'echoCancellation', 'host'];

const SIGN_HOST = 'asr.cloud.tencent.com';

function formatSignString(query, params) {
    let strParam = '';
    let signStr = `${SIGN_HOST}/asr/v2/`;
    if (query['appid']) {
        signStr += query['appid'];
    }
    const keys = Object.keys(params);
    keys.sort();
    for (let i = 0, len = keys.length; i < len; i++) {
        strParam += `&${keys[i]}=${params[keys[i]]}`;
    }
    return `${signStr}?${strParam.slice(1)}`;
}

async function createQuery(query) {
    let params = {};
    const time = new Date().getTime();

    async function getServerTime() {
        return new Promise((resolve, reject) => {
            try {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', `https://${SIGN_HOST}/server_time`, true);
                xhr.send();
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        resolve(xhr.responseText);
                    }
                };
            } catch (error) {
                reject(error);
            }
        });
    }

    const serverTime = await getServerTime();
    params['secretid'] = query.secretid || '';
    params['engine_model_type'] = query.engine_model_type || '16k_zh';
    params['timestamp'] = parseInt(serverTime) || Math.round(time / 1000);
    params['expired'] = Math.round(time / 1000) + 24 * 60 * 60;
    params['nonce'] = Math.round(time / 100000);
    params['voice_id'] = guid();
    params['voice_format'] = query.voice_format || 1;
    // 实时语音识别 2.0 固定参数
    params['result_mod'] = 1;
    // speaker_diarization 支持外部传入，默认为 0
    params['speaker_diarization'] = query.speaker_diarization !== undefined ? query.speaker_diarization : 0;

    const tempQuery = { ...query };
    for (let i = 0, len = needFiltrationParams.length; i < len; i++) {
        if (tempQuery.hasOwnProperty(needFiltrationParams[i])) {
            delete tempQuery[needFiltrationParams[i]];
        }
    }
    // result_mod 强制覆盖，避免外部传入
    delete tempQuery['result_mod'];

    params = {
        ...tempQuery,
        ...params,
    };
    return params;
}

export const guid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

async function getUrl(self, params) {
    if (!params.appid || !params.secretid) {
        self.isLog && console.log(self.requestId, '请确认是否填入账号信息', TAG);
        self.OnError('请确认是否填入账号信息');
        return false;
    }
    const urlQuery = await createQuery(params);
    const queryStr = formatSignString(params, urlQuery);
    let signature = '';
    if (params.signCallback) {
        signature = params.signCallback(queryStr);
    } else {
        signature = signCallback(params.secretkey, queryStr);
    }
    // 签名 URL host 始终是 SIGN_HOST，再按需替换为用户指定 host
    const signedUrl = `wss://${queryStr}&signature=${encodeURIComponent(signature)}`;
    if (params.host) {
        return signedUrl.replace(`wss://${SIGN_HOST}`, `wss://${params.host}`);
    }
    return signedUrl;
}

function toUint8Array(wordArray) {
    const words = wordArray.words;
    const sigBytes = wordArray.sigBytes;
    const u8 = new Uint8Array(sigBytes);
    for (let i = 0; i < sigBytes; i++) {
        u8[i] = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
    }
    return u8;
}

function Uint8ArrayToString(fileData) {
    let dataString = '';
    for (let i = 0; i < fileData.length; i++) {
        dataString += String.fromCharCode(fileData[i]);
    }
    return dataString;
}

function signCallback(secretKey, signStr) {
    const hash = window.CryptoJSTest.HmacSHA1(signStr, secretKey);
    const bytes = Uint8ArrayToString(toUint8Array(hash));
    return window.btoa(bytes);
}

const TAG = 'SpeechRecognizerV2';
export class SpeechRecognizerV2 {
    constructor(params, requestId, isLog) {
        this.socket = null;
        this.isSignSuccess = false;
        this.query = { ...params };
        this.isRecognizeComplete = false;
        this.requestId = requestId;
        this.isLog = isLog;
        this.sendCount = 0;
        this.getMessageList = [];
    }

    stop() {
        if (this.socket && this.socket.readyState === 1) {
            this.socket.send(JSON.stringify({ type: 'end' }));
            this.isRecognizeComplete = true;
        } else {
            if (this.socket && this.socket.readyState === 1) {
                this.socket.close();
            }
        }
    }

    async start() {
        this.socket = null;
        this.getMessageList = [];
        const url = await getUrl(this, this.query);
        if (!url) {
            this.isLog && console.log(this.requestId, '鉴权失败', TAG);
            this.OnError('鉴权失败');
            return;
        }
        this.isLog && console.log(this.requestId, 'get ws url', url, TAG);
        if ('WebSocket' in window) {
            this.socket = new WebSocket(url);
        } else if ('MozWebSocket' in window) {
            this.socket = new MozWebSocket(url);
        } else {
            this.isLog && console.log(this.requestId, '浏览器不支持WebSocket', TAG);
            this.OnError('浏览器不支持WebSocket');
            return;
        }

        this.socket.onopen = (e) => {
            this.isLog && console.log(this.requestId, '连接建立', e, TAG);
        };

        this.socket.onmessage = async (e) => {
            try {
                this.getMessageList.push(JSON.stringify(e));
                const response = JSON.parse(e.data);
                if (response.code !== 0) {
                    if (this.socket.readyState === 1) {
                        this.socket.close();
                    }
                    this.isLog && console.log(this.requestId, JSON.stringify(response), TAG);
                    this.OnError(response);
                } else {
                    if (!this.isSignSuccess) {
                        this.OnRecognitionStart(response);
                        this.isSignSuccess = true;
                    }
                    if (response.final === 1) {
                        this.isRecognizeComplete = true;
                        this.OnRecognitionComplete(response);
                        if (this.socket && this.socket.readyState === 1) {
                            this.socket.close(1000);
                        }
                        return;
                    }
                    // 直接透传所有消息给 OnRecognitionSentences
                    this.OnRecognitionSentences(response);
                    this.isLog && console.log(this.requestId, response, TAG);
                }
            } catch (e) {
                this.isLog && console.log(this.requestId, 'socket.onmessage catch error', JSON.stringify(e), TAG);
            }
        };

        this.socket.onerror = (e) => {
            this.isLog && console.log(this.requestId, 'socket error callback', e, TAG);
            if (this.isRecognizeComplete) {
                return;
            }
            this.socket.close();
            this.OnError(e);
        };

        this.socket.onclose = (event) => {
            try {
                if (!this.isRecognizeComplete) {
                    this.isLog && console.log(this.requestId, 'socket is close and error', JSON.stringify(event), TAG);
                    this.OnError(event);
                }
            } catch (e) {
                this.isLog && console.log(this.requestId, 'socket is onclose catch' + this.sendCount, JSON.stringify(e), TAG);
            }
        };
    }

    close() {
        this.socket && this.socket.readyState === 1 && this.socket.close(1000);
    }

    write(data) {
        try {
            if (!this.socket || String(this.socket.readyState) !== '1') {
                setTimeout(() => {
                    if (this.socket && this.socket.readyState === 1) {
                        this.socket.send(data);
                    }
                }, 100);
                return false;
            }
            this.sendCount += 1;
            this.socket.send(data);
        } catch (e) {
            this.isLog && console.log(this.requestId, '发送数据 error catch', e, TAG);
        }
    }

    writeContent(contextPrompt) {
        try {
            if (!this.socket || this.socket.readyState !== 1) {
                this.isLog && console.log(this.requestId, 'writeContent failed: websocket not open', TAG);
                return false;
            }
            if (!contextPrompt || typeof contextPrompt !== 'object') {
                this.isLog && console.log(this.requestId, 'writeContent failed: invalid contextPrompt', TAG);
                return false;
            }
            const jsonData = JSON.stringify(contextPrompt);
            this.socket.send(jsonData);
            this.isLog && console.log(this.requestId, 'writeContent send', jsonData, TAG);
            return true;
        } catch (e) {
            this.isLog && console.log(this.requestId, 'writeContent error catch', e, TAG);
            return false;
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
}
typeof window !== 'undefined' && (window.SpeechRecognizerV2 = SpeechRecognizerV2);
