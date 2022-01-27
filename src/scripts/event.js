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
  window.test_id = "%TEST_ID%"; // Will be replaced by orignal test id on execution
  window.client_id = "%CLIENT_ID%"; // Will be replaced by orignal test id on execution
  window.server_url = "%SERVER_URL%";
  window.lastkeypressTime = Math.round(Date.now() / 1000);
  window.lastmousemoveTime = Math.round(Date.now() / 1000);
  window.sseSource = new EventSource(
    `${window.server_url}/sse?id=${window.client_id}&test_id=${window.test_id}`
  );

  window.sseSource.addEventListener(`jupyter_ping_${test_id}`, (ev) => {
    if (window.document.URL.toString().includes("colab.research.google")) {
      var celldata = logNotebookCells();
      var lastkeypressTime =
        window.lastkeypressTime || Math.round(Date.now() / 1000);
      var lastmousemoveTime =
        window.lastmousemoveTime || Math.round(Date.now() / 1000);
      console.log("received event askData");
      if (
        !window.lastDataCall ||
        Math.round(Date.now() / 1000) - window.lastDataCall > 20
      ) {
        window.lastDataCall = Math.round(Date.now() / 1000);
        postData(
          `http://localhost:8080/metrics?id=${window.client_id}&test_id=${window.test_id}`,
          {
            celldata,
            lastmousemoveTime,
            lastkeypressTime,
            windowURL: window.document.URL,
            timestamp: Math.round(Date.now() / 1000),
          }
        );
      }
      window.ipcAPI.invoke.sendMetric(window.client_id, window.test_id, {
        celldata,
        lastmousemoveTime,
        lastkeypressTime,
        windowURL: window.document.URL,
        timestamp: Math.round(Date.now() / 1000),
      });
    } else {
      ecalLogger.warn(
        "ECAL trying to read data from non Jupyter page. Ignoring!"
      );
    }
  });

  window.sseSource.addEventListener(`trigger`, (ev) => {
    console.log(ev.data);
    window.ipcAPI.invoke.sendAction(ev.data.toString());
  });
}
