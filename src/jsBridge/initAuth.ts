/*
  This function for calling initAuth in the JSBridge
*/
const initAuth = (
  callback: (authorizationCode: string) => void,
  callbackError: (errorCode: string, errorDescription: string) => void
) => {

  console.log("[initAuth] sssjs");
  if (window.JSBridge) {
    console.log("[initAuth] JSBridge");
    // android
    window.bridge.initAuthCallback = callback;
    window.bridge.initAuthCallbackError = callbackError;
    window.JSBridge.initAuth?.("b6fb5cc9-67ba-4cf0-a8ab-89c096ec400e","openid+offline+paotangid.citizen");
  } else if (window.webkit) {
    console.log("[initAuth] webkit");
    // ios
    window.bridge.initAuthCallback = callback;
    window.bridge.initAuthCallbackError = callbackError;
    const message = { 
      name: "initAuth" ,
      clientId: "b6fb5cc9-67ba-4cf0-a8ab-89c096ec400e~45F5sySblGX1A8jQT0nG",
      scope: null
    };
    window.webkit.messageHandlers.observer.postMessage(message);
  }
};

export default initAuth;
