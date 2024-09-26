# 简介

欢迎使用腾讯云语音SDK，腾讯云语音SDK为开发者提供了访问腾讯云语音识别、口语评测等语音服务的配套开发工具，简化腾讯云语音服务的接入流程。

本项目是腾讯云语音SDK的JS语言版本。

# 浏览器兼容性问题
1、sdk内置录音采用 MediaDevices接口，不兼容ie浏览器、夸克浏览器和uc浏览器，其他浏览器兼容性具体文档可参考 https://developer.mozilla.org/zh-CN/docs/Web/API/MediaDevices  
2、目前经验证支持sdk的手机型号、浏览器（持续更新中～）

<table>
<thead>
<tr><th>手机型号</th><th>手机版本</th><th>浏览器</th><th>浏览器版本</th></tr>
</thead>
<tbody>
<tr><td rowspan="3">小米8</td><td rowspan="3">MIUI 12.0.3 (Android版本 10)</td><td>小米浏览器</td><td>V13.8.12</td></tr>
<tr><td>chrome浏览器</td><td>chrome 78.0.3904.96</td></tr>
<tr><td>QQ浏览器</td><td>11.2.1.1506</td></tr>
<tr><td rowspan="2">小米 MIX2</td><td rowspan="2">MIUI 12.0.1 (Android版本 9)</td><td>小米浏览器</td><td>V13.7.16</td></tr>
<tr><td>chrome浏览器</td><td>chrome 78.0.3904.96</td></tr>
<tr><td rowspan="4">小米6</td><td rowspan="4">(Android版本 8)</td><td>小米浏览器</td><td>V13.8.12</td></tr>
<tr><td>chrome浏览器</td><td>chrome V81.0.4044.117</td></tr>
<tr><td>QQ浏览器</td><td>V11.2.0.0508</td></tr>
<tr><td>火狐浏览器</td><td>V84.1.4</td></tr>
<tr><td rowspan="4">OPPO R11 Plus</td><td rowspan="4">(Android版本 9)</td><td>自带浏览器</td><td>V10.7.16.2_a088588_210118</td></tr>
<tr><td>chrome浏览器</td><td>V78.0.3904.96</td></tr>
<tr><td>QQ浏览器</td><td>V11.2.0.0504</td></tr>
<tr><td>火狐浏览器</td><td>V85.1.0</td></tr>
<tr><td rowspan="4">ViVo X23</td><td rowspan="4">(Android版本 8.0.1)</td><td>自带浏览器</td><td>V8.9.14.9</td></tr>
<tr><td>chrome浏览器</td><td>V70.0.3538.110</td></tr>
<tr><td>QQ浏览器</td><td>V11.2.0.0504</td></tr>
<tr><td>火狐浏览器</td><td>V85.1.0</td></tr>
<tr><td rowspan="4">三星SM-G955</td><td rowspan="4">(Android版本 9)</td><td>自带浏览器</td><td>V13.2.1.70</td></tr>
<tr><td>chrome浏览器</td><td>V81.0.4044.117</td></tr>
<tr><td>QQ浏览器</td><td>V11.0.8.8812 LAB</td></tr>
<tr><td>火狐浏览器</td><td>V84.1.4</td></tr>
<tr><td rowspan="4">iPhone8</td><td rowspan="4">iOS 14.3</td><td>Safari</td><td></td></tr>
<tr><td>chrome浏览器</td><td>87.0.4280.77</td></tr>
<tr><td>QQ浏览器</td><td>11.2.2.4684</td></tr>
<tr><td>UC 浏览器</td><td>V13.2.3.1428</td></tr>
<tr><td>IPhone XS Max</td><td>ios 14.2</td><td>safari</td><td></td></tr>
<tr><td>IPhone 8</td><td>ios 13.3.1</td><td>safari</td><td></td></tr>
<tr><td>IPhone 7 Plus</td><td>ios 13.6</td><td>safari</td><td></td></tr>
<tr><td>IPhone 12</td><td>ios 14.3</td><td>chrome浏览器</td><td>V87.0.4280.77</td></tr>
</tbody>
</table>

3、目前经验证不支持sdk的手机型号、浏览器（持续更新中～）

<table>
<thead>
<tr><th>手机型号</th><th>手机版本</th><th>浏览器</th><th>浏览器版本</th></tr>
</thead>
<tbody>
<tr><td>小米8</td><td>MIUI 12.0.3 (Android版本 10)</td><td>UC浏览器</td><td>V13.2.3.1103</td></tr>
<tr><td rowspan="2">小米 MIX2</td><td rowspan="2">MIUI 12.0.1 (Android版本 9)</td><td>QQ浏览器</td><td>11.2.1.1506</td></tr>
<tr><td>UC浏览器</td><td>V13.2.3.1103</td></tr>
<tr><td rowspan="3">IPhone XS Max</td><td rowspan="3">ios 14.2</td><td>chrome浏览器</td><td>V83.0.4103.88</td></tr>
<tr><td>QQ浏览器</td><td>V11.1.5.4664</td></tr>
<tr><td>火狐浏览器</td><td>V30.0</td></tr>
<tr><td rowspan="3">IPhone 8</td><td rowspan="3">ios 13.3.1</td><td>chrome浏览器</td><td>V87.0.4280.77</td></tr>
<tr><td>QQ浏览器</td><td>V10.6.3.4472</td></tr>
<tr><td>火狐浏览器</td><td>V30.0</td></tr>
<tr><td rowspan="3">IPhone 7 Plus</td><td rowspan="3">ios 13.6</td><td>chrome浏览器</td><td>V87.0.4280.77</td></tr>
<tr><td>QQ浏览器</td><td>V11.2.2.4684</td></tr>
<tr><td>火狐浏览器</td><td>V30.0</td></tr>
</tbody>
</table>

注意：在个别手机版本上也会存在兼容性问题：  
1）ios16.2不支持getUserMedia录音api;  
2）微信浏览器使用录音时，有版本要求 ios14.3+，6.5+（微信版本）；

# 依赖环境

1. 使用相关产品前需要在腾讯云控制台已开通相关语音产品。
2. 在腾讯云控制台[访问管理](https://console.cloud.tencent.com/cam/capi)页面获取 SecretID 和 SecretKey 。
3. 在腾讯云控制台[账号信息](https://console.cloud.tencent.com/developer)页面获取AppId。
4. 将获取的参数填入examples/config.js中  

注意：   
  1）SecretID 和 SecretKey 作为敏感信息，不建议直接放在前端代码里运行，可以通过接口服务获取，同时建议采取临时密钥方案，具体可参考 [临时身份凭证](https://cloud.tencent.com/document/product/1312/48195)  
  2）将获取到的 tmpSecretId、tmpSecretkey 和 Token 依次作为参数 secretid、secretkey 和 token传入


# 项目目录介绍

1. asr目录为语音识别sdk目录

2. soe目录为口语评测（新版）sdk目录


