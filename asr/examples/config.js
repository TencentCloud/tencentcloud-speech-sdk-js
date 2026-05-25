/*
* 1）SecretID 和 SecretKey 作为敏感信息，不建议直接放在前端代码里运行，可以通过接口服务获取，同时建议采取临时密钥方案，具体可参考 [临时身份凭证](https://cloud.tencent.com/document/product/1312/48195)
  2）将获取到的 tmpSecretId、tmpSecretkey 和 Token 依次作为参数 secretid、secretkey 和 token传入
* */
let config = {
  secretKey: '',
  secretId: '',
  appId: 0,
}
window.config = config

