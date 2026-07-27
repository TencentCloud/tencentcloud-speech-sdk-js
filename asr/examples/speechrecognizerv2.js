let webAudioSpeechRecognizerV2;
let isCanStop;

$(function () {
  const params = {
    signCallback: signCallback,
    secretid: config.secretId,
    secretkey: config.secretKey,
    appid: config.appId,
    engine_model_type: '16k_zh_en_speaker',
    // host: 'asr.cloud.tencent.com',  // 可选，指定连接 host（国际站等），签名始终用默认域名
  };

  $('#start').on('click', function () {
    webAudioSpeechRecognizerV2 = new WebAudioSpeechRecognizerV2(params);
    const areaDom = $('#recognizeText');
    areaDom.empty();
    // 按 sentence_id 维护每行 DOM，稳态(1)覆盖该行，非稳态(0)实时刷新该行
    const sentenceMap = {};
    $(this).addClass('display-none');
    $('#connecting').removeClass('display-none');

    webAudioSpeechRecognizerV2.OnRecognitionStart = (res) => {
      console.log('开始识别', res);
      isCanStop = true;
      $('#end').removeClass('display-none');
      $('#recognizing').removeClass('display-none');
      $('#connecting').addClass('display-none');
    };

    // sentence_type=0 非稳态(实时替换)，=1 稳态(定稿)；sentence_id 不同则换行
    webAudioSpeechRecognizerV2.OnRecognitionSentences = (res) => {
      console.log('识别结果', res);
      const list = res.sentences && res.sentences.sentence_list;
      if (!list || !list.length) return;
      list.forEach((item) => {
        const id = item.sentence_id;
        if (id === undefined || id === null) return;
        let lineDom = sentenceMap[id];
        if (!lineDom) {
          lineDom = $('<div class="sentence-line"></div>');
          areaDom.append(lineDom);
          sentenceMap[id] = lineDom;
        }
        const speakerLabel = item.speaker_id === -1 || item.speaker_id === undefined
          ? '说话人识别中'
          : `说话人${item.speaker_id}`;
        lineDom.text(`${speakerLabel}：${item.sentence || ''}`);
        lineDom.toggleClass('sentence-stable', item.sentence_type === 1);
      });
    };

    webAudioSpeechRecognizerV2.OnRecognitionComplete = (res) => {
      console.log('识别结束', res);
      $('#end').addClass('display-none');
      $('#recognizing').addClass('display-none');
      $('#start').removeClass('display-none');
    };

    webAudioSpeechRecognizerV2.OnError = (res) => {
      console.log('识别失败', res);
      $('#end').addClass('display-none');
      $('#recognizing').addClass('display-none');
      $('#start').removeClass('display-none');
      $('#connecting').addClass('display-none');
    };

    webAudioSpeechRecognizerV2.start();
  });

  $('#end').on('click', function () {
    $(this).addClass('display-none');
    $('#recognizing').addClass('display-none');
    $('#start').removeClass('display-none');
    if (isCanStop) {
      webAudioSpeechRecognizerV2.stop();
    }
  });
});
