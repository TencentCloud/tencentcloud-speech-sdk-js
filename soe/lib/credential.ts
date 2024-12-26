// 识别需要过滤的参数
const needFiltrationParams = [
  "appid",
  "secretkey",
  "token",
  "duration",
  "frameSize",
  "audioSource",
];

export const guid = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
export class SoeNewCredential {
  config: any;
  query: any;
  constructor(query: any) {
    this.config = {
      appid: query.appid,
      secretid: query.secretid,
      token: query.token,
    };
    this.query = query || null;
  }

  formatSignString(params: any, isEncodeURIComponent: boolean = false) {
    let strParam = "";
    let signStr = "soe.cloud.tencent.com/soe/api/";
    if (this.config["appid"]) {
      signStr += this.config["appid"];
    }
    const keys = Object.keys(params);
    keys.sort();
    for (const k in keys) {
      strParam += `&${keys[k]}=${
        isEncodeURIComponent && typeof params[keys[k]] === "string"
          ? encodeURIComponent(params[keys[k]])
          : params[keys[k]]
      }`;
    }
    return `${signStr}?${strParam.slice(1)}`;
  }
  async createQuery() {
    let params: any = {};
    const time = new Date().getTime();
    // const guid = () => {
    //   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    //     const r = Math.random() * 16 | 0,
    //       v = c === 'x' ? r : (r & 0x3 | 0x8);
    //     return v.toString(16);
    //   });
    // };
    params["secretid"] = this.config.secretid || "";
    params["server_engine_type"] = this.query.server_engine_type || "16k_zh";
    params["timestamp"] = Math.round(time / 1000);
    params["expired"] = Math.round(time / 1000) + 24 * 60 * 60;
    params["nonce"] = Math.round(time / 100000);
    params["voice_id"] = this.query.voice_id;
    params["eval_mode"] = this.query.eval_mode || 0;
    params["score_coeff"] = this.query.score_coeff || 1.0;
    this.config.token && (params["token"] = this.config.token);

    const tempQuery = { ...this.query };
    for (let i = 0, len = needFiltrationParams.length; i < len; i++) {
      if (tempQuery.hasOwnProperty(needFiltrationParams[i])) {
        delete tempQuery[needFiltrationParams[i]];
      }
    }

    params = {
      ...tempQuery,
      ...params,
    };
    return params;
  }
  // 获取签名原文
  async getSignStr() {
    const queryStr = await this.createQuery();
    const urlStr = this.formatSignString(queryStr, true);
    const signStr = this.formatSignString(queryStr, false);
    return { urlStr, signStr };
    // return this.formatSignString(queryStr, true);
  }
}
