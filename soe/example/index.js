(function () {
  const startBtn = document.getElementById("start");
  const stopBtn = document.getElementById("stop");
  const downBtn = document.getElementById("down");
  let res = null;
  startBtn.onclick = function () {
    try {
      const params = {
        secretid: "",
        secretkey: "",
        appid: "",
        ref_text: "你好你  好你好",
        sentence_info_enabled: 1,
        eval_mode: 1,
      };
      res = new window.SowNewSocketSdk(params);
      res.start();
      res.OnError = function (err) {
        console.log(err);
      };
      res.OnEvaluationStart = function (res) {
        console.log("res.OnEvaluationStart", res);
      };
      res.OnRecorderStop = function (res) {
        console.log("res.OnStop", res);
      }
    } catch (error) {
      console.log(error);
    }
  };
  stopBtn.onclick = function () {
    res && res.stop();
  };
  downBtn.onclick = async function () {
    const logs = res && (await res.OndownloadLogs());
    console.log(logs);
  };
})();
