(function () {
  const startBtn = document.getElementById("start");
  const stopBtn = document.getElementById("stop");
  startBtn.onclick = function () {
    try {
      const params = {
        secretid: "",
        secretkey: "",
        appid: "",
        ref_text: "你好你好你好",
        sentence_info_enabled: 1,
        eval_mode: 1,
      };
      const res = new window.SowNewSocketSdk(params);
      res.start();
      res.OnError = function (err) {
        console.log(err);
      };
      res.OnEvaluationStart = function (res) {
        console.log("res.OnEvaluationStart", res);
      };
      stopBtn.onclick = function () {
        res.stop();
      };
    } catch (error) {
      console.log(error);
    }
  };
})();
