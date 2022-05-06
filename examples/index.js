let webAudioSpeechRecognizer;
let isCanStop;
$(function () {
  const params = {
    signCallback: signCallback, // 鉴权函数
    // 用户参数
    secretid:  config.secretId,
    appid: config.appId,
    // 实时识别接口参数
    engine_model_type : '16k_zh', // 因为内置WebRecorder采样16k的数据，所以参数 engineModelType 需要选择16k的引擎，为 '16k_zh'
    // 以下为非必填参数，可跟据业务自行修改
    voice_format : 1,
    hotword_id : '08003a00000000000000000000000000',
    needvad: 1,
    filter_dirty: 1,
    filter_modal: 2,
    filter_punc: 0,
    convert_num_mode : 1,
    word_info: 2
  }
  $('#start').on('click', function () {
    webAudioSpeechRecognizer = new WebAudioSpeechRecognizer(params);
    const areaDom = $('#recognizeText');
    areaDom.text('');
    let resultText = '';
    $(this).hide();
    $('#connecting').show();
    // 开始识别
    webAudioSpeechRecognizer.OnRecognitionStart = (res) => {
      console.log('开始识别', res);
    };
    // 一句话开始
    webAudioSpeechRecognizer.OnSentenceBegin = (res) => {
      console.log('一句话开始', res);
      isCanStop = true;
      $('#end').show();
      $('#recognizing').show();
      $('#connecting').hide();
    };
    // 识别变化时
    webAudioSpeechRecognizer.OnRecognitionResultChange = (res) => {
      console.log('识别变化时', res);
      const currentText = `${resultText}${res.result.voice_text_str}`;
      areaDom.text(currentText);
    };
    // 一句话结束
    webAudioSpeechRecognizer.OnSentenceEnd = (res) => {
      console.log('一句话结束', res);
      resultText += res.result.voice_text_str;
      areaDom.text(resultText);
    };
    // 识别结束
    webAudioSpeechRecognizer.OnRecognitionComplete = (res) => {
      console.log('识别结束', res);
    };
    // 识别错误
    webAudioSpeechRecognizer.OnError = (res) => {
      console.log('识别失败', res)
      $('#end').hide();
      $('#recognizing').hide();
      $('#start').show();
      $('#connecting').hide();
    };
    webAudioSpeechRecognizer.start();
  });
  $('#end').on('click', function () {
    $(this).hide();
    $('#recognizing').hide();
    $('#start').show();
    if (isCanStop) {
      webAudioSpeechRecognizer.stop();
    }
  });
});
