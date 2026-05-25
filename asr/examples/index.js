let webAudioSpeechRecognizer;
let isCanStop;

// 从表单构建 contextPrompt，对应 Go demo 的 ContextPrompt 结构
function buildContextPrompt() {
  const hotwordList = ($('#hotwordList').val() || '').trim();
  const promptText = ($('#promptText').val() || '').trim();
  const promptItems = [];

  if (promptText) {
    const lines = promptText.split('\n').map((s) => s.trim()).filter(Boolean);
    if (lines.length > 0) {
      promptItems.push({
        context_type: 'scene',
        context_data: lines.map((text) => ({ text })),
      });
    }
  }

  if (!hotwordList && promptItems.length === 0) {
    return null;
  }

  return {
    context_type: 'context',
    hotword_list: hotwordList,
    prompt: promptItems,
  };
}

$(function () {
  const params = {
    signCallback: signCallback,
    secretid:  config.secretId,
    secretkey: config.secretKey,
    appid: config.appId,
    // token: config.token,
    engine_model_type : '16k_zh_test',
    // voice_format : 1,
    // hotword_id : '08003a00000000000000000000000000',
    // needvad: 1,
    // filter_dirty: 1,
    // filter_modal: 2,
    // filter_punc: 0,
    // convert_num_mode : 1,
    // word_info: 2
  };

  $('#start').on('click', function () {
    webAudioSpeechRecognizer = new WebAudioSpeechRecognizer(params);
    const areaDom = $('#recognizeText');
    areaDom.text('');
    let resultText = '';
    $(this).addClass('display-none');
    $('#connecting').removeClass('display-none');
    $('#sendContext').prop('disabled', true);
    $('#sendContextTip').text('');

    // 开始识别
    webAudioSpeechRecognizer.OnRecognitionStart = (res) => {
      console.log('开始识别', res);
      isCanStop = true;
      $('#end').removeClass('display-none');
      $('#recognizing').removeClass('display-none');
      $('#connecting').addClass('display-none');
      $('#sendContext').prop('disabled', false);

      // 对应 Go demo：Start() 后立即 WriteContent 发送上下文
      const contextPrompt = buildContextPrompt();
      if (contextPrompt) {
        const ok = webAudioSpeechRecognizer.writeContent(contextPrompt);
        if (ok) {
          console.log('自动发送 contextPrompt', contextPrompt);
          $('#sendContextTip').text('已自动发送：' + JSON.stringify(contextPrompt));
        } else {
          console.warn('自动发送 contextPrompt 失败');
          $('#sendContextTip').text('自动发送失败：连接未建立或已关闭');
        }
      }
    };

    // 一句话开始
    webAudioSpeechRecognizer.OnSentenceBegin = (res) => {
      console.log('一句话开始', res);
    };
    // 识别变化时
    webAudioSpeechRecognizer.OnRecognitionResultChange = (res) => {
      console.log('识别变化时', res);
      areaDom.text(`${resultText}${res.result.voice_text_str}`);
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
      $('#end').addClass('display-none');
      $('#recognizing').addClass('display-none');
      $('#start').removeClass('display-none');
      $('#sendContext').prop('disabled', true);
    };
    // 识别错误
    webAudioSpeechRecognizer.OnError = (res) => {
      console.log('识别失败', res);
      $('#end').addClass('display-none');
      $('#recognizing').addClass('display-none');
      $('#start').removeClass('display-none');
      $('#connecting').addClass('display-none');
      $('#sendContext').prop('disabled', true);
    };

    webAudioSpeechRecognizer.start();
  });

  $('#end').on('click', function () {
    $(this).addClass('display-none');
    $('#recognizing').addClass('display-none');
    $('#start').removeClass('display-none');
    $('#sendContext').prop('disabled', true);
    if (isCanStop) {
      webAudioSpeechRecognizer.stop();
    }
  });

  // 手动发送上下文 / 临时热词
  $('#sendContext').on('click', function () {
    if (!webAudioSpeechRecognizer) {
      $('#sendContextTip').text('请先开始识别');
      return;
    }
    const contextPrompt = buildContextPrompt();
    if (!contextPrompt) {
      $('#sendContextTip').text('请至少填写 hotword_list 或任意一个 prompt 文本');
      return;
    }
    const ok = webAudioSpeechRecognizer.writeContent(contextPrompt);
    if (ok) {
      console.log('手动发送 contextPrompt', contextPrompt);
      $('#sendContextTip').text('已发送：' + JSON.stringify(contextPrompt));
    } else {
      $('#sendContextTip').text('发送失败：连接未建立或已关闭');
    }
  });
});
