var ecalLogger = {
  /**
   * Description
   * @param {any} log
   * @returns {any}
   */
  log: (log) => {
    var time = new Date();
    console.log(`[ECAL] : ${time.toTimeString()} : ${log}`);
  },

  /**
   * Description
   * @param {any} log
   * @returns {any}
   */
  warn: (log) => {
    var time = new Date();
    console.warn(`[ECAL] : ${time.toTimeString()} : ${log}]`);
  },
};

/**
 * Description:
 * Logs the current state of jupyter notebook cells.
 *
 * Only works with Google Colaboratory.
 * @returns {any} void
 */
var logNotebookCells = () => {
  var nodes = document.querySelectorAll(".cell.code");
  var inputNodes = document.getElementsByClassName(
    "inputarea horizontal layout code"
  );
  var result = [];
  if (nodes.length && inputNodes.length == nodes.length) {
    console.log(`We have ${nodes.length} nodes.`);
    nodes.forEach((node, i) => {
      var runButton = node.getElementsByTagName("colab-run-button")[0];
      result.push({
        index: i,
        input: inputNodes[i].innerText.trim() || "",
        output:
          node.innerText.replace(inputNodes[i].innerText, "").trim() || "",
        isExecuted: runButton.executionCount ? true : false,
        info: runButton.getInfo() || {},
        hasError:
          runButton.hasError ||
          node.innerText
            .replace(inputNodes[i].innerText, "")
            .trim()
            .toLowerCase()
            .includes("error") ||
          node.innerText
            .replace(inputNodes[i].innerText, "")
            .trim()
            .toLowerCase()
            .includes("traceback"),
        busy: runButton.busy || false,
      });
    });
  }
  return result;
};

/**
 * Description
 * @returns {any}
 */
var listLoadedModules = () => {
  var datascienceModulesState = {
    numpy: false,
    pandas: false,
    matplotlib: false,
  };
  var inputNodes = document.getElementsByClassName(
    "inputarea horizontal layout code"
  );
  for (var index = 0; index < inputNodes.length; index++) {
    var text = inputNodes[index].innerText;
    for (var key in datascienceModulesState) {
      if (
        Object.prototype.hasOwnProperty.call(datascienceModulesState, key) &&
        text.includes(key)
      ) {
        datascienceModulesState[key] = true;
      }
    }
  }
  return datascienceModulesState;
};

if (!window.colabListeners) {
  window.mouseTrail = [];

  window.ipcAPI.on.askDatafromJupyter(() => {
    if (window.document.URL.toString().includes("colab.research.google")) {
      var celldata = logNotebookCells();
      var modules = listLoadedModules();
      var lastkeypressTime = window.lastkeypressTime || 0;
      console.log("received event askData");
      if (!window.lastDataCall || Date.now() - window.lastDataCall > 5000) {
        window.lastDataCall = Date.now();
        window.ipcAPI.invoke.sendDatafromJupyter({
          celldata,
          modules,
          lastkeypressTime,
          windowURL: window.document.URL,
          mouseTrail: window.mouseTrail.slice(-1000) || [],
        });
      }
    } else {
      ecalLogger.warn(
        "ECAL trying to read data from non Jupyter page. Ignoring!"
      );
    }
  });

  document.addEventListener("keyup", () => {
    window.lastkeypressTime = Date.now();
  });

  document.addEventListener("mousemove", function (ev) {
    window.mouseTrail.push({
      x: ev.pageX,
      y: ev.pageY,
    });
  });

  window.colabListeners = true;

  ecalLogger.log("All listeners ready!");
}
