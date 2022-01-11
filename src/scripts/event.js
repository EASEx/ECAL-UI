async function postData(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    body: JSON.stringify(data),
  });
  return response.json();
}

if (window.sseSource === undefined) {
  window.mouseTrail = [];
  window.lastkeypressTime = Math.round(Date.now() / 1000);
  window.lastmousemoveTime = Math.round(Date.now() / 1000);
  window.sseSource = new EventSource("http://localhost:8080/sse?id=1");
  window.sseSource.addEventListener("jupyter_ping", (ev) => {
    if (window.document.URL.toString().includes("colab.research.google")) {
      var celldata = logNotebookCells();
      var writtenModules = listLoadedModules();
      var lastkeypressTime =
        window.lastkeypressTime || Math.round(Date.now() / 1000);
      var lastmousemoveTime =
        window.lastmousemoveTime || Math.round(Date.now() / 1000);
      console.log("received event askData");
      var time = new Date();
      if (
        !window.lastDataCall ||
        Math.round(Date.now() / 1000) - window.lastDataCall > 20
      ) {
        window.lastDataCall = Math.round(Date.now() / 1000);
        postData("http://localhost:8080/metrics?id=1", {
          celldata,
          lastmousemoveTime,
          lastkeypressTime,
          windowURL: window.document.URL,
          timestamp: time.toTimeString(),
        });
      }
    } else {
      ecalLogger.warn(
        "ECAL trying to read data from non Jupyter page. Ignoring!"
      );
    }
  });
}
