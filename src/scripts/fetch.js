runButtons = document.getElementsByTagName("colab-run-button") || [];
if (runButtons.length < 2) {
  ecalLogger.warn(
    "Unable to find fetch button! Document appears to be modified"
  );
  window.ipcAPI.invoke.sendWarning(
    "Unable to find fetch button! Document appears to be modified"
  );
} else {
  runButtons[1].click();
}
