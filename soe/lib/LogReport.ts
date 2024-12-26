const DB_NAME = "LogReportDB";
const DB_VERSION = 1;
const DB_STORE_NAME = "LogData";
export default class LogReport {
  private IS_OPEN: boolean = false;
  private Log: Array<any>;
  private LogDb: any;
  constructor(isOpen: boolean) {
    this.IS_OPEN = isOpen;
    this.Log = [];
    this.LogDb = null;
  }
  LogInit() {
    try {
      if (this.IS_OPEN && window?.indexedDB) {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = () => {
          console.log("indexedDB error");
        };
        request.onsuccess = (event: any) => {
          const that = this;
          this.LogDb = event.target.result;
          window.addEventListener(
            "beforeunload",
            function (event) {
              that.CleanLog();
            },
            false
          );
          console.log("indexedDB success");
        };
        request.onupgradeneeded = (event: any) => {
          const db = event.target.result;
          // 创建另一个名为“names”的对象存储，并将 autoIncrement 标志设置为真。
          db.createObjectStore(DB_STORE_NAME, { autoIncrement: true });
          console.log("indexedDB onupgradeneeded");
        };
      }
    } catch (error) {
      console.log("indexDb初始化失败", error);
    }
  }
  LogAdd(log: any) {
    try {
      this.Log.push(log);
    } catch (error) {
      console.log("日志添加失败", error);
    }
  }
  async LogInsert() {
    try {
      if (this.Log.length === 0) {
        return ;
      }
      return new Promise((reslove, reject) => {
        const transaction = this.LogDb.transaction(
          [DB_STORE_NAME],
          "readwrite"
        );
        // 在所有数据添加完毕后的处理
        transaction.oncomplete = (event: any) => {
          console.log("日志全部添加完成了！");
        };

        transaction.onerror = (event: any) => {
          // 不要忘记错误处理！
        };

        const objectStore = transaction.objectStore(DB_STORE_NAME);
        const request = objectStore.add(JSON.stringify(this.Log));
        request.onsuccess = (event: any) => {
          console.log("日志添加成功！");
          // event.target.result === customer.ssn;
          this.Log = [];
          reslove(true);
        };
        request.onerror = (event: any) => {
          // 不要忘记错误处理！
          reslove(true);
        };
      });
    } catch (error) {
      console.log("日志存储失败", error);
    }
  }
  QueryLog() {
    try {
      return new Promise((reslove, reject) => {
        const transaction = this.LogDb.transaction([DB_STORE_NAME]);
        const objectStore = transaction.objectStore(DB_STORE_NAME);
        objectStore.getAll().onsuccess = (event: any) => {
          reslove(event.target.result);
        };
      });
    } catch (error) {
      console.log("日志查询失败", error);
      return null;
    }
  }
  CleanLog() {
    try {
      const request = this.LogDb.transaction([DB_STORE_NAME], "readwrite")
        .objectStore(DB_STORE_NAME)
        .clear();
      request.onsuccess = (event: any) => {
        // 删除成功！
        console.log("删除成功！");
      };
      request.onerror = (event: any) => {
        // 不要忘记错误处理！
        console.log("删除失败！");
      };
    } catch (error) {
      console.log("日志删除失败", error);
    }
  }
}

window && ((window as any).SoeNewLogReport = LogReport);
