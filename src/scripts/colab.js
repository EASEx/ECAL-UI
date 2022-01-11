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
  var result = [];
  if (nodes.length) {
    console.log(`We have ${nodes.length} nodes.`);
    nodes.forEach((node, i) => {
      var runButton =
        node.getElementsByTagName("colab-run-button").length == 1
          ? node.getElementsByTagName("colab-run-button")[0]
          : undefined;
      var inputNode =
        node.getElementsByClassName("inputarea horizontal layout code")
          .length == 1
          ? node.getElementsByClassName("inputarea horizontal layout code")[0]
          : undefined;
      if (inputNode && runButton) {
        result.push({
          index: i,
          input: inputNode.innerText.trim() || "",
          output: node.innerText.replace(inputNode.innerText, "").trim() || "",
          isExecuted: runButton.executionCount ? true : false,
          info: runButton.getInfo() || {
            status: "",
            timestamp: 0,
            user_tz: 0,
            elapsed: 0,
            user: {
              displayName: "",
              photoUrl: "",
              userId: "",
            },
            execution_count: 0,
          },
          hasError:
            runButton.hasError ||
            node.innerText
              .replace(inputNode.innerText, "")
              .trim()
              .toLowerCase()
              .includes("error") ||
            node.innerText
              .replace(inputNode.innerText, "")
              .trim()
              .toLowerCase()
              .includes("traceback"),
          busy: runButton.busy || false,
        });
      }
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
  document.addEventListener("keyup", () => {
    window.lastkeypressTime = Math.round(Date.now() / 1000);
  });

  document.addEventListener("mousemove", function (ev) {
    window.lastmousemoveTime = Math.round(Date.now() / 1000);
  });

  window.colabListeners = true;

  ecalLogger.log("All listeners ready!");
}
