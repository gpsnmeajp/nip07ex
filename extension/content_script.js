console.log("[nip07ex] [content_script.js]", location.origin);

//window.nostrを対象のサイトに注入する
const script = document.createElement('script');
script.src = chrome.runtime.getURL('content_injection.js');
document.head.appendChild(script);

//メッセージ処理(すべてbackground.jsに投げるだけ)
window.addEventListener('message', (e) => {
    //違うオリジンからのメッセージは無視
    if (e.origin != location.origin) { return; }
    //自スクリプト以外からのメッセージは無視
    if (e.data.uuid != "f4fcce3d-1ad5-98bf-d859-ddf1cdeb6429") { return; }

    console.log("[nip07ex] [content_script.js]", "onMessage from page", e.data, e.origin, e.ports);

    //対象のだったらそのまま投げ上げる
    if (e.data.type === "getPublicKey"
        || e.data.type === "signEvent"
        || e.data.type === "nip04.encrypt"
        || e.data.type === "nip04.decrypt"
    ) {
        console.log("[nip07ex] [content_script.js]", e.data.type);
        chrome.runtime.sendMessage({
            data: e.data,
            origin: e.origin
        }, (response) => {
            console.log("[nip07ex] [content_script.js]", "response", response);
            //帰ってきたものはそのまま下ろす
            e.ports[0].postMessage(response);
        });
    } else {
        //それ以外は無視
        console.error("[nip07ex] [content_script.js]", "Unkown message");
    }
});
