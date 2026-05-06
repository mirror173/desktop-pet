function createAppLifecycleController({ app, BrowserWindow, createWindow, showPetWindow, unregisterShortcuts, getIsQuitting, setIsQuitting, onBeforeQuit }) {
  function handleSecondInstance() {
    showPetWindow();
  }

  function handleActivate() {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
    showPetWindow();
  }

  function handleWindowAllClosed(event) {
    event.preventDefault();
  }

  function handleBeforeQuit() {
    setIsQuitting(true);
    onBeforeQuit?.();
  }

  function handleWillQuit() {
    unregisterShortcuts();
  }

  function registerLifecycleEvents() {
    app.on('second-instance', handleSecondInstance);
    app.on('activate', handleActivate);
    app.on('window-all-closed', handleWindowAllClosed);
    app.on('before-quit', handleBeforeQuit);
    app.on('will-quit', handleWillQuit);
  }

  return {
    registerLifecycleEvents,
    handleSecondInstance,
    handleActivate,
    handleWindowAllClosed,
    handleBeforeQuit,
    handleWillQuit
  };
}

module.exports = { createAppLifecycleController };
