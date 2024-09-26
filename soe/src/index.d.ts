export {};
declare module "crypto-js";
declare global {
  interface Window {
    CryptoJSTest: any;
    MozWebSocket: WebSocket;
    webkitAudioContext: any;
    WebRecorder: any
    SowNewSocketSdk: any;
  }
  interface Navigator {
    getUserMedia: any;
    webkitGetUserMedia: any;
    mozGetUserMedia: any;
    msGetUserMedia: any;
  }
}
