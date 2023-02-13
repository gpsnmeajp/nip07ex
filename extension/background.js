console.log("[nip07ex] [background.js]");

//content_scriptからのメッセージを処理
chrome.runtime.onMessage.addListener((e, sender, sendResponse) => {
    //自スクリプト以外からのメッセージは無視
    if (e.data.uuid != "f4fcce3d-1ad5-98bf-d859-ddf1cdeb6429") { return; }

    console.log("[nip07ex] [background.js]", e.data.type, e.origin, e.data.uuid);

    console.log("[nip07ex] [background.js]", "onMessage from background", e);
    if (e.data.type === "getPublicKey"
        || e.data.type === "signEvent"
        || e.data.type === "nip04.encrypt"
        || e.data.type === "nip04.decrypt"
    ) {
        //Nativeをcallする
        chrome.runtime.sendNativeMessage("jp.ne.sakura.sabowl.nip07ex", e, (response) => {
            console.log("[nip07ex] [background.js]", "response", response);
            //帰ってきたものはそのまま下ろす
            sendResponse(response);
        }
        );
        //非同期応答
        return true;
    } else {
        console.error("[nip07ex] [background.js]", "Unkown message");
    }
    sendResponse();
});